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
  entitySummaryTitle: document.getElementById("entitySummaryTitle"),
  entitySummaryModeTag: document.getElementById("entitySummaryModeTag"),
  entitySummaryText: document.getElementById("entitySummaryText"),
  entityMetricGrid: document.getElementById("entityMetricGrid"),
  entityNeighborList: document.getElementById("entityNeighborList"),
  entityKindChips: document.getElementById("entityKindChips"),
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
  spotlightTag: document.getElementById("spotlightTag"),
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

function normalizeText(value) {
  return (value || "").trim().toLowerCase();
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
  ].some(value => normalizeText(value).includes(query));
}

function entityMatchesSearch(entity, query) {
  if (!query) {
    return true;
  }

  return [entity.id, entity.name, entity.note].some(value => normalizeText(value).includes(query));
}

function getIncidentRelationships(entityId) {
  if (!entityId) {
    return [];
  }

  return state.relationships.filter(edge =>
    edge.sourceEntityId === entityId || edge.targetEntityId === entityId);
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

function getScopedRelationships() {
  if (!state.selectedEntityId) {
    return state.relationships;
  }

  return getIncidentRelationships(state.selectedEntityId);
}

function getFilteredRelationships() {
  const query = normalizeText(state.relationshipFilters.text);

  return getScopedRelationships().filter(edge =>
    relationshipMatchesText(edge, query) &&
    (!state.relationshipFilters.kind || edge.kind === state.relationshipFilters.kind) &&
    relationshipMatchesDirection(edge));
}

function getEntityMetrics(entityId) {
  const incident = getIncidentRelationships(entityId);
  const incoming = incident.filter(edge => edge.targetEntityId === entityId);
  const outgoing = incident.filter(edge => edge.sourceEntityId === entityId);
  const neighborIds = [...new Set(incident.map(edge =>
    edge.sourceEntityId === entityId ? edge.targetEntityId : edge.sourceEntityId))];
  const kinds = [...new Set(incident.map(edge => edge.kind).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right));

  return {
    incidentCount: incident.length,
    incomingCount: incoming.length,
    outgoingCount: outgoing.length,
    neighborCount: neighborIds.length,
    neighborIds,
    kinds
  };
}

function getNeighborSummaries(entityId) {
  return getEntityMetrics(entityId).neighborIds
    .map(neighborId => {
      const entity = state.entities.find(item => item.id === neighborId);
      return entity
        ? { ...entity, incidentCount: getIncidentRelationships(neighborId).length }
        : null;
    })
    .filter(Boolean)
    .sort((left, right) => left.name.localeCompare(right.name));
}

function getGraphSpotlight() {
  const nodeQuery = normalizeText(state.searchQuery);
  const filteredEdges = getFilteredRelationships();
  const isEntitySearchActive = Boolean(nodeQuery);
  const areRelationshipFiltersActive =
    Boolean(normalizeText(state.relationshipFilters.text)) ||
    Boolean(state.relationshipFilters.kind) ||
    (state.selectedEntityId && state.relationshipFilters.direction !== "all");

  const matchingNodeIds = new Set(
    state.entities
      .filter(entity => entityMatchesSearch(entity, nodeQuery))
      .map(entity => entity.id));
  const matchingEdgeIds = new Set(filteredEdges.map(edge => edge.id));
  const connectedNodeIds = new Set();

  for (const edge of filteredEdges) {
    connectedNodeIds.add(edge.sourceEntityId);
    connectedNodeIds.add(edge.targetEntityId);
  }

  return {
    isEntitySearchActive,
    areRelationshipFiltersActive,
    matchingNodeIds,
    matchingEdgeIds,
    connectedNodeIds,
    hasSpotlight: isEntitySearchActive || areRelationshipFiltersActive
  };
}

function setError(message) {
  state.error = message || "";
  dom.errorBanner.hidden = !state.error;
  dom.errorBanner.textContent = state.error;
}

function setLoading(key, value) {
  state.loading[key] = value;
  const indicator = dom[`${key}Loading`];
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
  renderEntitySummary();
  renderEntityList();
  renderEntityForm();
  renderRelationshipControls();
  renderRelationshipList();
  renderGraphMeta();
  renderGraph(state.graph);
}

function renderEntitySummary() {
  const entity = selectedEntity();
  const spotlight = getGraphSpotlight();

  dom.entityMetricGrid.innerHTML = "";
  dom.entityNeighborList.innerHTML = "";
  dom.entityKindChips.innerHTML = "";

  if (!entity) {
    dom.entitySummaryTitle.textContent = "No entity selected";
    dom.entitySummaryModeTag.textContent = state.focusedEntityId ? "Focused graph context" : "Full graph context";
    dom.entitySummaryText.textContent =
      "Select an entity to inspect incident counts, neighboring entities, and quick relationship filters.";
    appendEmpty(dom.entityMetricGrid, "Entity metrics appear here after you select an entity.");
    appendEmpty(dom.entityNeighborList, "Neighbor drilldown becomes available once an entity is selected.");
    appendEmpty(dom.entityKindChips, "Quick kind chips appear after an entity is selected.");
    return;
  }

  const metrics = getEntityMetrics(entity.id);
  const modeParts = [];
  modeParts.push(state.focusedEntityId ? "Focused graph" : "Full graph");
  modeParts.push(spotlight.hasSpotlight ? "Spotlight active" : "No spotlight");

  dom.entitySummaryTitle.textContent = `${entity.name} neighborhood`;
  dom.entitySummaryModeTag.textContent = modeParts.join(" + ");
  dom.entitySummaryText.textContent = state.focusedEntityId === entity.id
    ? `${entity.name} is currently driving the one-hop graph focus. Spotlighting can still mute or emphasize nodes and edges without changing the fetched graph.`
    : `${entity.name} is selected for local context. Use Focus selected to refetch the one-hop graph, or stay in the full graph and use spotlighting only.`;

  const metricsToRender = [
    { label: "Incident", value: metrics.incidentCount },
    { label: "Incoming", value: metrics.incomingCount },
    { label: "Outgoing", value: metrics.outgoingCount },
    { label: "Neighbors", value: metrics.neighborCount }
  ];

  for (const metric of metricsToRender) {
    const card = document.createElement("article");
    card.className = "metric-card";

    const value = document.createElement("strong");
    value.className = "metric-value";
    value.textContent = String(metric.value);

    const label = document.createElement("span");
    label.className = "muted";
    label.textContent = metric.label;

    card.append(value, label);
    dom.entityMetricGrid.appendChild(card);
  }

  const neighbors = getNeighborSummaries(entity.id);
  if (!neighbors.length) {
    appendEmpty(dom.entityNeighborList, "No neighbors connected to the selected entity yet.");
  } else {
    for (const neighbor of neighbors) {
      const chip = document.createElement("div");
      chip.className = "chip-card";

      const label = document.createElement("strong");
      label.textContent = neighbor.name;

      const meta = document.createElement("span");
      meta.className = "muted";
      meta.textContent = `${neighbor.id} · ${neighbor.incidentCount} incident`;

      const actions = document.createElement("div");
      actions.className = "actions";

      const selectButton = document.createElement("button");
      selectButton.className = "ghost";
      selectButton.type = "button";
      selectButton.textContent = "Select";
      selectButton.addEventListener("click", () => selectEntity(neighbor.id));

      const focusButton = document.createElement("button");
      focusButton.className = "ghost";
      focusButton.type = "button";
      focusButton.textContent = "Focus";
      focusButton.addEventListener("click", async () => {
        await selectEntity(neighbor.id);
        await focusGraph(neighbor.id);
      });

      actions.append(selectButton, focusButton);
      chip.append(label, meta, actions);
      dom.entityNeighborList.appendChild(chip);
    }
  }

  if (!metrics.kinds.length) {
    appendEmpty(dom.entityKindChips, "No incident relationship kinds available for the selected entity.");
    return;
  }

  for (const kind of metrics.kinds) {
    const button = document.createElement("button");
    button.className = state.relationshipFilters.kind === kind ? "chip-button active" : "chip-button";
    button.type = "button";
    button.textContent = kind;
    button.addEventListener("click", () => {
      state.relationshipFilters.kind = state.relationshipFilters.kind === kind ? "" : kind;
      dom.relationshipKindFilter.value = state.relationshipFilters.kind;
      render();
    });
    dom.entityKindChips.appendChild(button);
  }
}

function renderEntityList() {
  dom.entityList.innerHTML = "";

  const query = normalizeText(state.searchQuery);
  const entities = state.entities.filter(entity => entityMatchesSearch(entity, query));

  if (!entities.length) {
    appendEmpty(
      dom.entityList,
      query ? "No entities match the current filter." : "No entities yet. Create the first one below.");
    return;
  }

  for (const entity of entities) {
    const metrics = getEntityMetrics(entity.id);
    const card = document.createElement("article");
    card.className = "entity-card";
    if (entity.id === state.selectedEntityId) {
      card.classList.add("active");
    }

    const headingRow = document.createElement("div");
    headingRow.className = "entity-row";

    const heading = document.createElement("strong");
    heading.textContent = entity.name;

    const count = document.createElement("span");
    count.className = "tag";
    count.textContent = `${metrics.incidentCount} incident`;

    headingRow.append(heading, count);

    const note = document.createElement("p");
    note.className = "muted";
    note.textContent = entity.note || "No note";

    const meta = document.createElement("div");
    meta.className = "entity-meta";

    const idTag = document.createElement("span");
    idTag.className = "tag";
    idTag.textContent = entity.id;

    const neighborTag = document.createElement("span");
    neighborTag.className = "tag";
    neighborTag.textContent = `${metrics.neighborCount} neighbors`;

    meta.append(idTag, neighborTag);

    const buttonRow = document.createElement("div");
    buttonRow.className = "actions";

    const selectButton = document.createElement("button");
    selectButton.className = "ghost";
    selectButton.type = "button";
    selectButton.textContent = entity.id === state.selectedEntityId ? "Selected" : "Select entity";
    selectButton.addEventListener("click", () => selectEntity(entity.id));

    const focusButton = document.createElement("button");
    focusButton.className = "ghost";
    focusButton.type = "button";
    focusButton.textContent = state.focusedEntityId === entity.id ? "Focused" : "Focus";
    focusButton.addEventListener("click", () => focusGraph(entity.id));

    buttonRow.append(selectButton, focusButton);
    card.append(headingRow, note, meta, buttonRow);
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
  const kinds = [...new Set(getScopedRelationships().map(edge => edge.kind).filter(Boolean))]
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
  } else if (state.relationshipFilters.kind && kinds.includes(state.relationshipFilters.kind)) {
    dom.relationshipKindFilter.value = state.relationshipFilters.kind;
  } else {
    dom.relationshipKindFilter.value = "";
    if (state.relationshipFilters.kind && !kinds.length) {
      state.relationshipFilters.kind = "";
    }
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
  const scopedRelationships = getScopedRelationships();
  const filteredRelationships = getFilteredRelationships();
  const selectedRelationshipVisibleInGraph = relationship
    ? state.graph.links.some(link => link.id === relationship.id)
    : true;
  const spotlight = getGraphSpotlight();

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
    ? `${filteredRelationships.length} of ${scopedRelationships.length} incident relationships shown`
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
      `${entity.name} is selected. Filtering ${scopedRelationships.length} incident relationships and editing ${relationship.id}.`;
  } else if (relationship) {
    dom.selectionSummary.textContent =
      `Global relationship browsing is active. Inspecting ${relationship.id} directly from the graph or filtered list.`;
  } else if (entity) {
    dom.selectionSummary.textContent =
      `${entity.name} is selected. Use quick kind chips or explorer filters to narrow the visible incident relationships.`;
  } else {
    dom.selectionSummary.textContent =
      "Global relationship browsing is active. Filter all relationships, then inspect one without selecting an entity first.";
  }

  if (spotlight.areRelationshipFiltersActive) {
    dom.selectionSummary.textContent += " Relationship spotlighting is active on the graph.";
  }
}

function renderRelationshipList() {
  dom.relationshipList.innerHTML = "";

  const edges = getFilteredRelationships();

  if (!state.relationships.length) {
    appendEmpty(
      dom.relationshipList,
      relationshipMode() === "entity"
        ? "No relationships for the selected entity yet."
        : "No relationships yet. Create the first relationship in the inspector below.");
    return;
  }

  if (!edges.length) {
    appendEmpty(dom.relationshipList, "No relationships match the current filters.");
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
  const spotlight = getGraphSpotlight();

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

  dom.spotlightTag.hidden = !spotlight.hasSpotlight;
  if (spotlight.hasSpotlight) {
    const parts = [];
    if (spotlight.isEntitySearchActive) {
      parts.push("Node spotlight");
    }
    if (spotlight.areRelationshipFiltersActive) {
      parts.push("Edge spotlight");
    }
    dom.spotlightTag.textContent = parts.join(" + ");
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
    state.relationships = await requestJson("/api/relationship-edges");
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

function appendEmpty(container, text) {
  const empty = document.createElement("div");
  empty.className = "empty";
  empty.textContent = text;
  container.appendChild(empty);
}

function renderGraph(graph) {
  const svg = dom.graph;
  const width = svg.clientWidth || 960;
  const height = svg.clientHeight || 640;
  const spotlight = getGraphSpotlight();
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

    appendLink(svg, source, target, link, spotlight);
  }

  for (const node of nodes) {
    appendNode(svg, node, spotlight);
  }
}

function appendLink(svg, source, target, link, spotlight) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("class", "link-shell");
  if (link.id === state.selectedRelationshipId) {
    group.classList.add("active");
  }
  if (spotlight.areRelationshipFiltersActive) {
    if (spotlight.matchingEdgeIds.has(link.id)) {
      group.classList.add("spotlight");
    } else {
      group.classList.add("muted");
    }
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

function appendNode(svg, node, spotlight) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("class", "node-shell");
  if (node.id === state.selectedEntityId || node.id === state.focusedEntityId) {
    group.classList.add("active");
  }
  if (spotlight.isEntitySearchActive) {
    if (spotlight.matchingNodeIds.has(node.id)) {
      group.classList.add("spotlight");
    } else {
      group.classList.add("muted");
    }
  } else if (spotlight.areRelationshipFiltersActive) {
    if (spotlight.connectedNodeIds.has(node.id)) {
      group.classList.add("spotlight");
    } else {
      group.classList.add("muted");
    }
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
  render();
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
