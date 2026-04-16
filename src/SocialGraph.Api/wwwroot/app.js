const state = {
  entities: [],
  relationships: [],
  graph: { nodes: [], links: [] },
  searchQuery: "",
  relationshipFilters: {
    text: "",
    kind: "",
    direction: "all"
  },
  selectedEntityId: null,
  selectedRelationshipId: null,
  selectedRelationship: null,
  focusedEntityId: null,
  loading: {
    entities: false,
    relationships: false,
    graph: false
  },
  error: ""
};

const dom = {
  entityList: document.getElementById("entityList"),
  relationshipList: document.getElementById("relationshipList"),
  statusSummary: document.getElementById("statusSummary"),
  selectionSummary: document.getElementById("selectionSummary"),
  relationshipModeTag: document.getElementById("relationshipModeTag"),
  relationshipResultsSummary: document.getElementById("relationshipResultsSummary"),
  relationshipSearch: document.getElementById("relationshipSearch"),
  relationshipKindFilter: document.getElementById("relationshipKindFilter"),
  relationshipDirectionFilter: document.getElementById("relationshipDirectionFilter"),
  relationshipClearFilters: document.getElementById("relationshipClearFilters"),
  focusTag: document.getElementById("focusTag"),
  errorBanner: document.getElementById("errorBanner"),
  graph: document.getElementById("graph"),
  entitySearch: document.getElementById("entitySearch"),
  entityForm: document.getElementById("entityForm"),
  entityFormTitle: document.getElementById("entityFormTitle"),
  entityName: document.getElementById("entityName"),
  entityNote: document.getElementById("entityNote"),
  entitySubmit: document.getElementById("entitySubmit"),
  entityReset: document.getElementById("entityReset"),
  entityDelete: document.getElementById("entityDelete"),
  relationshipForm: document.getElementById("relationshipForm"),
  relationshipFormTitle: document.getElementById("relationshipFormTitle"),
  relationshipInspectorMeta: document.getElementById("relationshipInspectorMeta"),
  relationshipFocusNotice: document.getElementById("relationshipFocusNotice"),
  relationshipSource: document.getElementById("relationshipSource"),
  relationshipTarget: document.getElementById("relationshipTarget"),
  relationshipKind: document.getElementById("relationshipKind"),
  relationshipNote: document.getElementById("relationshipNote"),
  relationshipReset: document.getElementById("relationshipReset"),
  relationshipDelete: document.getElementById("relationshipDelete"),
  relationshipSubmit: document.getElementById("relationshipSubmit"),
  focusSelected: document.getElementById("focusSelected"),
  showFullGraph: document.getElementById("showFullGraph"),
  reloadAll: document.getElementById("reloadAll"),
  entitiesLoading: document.getElementById("entitiesLoading"),
  relationshipsLoading: document.getElementById("relationshipsLoading"),
  graphLoading: document.getElementById("graphLoading")
};

function selectedEntity() {
  return state.entities.find(entity => entity.id === state.selectedEntityId) ?? null;
}

function selectedRelationship() {
  if (state.selectedRelationship && state.selectedRelationship.id === state.selectedRelationshipId) {
    return state.selectedRelationship;
  }

  return state.relationships.find(edge => edge.id === state.selectedRelationshipId) ?? null;
}

function relationshipMode() {
  return state.selectedEntityId ? "entity" : "global";
}

function relationshipMatchesText(edge, query) {
  if (!query) {
    return true;
  }

  return [
    edge.id,
    edge.sourceEntityId,
    edge.targetEntityId,
    edge.kind,
    edge.note
  ].some(value => (value || "").toLowerCase().includes(query));
}

function relationshipMatchesDirection(edge) {
  if (!state.selectedEntityId || state.relationshipFilters.direction === "all") {
    return true;
  }

  if (state.relationshipFilters.direction === "incoming") {
    return edge.targetEntityId === state.selectedEntityId;
  }

  if (state.relationshipFilters.direction === "outgoing") {
    return edge.sourceEntityId === state.selectedEntityId;
  }

  return true;
}

function getFilteredRelationships() {
  const query = state.relationshipFilters.text.trim().toLowerCase();

  return state.relationships.filter(edge =>
    relationshipMatchesText(edge, query) &&
    (!state.relationshipFilters.kind || edge.kind === state.relationshipFilters.kind) &&
    relationshipMatchesDirection(edge));
}

function setError(message) {
  state.error = message || "";
  dom.errorBanner.hidden = !state.error;
  dom.errorBanner.textContent = state.error;
}

function setLoading(key, value) {
  state.loading[key] = value;
  const indicator = dom[key + "Loading"];
  if (indicator) {
    indicator.hidden = !value;
  }
}

async function requestJson(url, options) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const body = await response.json();
      message = body.error || body.title || message;
    } catch {
      message = await response.text() || message;
    }

    throw new Error(`${response.status} ${message}`.trim());
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function render() {
  renderEntityList();
  renderEntityForm();
  renderRelationshipControls();
  renderRelationshipList();
  renderGraphMeta();
  renderGraph(state.graph);
}

function renderEntityList() {
  dom.entityList.innerHTML = "";

  const query = state.searchQuery.trim().toLowerCase();
  const entities = state.entities.filter(entity =>
    !query || entity.name.toLowerCase().includes(query) || entity.note.toLowerCase().includes(query));

  if (!entities.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = query ? "No entities match the current filter." : "No entities yet. Create the first one below.";
    dom.entityList.appendChild(empty);
    return;
  }

  for (const entity of entities) {
    const card = document.createElement("article");
    card.className = "entity-card";
    if (entity.id === state.selectedEntityId) {
      card.classList.add("active");
    }

    const heading = document.createElement("strong");
    heading.textContent = entity.name;

    const note = document.createElement("p");
    note.className = "muted";
    note.textContent = entity.note || "No note";

    const meta = document.createElement("span");
    meta.className = "tag";
    meta.textContent = entity.id;

    const button = document.createElement("button");
    button.className = "ghost";
    button.type = "button";
    button.textContent = entity.id === state.selectedEntityId ? "Selected" : "Select entity";
    button.addEventListener("click", () => selectEntity(entity.id));

    card.append(heading, note, meta, button);
    dom.entityList.appendChild(card);
  }
}

function renderEntityForm() {
  const entity = selectedEntity();
  dom.entityFormTitle.textContent = entity ? `Edit entity: ${entity.name}` : "Create entity";
  dom.entitySubmit.textContent = entity ? "Save changes" : "Create entity";
  dom.entityDelete.hidden = !entity;

  if (!document.activeElement || !dom.entityForm.contains(document.activeElement)) {
    dom.entityName.value = entity?.name || "";
    dom.entityNote.value = entity?.note || "";
  }
}

function syncEntityOptions(select, preferredId) {
  const currentValue = select.value;
  select.innerHTML = "";

  for (const entity of state.entities) {
    const option = document.createElement("option");
    option.value = entity.id;
    option.textContent = `${entity.name} (${entity.id})`;
    select.appendChild(option);
  }

  if (!state.entities.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No entities available";
    select.appendChild(option);
    return;
  }

  const nextValue = preferredId && state.entities.some(entity => entity.id === preferredId)
    ? preferredId
    : state.entities.some(entity => entity.id === currentValue)
      ? currentValue
      : state.entities[0].id;

  select.value = nextValue;
}

function syncRelationshipKindOptions() {
  const currentValue = dom.relationshipKindFilter.value;
  const kinds = [...new Set(state.relationships.map(edge => edge.kind).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right));

  dom.relationshipKindFilter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "All kinds";
  dom.relationshipKindFilter.appendChild(allOption);

  for (const kind of kinds) {
    const option = document.createElement("option");
    option.value = kind;
    option.textContent = kind;
    dom.relationshipKindFilter.appendChild(option);
  }

  if (currentValue && kinds.includes(currentValue)) {
    dom.relationshipKindFilter.value = currentValue;
  } else {
    dom.relationshipKindFilter.value = "";
    state.relationshipFilters.kind = "";
  }
}

function inferRelationshipTarget(selectedId) {
  const otherEntity = state.entities.find(entity => entity.id !== selectedId);
  return otherEntity?.id || selectedId;
}

function renderRelationshipControls() {
  const hasEntities = state.entities.length > 0;
  const entity = selectedEntity();
  const relationship = selectedRelationship();
  const filteredRelationships = getFilteredRelationships();
  const selectedRelationshipVisibleInGraph = relationship
    ? state.graph.links.some(link => link.id === relationship.id)
    : true;

  syncEntityOptions(dom.relationshipSource, relationship?.sourceEntityId || entity?.id || null);
  syncEntityOptions(
    dom.relationshipTarget,
    relationship?.targetEntityId || (entity ? inferRelationshipTarget(entity.id) : null));
  syncRelationshipKindOptions();

  dom.relationshipDirectionFilter.disabled = !entity;
  if (!entity) {
    dom.relationshipDirectionFilter.value = "all";
    state.relationshipFilters.direction = "all";
  }

  dom.relationshipForm.querySelectorAll("input, textarea, select, button").forEach(control => {
    control.disabled = !hasEntities;
  });

  dom.relationshipFormTitle.textContent = relationship ? "Edit relationship" : "Create relationship";
  dom.relationshipSubmit.textContent = relationship ? "Save relationship" : "Create relationship";
  dom.relationshipDelete.hidden = !relationship;
  dom.relationshipReset.textContent = relationship ? "Clear selection" : "Reset form";

  if (!document.activeElement || !dom.relationshipForm.contains(document.activeElement)) {
    dom.relationshipKind.value = relationship?.kind || "";
    dom.relationshipNote.value = relationship?.note || "";
  }

  dom.focusSelected.disabled = !entity;
  dom.showFullGraph.disabled = !state.focusedEntityId;

  dom.relationshipModeTag.textContent = entity ? `Entity context: ${entity.name}` : "Global browse";
  dom.relationshipResultsSummary.textContent = entity
    ? `${filteredRelationships.length} of ${state.relationships.length} incident relationships shown`
    : `${filteredRelationships.length} of ${state.relationships.length} relationships shown`;

  if (relationship) {
    dom.relationshipInspectorMeta.textContent =
      `Relationship ${relationship.id}: ${relationship.sourceEntityId} → ${relationship.targetEntityId}`;
  } else {
    dom.relationshipInspectorMeta.textContent =
      "Select a relationship from the filtered list or graph to edit it. Clear the selection to create a new one.";
  }

  dom.relationshipFocusNotice.hidden = !relationship || selectedRelationshipVisibleInGraph;
  dom.relationshipFocusNotice.textContent =
    relationship && !selectedRelationshipVisibleInGraph
      ? "The selected relationship is outside the currently focused one-hop graph. Show the full graph or refocus to see it highlighted."
      : "";

  if (relationship && entity) {
    dom.selectionSummary.textContent =
      `${entity.name} is selected. Filtering ${state.relationships.length} incident relationships and editing ${relationship.id}.`;
  } else if (relationship) {
    dom.selectionSummary.textContent =
      `Global relationship browsing is active. Inspecting ${relationship.id} directly from the graph or filtered list.`;
  } else if (entity) {
    dom.selectionSummary.textContent =
      `${entity.name} is selected. Use filters to narrow incoming, outgoing, or all incident relationships.`;
  } else {
    dom.selectionSummary.textContent =
      "Global relationship browsing is active. Filter all relationships, then inspect one without selecting an entity first.";
  }
}

function renderRelationshipList() {
  dom.relationshipList.innerHTML = "";

  const edges = getFilteredRelationships();

  if (!state.relationships.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = relationshipMode() === "entity"
      ? "No relationships for the selected entity yet."
      : "No relationships yet. Create the first relationship in the inspector below.";
    dom.relationshipList.appendChild(empty);
    return;
  }

  if (!edges.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No relationships match the current filters.";
    dom.relationshipList.appendChild(empty);
    return;
  }

  for (const edge of edges) {
    const card = document.createElement("article");
    card.className = "relationship-card";
    if (edge.id === state.selectedRelationshipId) {
      card.classList.add("active");
    }
    card.addEventListener("click", () => selectRelationship(edge.id));

    const row = document.createElement("div");
    row.className = "relationship-row";

    const title = document.createElement("div");
    title.innerHTML = `<strong>${edge.sourceEntityId}</strong> <span class="muted">→</span> <strong>${edge.targetEntityId}</strong>`;

    const kind = document.createElement("span");
    kind.className = "tag";
    kind.textContent = edge.kind;

    row.append(title, kind);

    const note = document.createElement("p");
    note.className = "muted";
    note.textContent = edge.note || "No note";

    const meta = document.createElement("p");
    meta.className = "muted";
    meta.textContent = `ID: ${edge.id}`;

    const actions = document.createElement("div");
    actions.className = "actions";

    const selectButton = document.createElement("button");
    selectButton.className = "ghost";
    selectButton.type = "button";
    selectButton.textContent = edge.id === state.selectedRelationshipId ? "Selected" : "Inspect";
    selectButton.addEventListener("click", event => {
      event.stopPropagation();
      selectRelationship(edge.id);
    });

    const focusButton = document.createElement("button");
    focusButton.className = "ghost";
    focusButton.type = "button";
    focusButton.textContent = "Focus source";
    focusButton.addEventListener("click", event => {
      event.stopPropagation();
      focusGraph(edge.sourceEntityId);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "danger";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", event => {
      event.stopPropagation();
      deleteRelationship(edge.id);
    });

    actions.append(selectButton, focusButton, deleteButton);
    card.append(row, note, meta, actions);
    dom.relationshipList.appendChild(card);
  }
}

function renderGraphMeta() {
  const counts = `${state.graph.nodes.length} nodes, ${state.graph.links.length} relationships`;
  dom.statusSummary.textContent = state.focusedEntityId
    ? `Focused graph loaded: ${counts}`
    : `Full graph loaded: ${counts}`;

  if (state.focusedEntityId) {
    const entity = state.entities.find(item => item.id === state.focusedEntityId);
    dom.focusTag.hidden = false;
    dom.focusTag.textContent = `Focused on ${entity?.name || state.focusedEntityId}`;
  } else {
    dom.focusTag.hidden = true;
  }
}

async function loadEntities() {
  setLoading("entities", true);
  try {
    state.entities = await requestJson("/api/entities");
    if (state.selectedEntityId && !state.entities.some(entity => entity.id === state.selectedEntityId)) {
      state.selectedEntityId = null;
    }
    if (state.focusedEntityId && !state.entities.some(entity => entity.id === state.focusedEntityId)) {
      state.focusedEntityId = null;
    }
  } finally {
    setLoading("entities", false);
  }
}

async function loadRelationships() {
  setLoading("relationships", true);
  try {
    const suffix = state.selectedEntityId
      ? `?entityId=${encodeURIComponent(state.selectedEntityId)}`
      : "";
    state.relationships = await requestJson(`/api/relationship-edges${suffix}`);
  } finally {
    setLoading("relationships", false);
  }
}

async function loadSelectedRelationship() {
  if (!state.selectedRelationshipId) {
    state.selectedRelationship = null;
    return;
  }

  try {
    state.selectedRelationship = await requestJson(
      `/api/relationship-edges/${encodeURIComponent(state.selectedRelationshipId)}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.startsWith("404")) {
      state.selectedRelationshipId = null;
      state.selectedRelationship = null;
      return;
    }

    throw error;
  }
}

async function loadGraph() {
  setLoading("graph", true);
  try {
    const suffix = state.focusedEntityId
      ? `?entityId=${encodeURIComponent(state.focusedEntityId)}`
      : "";
    state.graph = await requestJson(`/api/graph${suffix}`);
  } finally {
    setLoading("graph", false);
  }
}

async function refreshAll() {
  setError("");
  try {
    await loadEntities();
    await Promise.all([loadRelationships(), loadGraph(), loadSelectedRelationship()]);
    render();
  } catch (error) {
    setError(error instanceof Error ? error.message : "Unable to refresh the workbench");
    render();
  }
}

async function selectEntity(entityId) {
  state.selectedEntityId = entityId;
  state.selectedRelationshipId = null;
  state.selectedRelationship = null;
  const entity = selectedEntity();
  if (entity) {
    dom.entityName.value = entity.name;
    dom.entityNote.value = entity.note;
  }
  await refreshAll();
}

async function selectRelationship(relationshipId) {
  state.selectedRelationshipId = relationshipId;
  await refreshAll();
}

async function focusGraph(entityId) {
  state.focusedEntityId = entityId;
  await refreshAll();
}

async function submitEntity(event) {
  event.preventDefault();
  setError("");

  const payload = {
    name: dom.entityName.value.trim(),
    note: dom.entityNote.value.trim()
  };

  try {
    if (state.selectedEntityId) {
      await requestJson(`/api/entities/${encodeURIComponent(state.selectedEntityId)}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
    } else {
      const created = await requestJson("/api/entities", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      state.selectedEntityId = created.id;
    }

    await refreshAll();
  } catch (error) {
    setError(error instanceof Error ? error.message : "Unable to save entity");
  }
}

function clearEntitySelection() {
  state.selectedEntityId = null;
  dom.entityForm.reset();
  render();
  refreshAll();
}

async function deleteSelectedEntity() {
  if (!state.selectedEntityId) {
    return;
  }

  setError("");

  try {
    await requestJson(`/api/entities/${encodeURIComponent(state.selectedEntityId)}`, { method: "DELETE" });
    if (state.focusedEntityId === state.selectedEntityId) {
      state.focusedEntityId = null;
    }
    const relationship = selectedRelationship();
    if (relationship &&
      (relationship.sourceEntityId === state.selectedEntityId ||
        relationship.targetEntityId === state.selectedEntityId)) {
      state.selectedRelationshipId = null;
      state.selectedRelationship = null;
    }
    state.selectedEntityId = null;
    dom.entityForm.reset();
    await refreshAll();
  } catch (error) {
    setError(error instanceof Error ? error.message : "Unable to delete entity");
  }
}

async function submitRelationship(event) {
  event.preventDefault();
  setError("");

  const payload = {
    sourceEntityId: dom.relationshipSource.value,
    targetEntityId: dom.relationshipTarget.value,
    kind: dom.relationshipKind.value.trim(),
    note: dom.relationshipNote.value.trim()
  };

  try {
    let relationship;
    if (state.selectedRelationshipId) {
      relationship = await requestJson(`/api/relationship-edges/${encodeURIComponent(state.selectedRelationshipId)}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
    } else {
      relationship = await requestJson("/api/relationship-edges", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }

    state.selectedRelationshipId = relationship.id;
    state.selectedRelationship = relationship;
    state.selectedEntityId = payload.sourceEntityId;
    await refreshAll();
  } catch (error) {
    setError(error instanceof Error ? error.message : "Unable to save relationship");
  }
}

async function deleteRelationship(id) {
  setError("");

  try {
    await requestJson(`/api/relationship-edges/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (state.selectedRelationshipId === id) {
      state.selectedRelationshipId = null;
      state.selectedRelationship = null;
    }
    await refreshAll();
  } catch (error) {
    setError(error instanceof Error ? error.message : "Unable to delete relationship");
  }
}

async function clearRelationshipSelection() {
  state.selectedRelationshipId = null;
  state.selectedRelationship = null;
  dom.relationshipKind.value = "";
  dom.relationshipNote.value = "";
  render();
  await refreshAll();
}

function clearRelationshipFilters() {
  state.relationshipFilters.text = "";
  state.relationshipFilters.kind = "";
  state.relationshipFilters.direction = "all";
  dom.relationshipSearch.value = "";
  dom.relationshipKindFilter.value = "";
  dom.relationshipDirectionFilter.value = "all";
  render();
}

function renderGraph(graph) {
  const svg = dom.graph;
  const width = svg.clientWidth || 960;
  const height = svg.clientHeight || 640;
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = "";

  if (!graph.nodes.length) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", width / 2);
    text.setAttribute("y", height / 2);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "#5b6b78");
    text.setAttribute("font-size", "18");
    text.textContent = "No nodes to display";
    svg.appendChild(text);
    return;
  }

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.max(110, Math.min(width, height) * 0.3);
  const nodes = graph.nodes.map((node, index) => {
    const angle = graph.nodes.length === 1
      ? 0
      : (Math.PI * 2 * index) / graph.nodes.length - Math.PI / 2;

    return {
      ...node,
      x: graph.nodes.length === 1 ? centerX : centerX + Math.cos(angle) * radius,
      y: graph.nodes.length === 1 ? centerY : centerY + Math.sin(angle) * radius
    };
  });
  const nodeById = new Map(nodes.map(node => [node.id, node]));

  for (const link of graph.links) {
    const source = nodeById.get(link.source);
    const target = nodeById.get(link.target);
    if (!source || !target) {
      continue;
    }

    appendLink(svg, source, target, link);
  }

  for (const node of nodes) {
    appendNode(svg, node);
  }
}

function appendLink(svg, source, target, link) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("class", "link-shell");
  if (link.id === state.selectedRelationshipId) {
    group.classList.add("active");
  }
  group.addEventListener("click", async event => {
    event.stopPropagation();
    await selectRelationship(link.id);
  });

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("class", "link");
  line.setAttribute("x1", source.x);
  line.setAttribute("y1", source.y);
  line.setAttribute("x2", target.x);
  line.setAttribute("y2", target.y);

  const hitbox = document.createElementNS("http://www.w3.org/2000/svg", "line");
  hitbox.setAttribute("class", "link-hitbox");
  hitbox.setAttribute("x1", source.x);
  hitbox.setAttribute("y1", source.y);
  hitbox.setAttribute("x2", target.x);
  hitbox.setAttribute("y2", target.y);

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("class", "link-label");
  text.setAttribute("x", (source.x + target.x) / 2);
  text.setAttribute("y", (source.y + target.y) / 2 - 10);
  text.textContent = link.label;

  group.append(line, hitbox, text);
  svg.appendChild(group);
}

function appendNode(svg, node) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("class", "node-shell");
  if (node.id === state.selectedEntityId || node.id === state.focusedEntityId) {
    group.classList.add("active");
  }
  group.addEventListener("click", () => selectEntity(node.id));
  group.addEventListener("dblclick", () => focusGraph(node.id));

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("class", "node-circle");
  circle.setAttribute("cx", node.x);
  circle.setAttribute("cy", node.y);
  circle.setAttribute("r", 58);

  const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.setAttribute("class", "node-label");
  label.setAttribute("x", node.x);
  label.setAttribute("y", node.y + 4);
  label.textContent = node.label;

  group.append(circle, label);

  if (node.note) {
    const note = document.createElementNS("http://www.w3.org/2000/svg", "text");
    note.setAttribute("class", "node-note");
    note.setAttribute("x", node.x);
    note.setAttribute("y", node.y + 24);
    note.textContent = node.note;
    group.appendChild(note);
  }

  svg.appendChild(group);
}

dom.entitySearch.addEventListener("input", event => {
  state.searchQuery = event.target.value;
  renderEntityList();
});

dom.relationshipSearch.addEventListener("input", event => {
  state.relationshipFilters.text = event.target.value;
  render();
});

dom.relationshipKindFilter.addEventListener("change", event => {
  state.relationshipFilters.kind = event.target.value;
  render();
});

dom.relationshipDirectionFilter.addEventListener("change", event => {
  state.relationshipFilters.direction = event.target.value;
  render();
});

dom.relationshipClearFilters.addEventListener("click", clearRelationshipFilters);
dom.entityForm.addEventListener("submit", submitEntity);
dom.entityReset.addEventListener("click", clearEntitySelection);
dom.entityDelete.addEventListener("click", deleteSelectedEntity);
dom.relationshipForm.addEventListener("submit", submitRelationship);
dom.relationshipReset.addEventListener("click", clearRelationshipSelection);
dom.relationshipDelete.addEventListener("click", async () => {
  if (state.selectedRelationshipId) {
    await deleteRelationship(state.selectedRelationshipId);
  }
});
dom.focusSelected.addEventListener("click", () => focusGraph(state.selectedEntityId));
dom.showFullGraph.addEventListener("click", async () => {
  state.focusedEntityId = null;
  await refreshAll();
});
dom.reloadAll.addEventListener("click", refreshAll);
window.addEventListener("resize", () => renderGraph(state.graph));

refreshAll();
