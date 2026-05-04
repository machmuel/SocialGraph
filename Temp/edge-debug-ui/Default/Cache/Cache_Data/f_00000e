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
  pendingDelete: null,
  undoAction: null,
  undoTimerId: null,
  activityMessage: "",
  viewport: {
    scale: 1,
    minScale: 0.55,
    maxScale: 2.4,
    translateX: 0,
    translateY: 0,
    pointerId: null,
    dragStartX: 0,
    dragStartY: 0,
    originX: 0,
    originY: 0,
    didPan: false,
    graphSignature: "",
    needsFit: true
  },
  loading: {
    entities: false,
    relationships: false,
    graph: false
  },
  error: ""
};

const urlState = {
  hydrated: false,
  suppressSync: false,
  pendingNotice: ""
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
  activityBanner: document.getElementById("activityBanner"),
  deleteConfirm: document.getElementById("deleteConfirm"),
  deleteConfirmTitle: document.getElementById("deleteConfirmTitle"),
  deleteConfirmBody: document.getElementById("deleteConfirmBody"),
  deleteConfirmSubmit: document.getElementById("deleteConfirmSubmit"),
  deleteConfirmCancel: document.getElementById("deleteConfirmCancel"),
  undoBanner: document.getElementById("undoBanner"),
  undoBannerTitle: document.getElementById("undoBannerTitle"),
  undoBannerBody: document.getElementById("undoBannerBody"),
  undoBannerAction: document.getElementById("undoBannerAction"),
  undoBannerDismiss: document.getElementById("undoBannerDismiss"),
  graphFrame: document.getElementById("graphFrame"),
  graph: document.getElementById("graph"),
  graphZoomIn: document.getElementById("graphZoomIn"),
  graphZoomOut: document.getElementById("graphZoomOut"),
  graphResetView: document.getElementById("graphResetView"),
  graphFitView: document.getElementById("graphFitView"),
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

const URL_STATE_KEYS = {
  selectedEntityId: "entity",
  selectedRelationshipId: "relationship",
  focusedEntityId: "focus",
  entitySearch: "q",
  relationshipSearch: "relq",
  relationshipKind: "relkind",
  relationshipDirection: "reldir"
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

function copyEntity(entity) {
  return entity
    ? { id: entity.id, name: entity.name, note: entity.note || "" }
    : null;
}

function copyRelationship(edge) {
  return edge
    ? {
      id: edge.id,
      sourceEntityId: edge.sourceEntityId,
      targetEntityId: edge.targetEntityId,
      kind: edge.kind,
      note: edge.note || ""
    }
    : null;
}

function normalizeText(value) {
  return (value || "").trim().toLowerCase();
}

function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
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

function describeRelationship(edge) {
  return `${edge.sourceEntityId} -> ${edge.targetEntityId} (${edge.kind || "relationship"})`;
}

function findRelationshipByIdentity(sourceEntityId, targetEntityId, kind) {
  return state.relationships.find(edge =>
    edge.sourceEntityId === sourceEntityId &&
    edge.targetEntityId === targetEntityId &&
    edge.kind === kind) ?? null;
}

function setError(message) {
  state.error = message || "";
  dom.errorBanner.hidden = !state.error;
  dom.errorBanner.textContent = state.error;
}

function setActivityMessage(message) {
  state.activityMessage = message || "";
  dom.activityBanner.hidden = !state.activityMessage;
  dom.activityBanner.textContent = state.activityMessage;
}

function clearUndoTimer() {
  if (state.undoTimerId) {
    window.clearTimeout(state.undoTimerId);
    state.undoTimerId = null;
  }
}

function setUndoAction(action) {
  clearUndoTimer();
  state.undoAction = action;
  if (!action) {
    return;
  }

  state.undoTimerId = window.setTimeout(() => {
    state.undoAction = null;
    state.undoTimerId = null;
    render();
  }, 12000);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function roundViewportValue(value) {
  return Math.round(value * 1000) / 1000;
}

function getGraphSignature(graph) {
  return JSON.stringify({
    nodes: graph.nodes.map(node => node.id),
    links: graph.links.map(link => link.id)
  });
}

function getViewportScale() {
  return clamp(state.viewport.scale, state.viewport.minScale, state.viewport.maxScale);
}

function setViewportScale(nextScale, anchorX, anchorY) {
  const viewport = state.viewport;
  const currentScale = getViewportScale();
  const targetScale = clamp(nextScale, viewport.minScale, viewport.maxScale);
  if (Math.abs(targetScale - currentScale) < 0.001) {
    return false;
  }

  const frame = dom.graphFrame.getBoundingClientRect();
  const focusX = anchorX ?? frame.width / 2;
  const focusY = anchorY ?? frame.height / 2;

  viewport.translateX = focusX - ((focusX - viewport.translateX) * (targetScale / currentScale));
  viewport.translateY = focusY - ((focusY - viewport.translateY) * (targetScale / currentScale));
  viewport.scale = roundViewportValue(targetScale);
  return true;
}

function getGraphBounds(nodes) {
  if (!nodes.length) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  const paddingX = 104;
  const paddingTop = 98;
  const paddingBottom = 76;
  const xs = [];
  const ys = [];

  for (const node of nodes) {
    xs.push(node.x - paddingX, node.x + paddingX);
    ys.push(node.y - paddingTop, node.y + paddingBottom);
  }

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

function fitViewportToGraph(bounds, width, height) {
  const viewport = state.viewport;
  if (!bounds.width || !bounds.height) {
    viewport.scale = 1;
    viewport.translateX = 0;
    viewport.translateY = 0;
    viewport.needsFit = false;
    return;
  }

  const padding = 32;
  const availableWidth = Math.max(120, width - padding * 2);
  const availableHeight = Math.max(120, height - padding * 2);
  const scale = clamp(
    Math.min(availableWidth / bounds.width, availableHeight / bounds.height),
    viewport.minScale,
    viewport.maxScale
  );

  const centerX = bounds.minX + bounds.width / 2;
  const centerY = bounds.minY + bounds.height / 2;

  viewport.scale = roundViewportValue(scale);
  viewport.translateX = roundViewportValue(width / 2 - centerX * viewport.scale);
  viewport.translateY = roundViewportValue(height / 2 - centerY * viewport.scale);
  viewport.needsFit = false;
}

function resetViewport(width, height, bounds) {
  const viewport = state.viewport;
  viewport.scale = 1;
  if (bounds?.width && bounds?.height) {
    const centerX = bounds.minX + bounds.width / 2;
    const centerY = bounds.minY + bounds.height / 2;
    viewport.translateX = roundViewportValue(width / 2 - centerX);
    viewport.translateY = roundViewportValue(height / 2 - centerY);
  } else {
    viewport.translateX = 0;
    viewport.translateY = 0;
  }
  viewport.needsFit = false;
}

function cancelPan() {
  const viewport = state.viewport;
  if (viewport.pointerId !== null && dom.graph.hasPointerCapture?.(viewport.pointerId)) {
    dom.graph.releasePointerCapture(viewport.pointerId);
  }
  viewport.pointerId = null;
  viewport.didPan = false;
  dom.graphFrame.classList.remove("is-panning");
}

function setLoading(key, value) {
  state.loading[key] = value;
  const indicator = dom[`${key}Loading`];
  if (indicator) {
    indicator.hidden = !value;
    indicator.setAttribute("aria-hidden", String(!value));
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

function readWorkbenchStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    selectedEntityId: params.get(URL_STATE_KEYS.selectedEntityId),
    selectedRelationshipId: params.get(URL_STATE_KEYS.selectedRelationshipId),
    focusedEntityId: params.get(URL_STATE_KEYS.focusedEntityId),
    searchQuery: params.get(URL_STATE_KEYS.entitySearch) ?? "",
    relationshipText: params.get(URL_STATE_KEYS.relationshipSearch) ?? "",
    relationshipKind: params.get(URL_STATE_KEYS.relationshipKind) ?? "",
    relationshipDirection: params.get(URL_STATE_KEYS.relationshipDirection) ?? "all"
  };
}

function writeWorkbenchStateToUrl() {
  if (urlState.suppressSync) {
    return;
  }

  const params = new URLSearchParams();
  if (state.selectedEntityId) {
    params.set(URL_STATE_KEYS.selectedEntityId, state.selectedEntityId);
  }
  if (state.selectedRelationshipId) {
    params.set(URL_STATE_KEYS.selectedRelationshipId, state.selectedRelationshipId);
  }
  if (state.focusedEntityId) {
    params.set(URL_STATE_KEYS.focusedEntityId, state.focusedEntityId);
  }
  if (state.searchQuery.trim()) {
    params.set(URL_STATE_KEYS.entitySearch, state.searchQuery.trim());
  }
  if (state.relationshipFilters.text.trim()) {
    params.set(URL_STATE_KEYS.relationshipSearch, state.relationshipFilters.text.trim());
  }
  if (state.relationshipFilters.kind) {
    params.set(URL_STATE_KEYS.relationshipKind, state.relationshipFilters.kind);
  }
  if (state.selectedEntityId && state.relationshipFilters.direction !== "all") {
    params.set(URL_STATE_KEYS.relationshipDirection, state.relationshipFilters.direction);
  }

  const nextQuery = params.toString();
  const nextUrl = nextQuery ? `${window.location.pathname}?${nextQuery}` : window.location.pathname;
  const currentUrl = `${window.location.pathname}${window.location.search}`;
  if (nextUrl !== currentUrl) {
    window.history.replaceState(null, "", nextUrl);
  }
}

function applyUrlStateToInputs() {
  dom.entitySearch.value = state.searchQuery;
  dom.relationshipSearch.value = state.relationshipFilters.text;
  dom.relationshipDirectionFilter.value = state.relationshipFilters.direction;
}

function queueUrlStateNotice(message) {
  if (!message) {
    return;
  }

  urlState.pendingNotice = urlState.pendingNotice
    ? `${urlState.pendingNotice} ${message}`
    : message;
}

function hydrateWorkbenchStateFromUrl() {
  if (urlState.hydrated) {
    return;
  }

  const snapshot = readWorkbenchStateFromUrl();
  state.selectedEntityId = snapshot.selectedEntityId || null;
  state.selectedRelationshipId = snapshot.selectedRelationshipId || null;
  state.focusedEntityId = snapshot.focusedEntityId || null;
  state.searchQuery = snapshot.searchQuery;
  state.relationshipFilters.text = snapshot.relationshipText;
  state.relationshipFilters.kind = snapshot.relationshipKind;
  state.relationshipFilters.direction =
    ["all", "incoming", "outgoing"].includes(snapshot.relationshipDirection)
      ? snapshot.relationshipDirection
      : "all";
  applyUrlStateToInputs();
  urlState.hydrated = true;
}

function reconcileWorkbenchStateAfterLoad() {
  const entityIds = new Set(state.entities.map(entity => entity.id));
  const relationshipIds = new Set(state.relationships.map(edge => edge.id));

  if (state.selectedEntityId && !entityIds.has(state.selectedEntityId)) {
    state.selectedEntityId = null;
    queueUrlStateNotice("Saved entity selection was cleared because it no longer exists.");
  }

  if (state.focusedEntityId && !entityIds.has(state.focusedEntityId)) {
    state.focusedEntityId = null;
    queueUrlStateNotice("Saved graph focus was cleared because that entity is no longer available.");
  }

  if (!state.selectedEntityId) {
    state.relationshipFilters.direction = "all";
  }

  const availableKinds = new Set(getScopedRelationships().map(edge => edge.kind).filter(Boolean));
  if (state.relationshipFilters.kind && !availableKinds.has(state.relationshipFilters.kind)) {
    state.relationshipFilters.kind = "";
    queueUrlStateNotice("Saved relationship kind filter was cleared because it no longer matches the active result set.");
  }

  if (state.selectedRelationshipId && !relationshipIds.has(state.selectedRelationshipId)) {
    state.selectedRelationshipId = null;
    state.selectedRelationship = null;
    queueUrlStateNotice("Saved relationship selection was cleared because it no longer exists.");
  } else if (state.selectedRelationshipId) {
    const restoredRelationship = state.relationships.find(edge => edge.id === state.selectedRelationshipId) ?? null;
    state.selectedRelationship = restoredRelationship;
    const visibleRelationshipIds = new Set(getFilteredRelationships().map(edge => edge.id));
    if (!visibleRelationshipIds.has(state.selectedRelationshipId)) {
      state.selectedRelationshipId = null;
      state.selectedRelationship = null;
      queueUrlStateNotice("Saved relationship selection was cleared because it is outside the restored filters.");
    }
  } else {
    state.selectedRelationship = null;
  }

  applyUrlStateToInputs();
}

function flushUrlStateNotice() {
  if (!urlState.pendingNotice) {
    return;
  }

  setActivityMessage(urlState.pendingNotice);
  urlState.pendingNotice = "";
}

function render() {
  renderDeleteConfirm();
  renderUndoBanner();
  renderEntitySummary();
  renderEntityList();
  renderEntityForm();
  renderRelationshipControls();
  renderRelationshipList();
  renderGraphMeta();
  renderGraph(state.graph);
  writeWorkbenchStateToUrl();
}

function renderDeleteConfirm() {
  const pendingDelete = state.pendingDelete;
  dom.deleteConfirm.hidden = !pendingDelete;
  if (!pendingDelete) {
    return;
  }

  dom.deleteConfirmTitle.textContent = pendingDelete.title;
  dom.deleteConfirmBody.textContent = pendingDelete.body;
  dom.deleteConfirmSubmit.textContent = pendingDelete.confirmLabel;
}

function renderUndoBanner() {
  const undoAction = state.undoAction;
  dom.undoBanner.hidden = !undoAction;
  if (!undoAction) {
    return;
  }

  dom.undoBannerTitle.textContent = undoAction.title;
  dom.undoBannerBody.textContent = undoAction.body;
  dom.undoBannerAction.textContent = undoAction.actionLabel;
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
      meta.textContent = `${neighbor.id} · ${pluralize(neighbor.incidentCount, "incident")}`;

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
    card.className = "entity-card explorer-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-describedby", "entityExplorerHint");
    card.setAttribute("aria-label", `${entity.name}. Press Enter or Space to select. Press F to focus the graph.`);
    card.setAttribute("aria-pressed", String(entity.id === state.selectedEntityId));
    card.dataset.explorerCard = "entity";
    card.dataset.entityId = entity.id;
    if (entity.id === state.selectedEntityId) {
      card.classList.add("active");
    }
    card.addEventListener("click", event => {
      if (shouldIgnoreExplorerCardActivation(event)) {
        return;
      }

      selectEntity(entity.id);
    });
    card.addEventListener("keydown", event => handleExplorerCardKeydown(event, {
      listType: "entity",
      itemId: entity.id,
      activate: () => selectEntity(entity.id),
      alternateActivate: () => focusGraph(entity.id)
    }));

    const headingRow = document.createElement("div");
    headingRow.className = "entity-row";

    const heading = document.createElement("strong");
    heading.textContent = entity.name;

    const count = document.createElement("span");
    count.className = "tag";
    count.textContent = pluralize(metrics.incidentCount, "incident");

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
    neighborTag.textContent = pluralize(metrics.neighborCount, "neighbor");

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
    ? `${pluralize(filteredRelationships.length, "relationship")} shown of ${pluralize(scopedRelationships.length, "incident relationship")}`
    : `${pluralize(filteredRelationships.length, "relationship")} shown of ${pluralize(state.relationships.length, "relationship")}`;

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
      `${entity.name} is selected. Filtering ${pluralize(scopedRelationships.length, "incident relationship")} and editing ${relationship.id}.`;
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
    card.className = "relationship-card explorer-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-describedby", "relationshipExplorerHint");
    card.setAttribute(
      "aria-label",
      `${edge.sourceEntityId} to ${edge.targetEntityId} (${edge.kind}). Press Enter or Space to inspect.`
    );
    card.setAttribute("aria-pressed", String(edge.id === state.selectedRelationshipId));
    card.dataset.explorerCard = "relationship";
    card.dataset.relationshipId = edge.id;
    if (edge.id === state.selectedRelationshipId) {
      card.classList.add("active");
    }
    card.addEventListener("click", event => {
      if (shouldIgnoreExplorerCardActivation(event)) {
        return;
      }

      selectRelationship(edge.id);
    });
    card.addEventListener("keydown", event => handleExplorerCardKeydown(event, {
      listType: "relationship",
      itemId: edge.id,
      activate: () => selectRelationship(edge.id)
    }));

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
      queueRelationshipDelete(edge.id);
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
    urlState.suppressSync = true;
    hydrateWorkbenchStateFromUrl();
    await loadEntities();
    await loadRelationships();
    reconcileWorkbenchStateAfterLoad();
    await loadGraph();
    await loadSelectedRelationship();
    flushUrlStateNotice();
    render();
  } catch (error) {
    setError(error instanceof Error ? error.message : "Unable to refresh the workbench");
    render();
  } finally {
    urlState.suppressSync = false;
    writeWorkbenchStateToUrl();
  }
}

function renderSelection() {
  setError("");
  render();
}

async function selectEntity(entityId) {
  state.pendingDelete = null;
  state.selectedEntityId = entityId;
  state.selectedRelationshipId = null;
  state.selectedRelationship = null;
  const entity = selectedEntity();
  if (entity) {
    dom.entityName.value = entity.name;
    dom.entityNote.value = entity.note;
  }
  renderSelection();
}

async function selectRelationship(relationshipId) {
  state.pendingDelete = null;
  state.selectedRelationshipId = relationshipId;
  state.selectedRelationship = state.relationships.find(edge => edge.id === relationshipId) ?? null;
  renderSelection();
}

async function focusGraph(entityId) {
  state.pendingDelete = null;
  const previousFocusedEntityId = state.focusedEntityId;
  state.focusedEntityId = entityId;
  renderSelection();

  try {
    await loadGraph();
    render();
  } catch (error) {
    state.focusedEntityId = previousFocusedEntityId;
    setError(error instanceof Error ? error.message : "Unable to focus graph");
    render();
  }
}

async function submitEntity(event) {
  event.preventDefault();
  state.pendingDelete = null;
  setError("");
  setActivityMessage("");

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
  state.pendingDelete = null;
  state.selectedEntityId = null;
  state.selectedRelationshipId = null;
  state.selectedRelationship = null;
  dom.entityForm.reset();
  render();
}

function queueEntityDelete() {
  if (!state.selectedEntityId) {
    return;
  }

  const entity = selectedEntity();
  if (!entity) {
    return;
  }

  const incidentRelationships = getIncidentRelationships(entity.id).map(copyRelationship);
  state.pendingDelete = {
    type: "entity",
    title: `Delete entity ${entity.name}?`,
    body:
      `${entity.name} will be removed together with ${pluralize(incidentRelationships.length, "incident relationship")}. ` +
      "Undo remains available for a short recovery window.",
    confirmLabel: "Delete entity",
    snapshot: {
      entity: copyEntity(entity),
      incidentRelationships,
      wasFocused: state.focusedEntityId === entity.id
    }
  };
  render();
}

function queueRelationshipDelete(id) {
  const relationship = state.relationships.find(item => item.id === id);
  if (!relationship) {
    return;
  }

  state.pendingDelete = {
    type: "relationship",
    title: "Delete relationship?",
    body:
      `${describeRelationship(relationship)} will be removed from the explorer and graph. ` +
      "Undo remains available for a short recovery window.",
    confirmLabel: "Delete relationship",
    snapshot: {
      relationship: copyRelationship(relationship)
    }
  };
  render();
}

async function confirmPendingDelete() {
  if (!state.pendingDelete) {
    return;
  }

  setError("");
  setActivityMessage("");

  try {
    if (state.pendingDelete.type === "entity") {
      await confirmEntityDelete(state.pendingDelete.snapshot);
    } else {
      await confirmRelationshipDelete(state.pendingDelete.snapshot);
    }
  } catch (error) {
    setError(error instanceof Error ? error.message : "Unable to delete selection");
  } finally {
    state.pendingDelete = null;
    render();
  }
}

async function confirmEntityDelete(snapshot) {
  await requestJson(`/api/entities/${encodeURIComponent(snapshot.entity.id)}`, { method: "DELETE" });
  if (state.focusedEntityId === snapshot.entity.id) {
    state.focusedEntityId = null;
  }

  const relationship = selectedRelationship();
  if (relationship &&
    (relationship.sourceEntityId === snapshot.entity.id ||
      relationship.targetEntityId === snapshot.entity.id)) {
    state.selectedRelationshipId = null;
    state.selectedRelationship = null;
  }

  state.selectedEntityId = null;
  dom.entityForm.reset();
  setActivityMessage(
    `Deleted ${snapshot.entity.name} and ${pluralize(snapshot.incidentRelationships.length, "incident relationship")}.`);
  setUndoAction({
    type: "entity",
    title: `Deleted entity ${snapshot.entity.name}`,
    body: `${pluralize(snapshot.incidentRelationships.length, "incident relationship")} can be restored briefly.`,
    actionLabel: "Undo entity delete",
    snapshot
  });
  await refreshAll();
}

async function confirmRelationshipDelete(snapshot) {
  await requestJson(`/api/relationship-edges/${encodeURIComponent(snapshot.relationship.id)}`, { method: "DELETE" });
  if (state.selectedRelationshipId === snapshot.relationship.id) {
    state.selectedRelationshipId = null;
    state.selectedRelationship = null;
  }

  setActivityMessage(`Deleted relationship ${describeRelationship(snapshot.relationship)}.`);
  setUndoAction({
    type: "relationship",
    title: "Deleted relationship",
    body: `${describeRelationship(snapshot.relationship)} can be restored briefly.`,
    actionLabel: "Undo relationship delete",
    snapshot
  });
  await refreshAll();
}

function wasConflict(error) {
  return error instanceof Error && error.message.startsWith("409 ");
}

async function restoreDeletedItem() {
  if (!state.undoAction) {
    return;
  }

  setError("");
  setActivityMessage("");

  try {
    if (state.undoAction.type === "relationship") {
      await restoreRelationship(state.undoAction.snapshot);
    } else {
      await restoreEntity(state.undoAction.snapshot);
    }

    clearUndoTimer();
    state.undoAction = null;
    await refreshAll();
  } catch (error) {
    setError(error instanceof Error ? error.message : "Unable to restore deleted item");
    render();
  }
}

async function restoreRelationship(snapshot) {
  const existing = findRelationshipByIdentity(
    snapshot.relationship.sourceEntityId,
    snapshot.relationship.targetEntityId,
    snapshot.relationship.kind);

  if (existing) {
    state.selectedEntityId = existing.sourceEntityId;
    state.selectedRelationshipId = existing.id;
    state.selectedRelationship = existing;
    setActivityMessage(`Relationship ${describeRelationship(existing)} was already present.`);
    return;
  }

  let restored;
  try {
    restored = await requestJson("/api/relationship-edges", {
      method: "POST",
      body: JSON.stringify({
        sourceEntityId: snapshot.relationship.sourceEntityId,
        targetEntityId: snapshot.relationship.targetEntityId,
        kind: snapshot.relationship.kind,
        note: snapshot.relationship.note
      })
    });
  } catch (error) {
    if (!wasConflict(error)) {
      throw error;
    }

    restored = {
      id: snapshot.relationship.id,
      sourceEntityId: snapshot.relationship.sourceEntityId,
      targetEntityId: snapshot.relationship.targetEntityId,
      kind: snapshot.relationship.kind,
      note: snapshot.relationship.note
    };
  }

  state.selectedEntityId = restored.sourceEntityId;
  state.selectedRelationshipId = restored.id;
  state.selectedRelationship = restored;
  setActivityMessage(`Restored relationship ${describeRelationship(restored)}.`);
}

async function restoreEntity(snapshot) {
  let restoredEntity = state.entities.find(entity => entity.id === snapshot.entity.id) ?? null;

  if (!restoredEntity) {
    restoredEntity = await requestJson("/api/entities", {
      method: "POST",
      body: JSON.stringify({
        name: snapshot.entity.name,
        note: snapshot.entity.note
      })
    });
  }

  let restoredCount = 0;
  let alreadyPresentCount = 0;

  for (const edge of snapshot.incidentRelationships) {
    const sourceEntityId = edge.sourceEntityId === snapshot.entity.id ? restoredEntity.id : edge.sourceEntityId;
    const targetEntityId = edge.targetEntityId === snapshot.entity.id ? restoredEntity.id : edge.targetEntityId;

    const existingRelationship = findRelationshipByIdentity(sourceEntityId, targetEntityId, edge.kind);
    if (existingRelationship) {
      alreadyPresentCount += 1;
      continue;
    }

    try {
      await requestJson("/api/relationship-edges", {
        method: "POST",
        body: JSON.stringify({
          sourceEntityId,
          targetEntityId,
          kind: edge.kind,
          note: edge.note
        })
      });
      restoredCount += 1;
    } catch (error) {
      if (!wasConflict(error)) {
        throw error;
      }

      alreadyPresentCount += 1;
    }
  }

  state.selectedEntityId = restoredEntity.id;
  state.selectedRelationshipId = null;
  state.selectedRelationship = null;
  if (snapshot.wasFocused) {
    state.focusedEntityId = restoredEntity.id;
  }

  let message = `Restored entity ${restoredEntity.name}`;
  if (restoredEntity.id !== snapshot.entity.id) {
    message += ` as ${restoredEntity.id}`;
  }
  message += ` with ${restoredCount} recreated relationship`;
  if (restoredCount !== 1) {
    message += "s";
  }
  if (alreadyPresentCount) {
    message += ` and ${alreadyPresentCount} already present`;
  }
  message += ".";
  setActivityMessage(message);
}

function cancelPendingDelete() {
  state.pendingDelete = null;
  render();
}

async function deleteSelectedEntity() {
  queueEntityDelete();
}

async function deleteRelationship(id) {
  queueRelationshipDelete(id);
}

function dismissUndoBanner() {
  clearUndoTimer();
  state.undoAction = null;
  render();
}

async function submitRelationship(event) {
  event.preventDefault();
  state.pendingDelete = null;
  setError("");
  setActivityMessage("");

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

async function clearRelationshipSelection() {
  state.pendingDelete = null;
  state.selectedRelationshipId = null;
  state.selectedRelationship = null;
  dom.relationshipKind.value = "";
  dom.relationshipNote.value = "";
  renderSelection();
}

function clearRelationshipFilters() {
  state.pendingDelete = null;
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

function shouldIgnoreExplorerCardActivation(event) {
  return event.target instanceof HTMLElement && Boolean(event.target.closest("button"));
}

function getExplorerCards(listType) {
  const selector = listType === "entity"
    ? "[data-explorer-card=\"entity\"]"
    : "[data-explorer-card=\"relationship\"]";
  const container = listType === "entity" ? dom.entityList : dom.relationshipList;
  return Array.from(container.querySelectorAll(selector));
}

function moveExplorerFocus(listType, itemId, direction) {
  const cards = getExplorerCards(listType);
  if (!cards.length) {
    return;
  }

  const currentIndex = cards.findIndex(card =>
    listType === "entity"
      ? card.dataset.entityId === itemId
      : card.dataset.relationshipId === itemId);
  if (currentIndex < 0) {
    return;
  }

  const targetIndex = clamp(currentIndex + direction, 0, cards.length - 1);
  if (targetIndex !== currentIndex) {
    cards[targetIndex].focus();
  }
}

function focusExplorerBoundary(listType, itemId, boundary) {
  const cards = getExplorerCards(listType);
  if (!cards.length) {
    return;
  }

  const targetCard = boundary === "start" ? cards[0] : cards[cards.length - 1];
  const targetId = listType === "entity" ? targetCard.dataset.entityId : targetCard.dataset.relationshipId;
  if (targetId !== itemId) {
    targetCard.focus();
  }
}

function handleExplorerCardKeydown(event, options) {
  if (event.target !== event.currentTarget) {
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    options.activate();
    return;
  }

  if (options.listType === "entity" && event.key.toLowerCase() === "f") {
    event.preventDefault();
    options.alternateActivate?.();
    return;
  }

  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
    event.preventDefault();
    moveExplorerFocus(options.listType, options.itemId, 1);
    return;
  }

  if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    event.preventDefault();
    moveExplorerFocus(options.listType, options.itemId, -1);
    return;
  }

  if (event.key === "Home") {
    event.preventDefault();
    focusExplorerBoundary(options.listType, options.itemId, "start");
    return;
  }

  if (event.key === "End") {
    event.preventDefault();
    focusExplorerBoundary(options.listType, options.itemId, "end");
  }
}

function zoomGraph(delta) {
  if (setViewportScale(getViewportScale() + delta)) {
    renderGraph(state.graph);
  }
}

function fitGraphViewport() {
  const width = dom.graph.clientWidth || 960;
  const height = dom.graph.clientHeight || 640;
  const centerX = width / 2;
  const centerY = height / 2;
  const radialExtent = Math.max(120, (Math.min(width, height) - 220) / 2);
  const radius = Math.max(110, radialExtent);
  const nodes = state.graph.nodes.map((node, index) => {
    const angle = state.graph.nodes.length === 1
      ? 0
      : (Math.PI * 2 * index) / state.graph.nodes.length - Math.PI / 2;

    return {
      ...node,
      x: state.graph.nodes.length === 1 ? centerX : centerX + Math.cos(angle) * radius,
      y: state.graph.nodes.length === 1 ? centerY : centerY + Math.sin(angle) * radius
    };
  });

  fitViewportToGraph(getGraphBounds(nodes), width, height);
  renderGraph(state.graph);
}

function resetGraphViewport() {
  const width = dom.graph.clientWidth || 960;
  const height = dom.graph.clientHeight || 640;
  const centerX = width / 2;
  const centerY = height / 2;
  const radialExtent = Math.max(120, (Math.min(width, height) - 220) / 2);
  const radius = Math.max(110, radialExtent);
  const nodes = state.graph.nodes.map((node, index) => {
    const angle = state.graph.nodes.length === 1
      ? 0
      : (Math.PI * 2 * index) / state.graph.nodes.length - Math.PI / 2;

    return {
      ...node,
      x: state.graph.nodes.length === 1 ? centerX : centerX + Math.cos(angle) * radius,
      y: state.graph.nodes.length === 1 ? centerY : centerY + Math.sin(angle) * radius
    };
  });

  resetViewport(width, height, getGraphBounds(nodes));
  renderGraph(state.graph);
}

function beginGraphPan(event) {
  if (
    event.button !== 0 ||
    !(event.target instanceof SVGElement) ||
    !event.target.classList.contains("graph-surface")
  ) {
    return;
  }

  const viewport = state.viewport;
  viewport.pointerId = event.pointerId;
  viewport.dragStartX = event.clientX;
  viewport.dragStartY = event.clientY;
  viewport.originX = viewport.translateX;
  viewport.originY = viewport.translateY;
  viewport.didPan = false;
  dom.graph.setPointerCapture?.(event.pointerId);
  dom.graphFrame.classList.add("is-panning");
}

function updateGraphPan(event) {
  const viewport = state.viewport;
  if (viewport.pointerId !== event.pointerId) {
    return;
  }

  const deltaX = event.clientX - viewport.dragStartX;
  const deltaY = event.clientY - viewport.dragStartY;
  viewport.didPan = viewport.didPan || Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3;
  viewport.translateX = roundViewportValue(viewport.originX + deltaX);
  viewport.translateY = roundViewportValue(viewport.originY + deltaY);
  renderGraph(state.graph);
}

function endGraphPan(event) {
  if (state.viewport.pointerId !== event.pointerId) {
    return;
  }

  cancelPan();
  renderGraph(state.graph);
}

function makeInteractiveShell(element, label, activate) {
  element.setAttribute("role", "button");
  element.setAttribute("tabindex", "0");
  element.setAttribute("aria-label", label);
  element.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    }
  });
}

function renderGraph(graph) {
  const svg = dom.graph;
  const width = svg.clientWidth || 960;
  const height = svg.clientHeight || 640;
  const spotlight = getGraphSpotlight();
  const graphSignature = getGraphSignature(graph);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.dataset.scale = String(getViewportScale());
  svg.innerHTML = "";

  if (!graph.nodes.length) {
    dom.graphFrame.classList.remove("pannable", "is-panning");
    state.viewport.graphSignature = graphSignature;
    state.viewport.needsFit = true;
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
  const radialExtent = Math.max(120, (Math.min(width, height) - 220) / 2);
  const radius = Math.max(110, radialExtent);
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
  const bounds = getGraphBounds(nodes);
  const viewportChanged = state.viewport.graphSignature !== graphSignature;
  if (viewportChanged) {
    state.viewport.graphSignature = graphSignature;
    state.viewport.needsFit = true;
  }
  if (state.viewport.needsFit) {
    fitViewportToGraph(bounds, width, height);
  }

  dom.graphFrame.classList.add("pannable");
  dom.graphFrame.classList.toggle("is-panning", state.viewport.pointerId !== null);

  const surface = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  surface.setAttribute("class", "graph-surface");
  surface.setAttribute("x", "0");
  surface.setAttribute("y", "0");
  surface.setAttribute("width", String(width));
  surface.setAttribute("height", String(height));
  surface.setAttribute("aria-hidden", "true");
  svg.appendChild(surface);

  const viewportGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  viewportGroup.setAttribute(
    "transform",
    `translate(${state.viewport.translateX} ${state.viewport.translateY}) scale(${getViewportScale()})`
  );
  svg.appendChild(viewportGroup);

  const nodeById = new Map(nodes.map(node => [node.id, node]));

  for (const link of graph.links) {
    const source = nodeById.get(link.source);
    const target = nodeById.get(link.target);
    if (!source || !target) {
      continue;
    }

    appendLink(viewportGroup, source, target, link, spotlight);
  }

  for (const node of nodes) {
    appendNode(viewportGroup, node, spotlight);
  }
}

function appendLink(svg, source, target, link, spotlight) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("class", "link-shell");
  const edgeLabel = link.label || "relationship";
  const scale = getViewportScale();
  makeInteractiveShell(
    group,
    `${edgeLabel} from ${source.label} to ${target.label}. Press Enter to inspect relationship.`,
    () => selectRelationship(link.id));
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
  group.addEventListener("click", event => {
    event.stopPropagation();
    selectRelationship(link.id);
  });

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("class", "link");
  line.setAttribute("x1", source.x);
  line.setAttribute("y1", source.y);
  line.setAttribute("x2", target.x);
  line.setAttribute("y2", target.y);
  line.setAttribute("vector-effect", "non-scaling-stroke");

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
  text.setAttribute("font-size", String(roundViewportValue(12 / scale)));
  text.setAttribute("stroke-width", String(roundViewportValue(5 / scale)));
  text.textContent = edgeLabel;

  group.append(line, hitbox, text);
  svg.appendChild(group);
}

function appendNode(svg, node, spotlight) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("class", "node-shell");
  const scale = getViewportScale();
  makeInteractiveShell(
    group,
    `${node.label}. Press Enter to select. Press F to focus graph on this node.`,
    () => selectEntity(node.id));
  group.addEventListener("keydown", event => {
    if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      focusGraph(node.id);
    }
  });
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
  circle.setAttribute("vector-effect", "non-scaling-stroke");

  const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.setAttribute("class", "node-label");
  label.setAttribute("x", node.x);
  label.setAttribute("y", node.y + 4);
  label.setAttribute("font-size", String(roundViewportValue(15 / scale)));
  label.textContent = node.label;

  group.append(circle, label);

  if (node.note) {
    const note = document.createElementNS("http://www.w3.org/2000/svg", "text");
    note.setAttribute("class", "node-note");
    note.setAttribute("x", node.x);
    note.setAttribute("y", node.y + 24);
    note.setAttribute("font-size", String(roundViewportValue(12 / scale)));
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
dom.deleteConfirmSubmit.addEventListener("click", confirmPendingDelete);
dom.deleteConfirmCancel.addEventListener("click", cancelPendingDelete);
dom.undoBannerAction.addEventListener("click", restoreDeletedItem);
dom.undoBannerDismiss.addEventListener("click", dismissUndoBanner);
dom.graphZoomIn.addEventListener("click", () => zoomGraph(0.18));
dom.graphZoomOut.addEventListener("click", () => zoomGraph(-0.18));
dom.graphResetView.addEventListener("click", resetGraphViewport);
dom.graphFitView.addEventListener("click", fitGraphViewport);
dom.graph.addEventListener("pointerdown", beginGraphPan);
dom.graph.addEventListener("pointermove", updateGraphPan);
dom.graph.addEventListener("pointerup", endGraphPan);
dom.graph.addEventListener("pointercancel", endGraphPan);
dom.relationshipDelete.addEventListener("click", async () => {
  if (state.selectedRelationshipId) {
    await deleteRelationship(state.selectedRelationshipId);
  }
});
dom.focusSelected.addEventListener("click", () => focusGraph(state.selectedEntityId));
dom.showFullGraph.addEventListener("click", async () => {
  state.pendingDelete = null;
  const previousFocusedEntityId = state.focusedEntityId;
  state.focusedEntityId = null;
  renderSelection();

  try {
    await loadGraph();
    render();
  } catch (error) {
    state.focusedEntityId = previousFocusedEntityId;
    setError(error instanceof Error ? error.message : "Unable to load full graph");
    render();
  }
});
dom.reloadAll.addEventListener("click", refreshAll);
window.addEventListener("resize", () => {
  state.viewport.needsFit = true;
  renderGraph(state.graph);
});

refreshAll();
