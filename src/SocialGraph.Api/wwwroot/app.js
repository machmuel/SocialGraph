import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceRadial,
  forceSimulation
} from "d3-force-3d";

const ENTITY_TYPES = ["employee", "skill", "department", "interest", "topic"];
const RELATIONSHIP_KINDS = ["has-skill", "in-department", "interested-in", "related-to"];
const CURRENT_USER_KEY = "socialgraph.demoUserId";
const PANEL_STATE_KEY = "socialgraph.collapsedPanels";
const GRAPH_FILTER_KEY = "socialgraph.graphFilters";
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const savedGraphFilters = JSON.parse(localStorage.getItem(GRAPH_FILTER_KEY) || "{}");

const TYPE_COLORS = {
  employee: 0x106d80,
  skill: 0x7d4cc2,
  department: 0x16884f,
  interest: 0xd97816,
  topic: 0x3e5f9c
};

const VISUAL_ROLE_STYLES = {
  core: { label: "Core hub", radius: 25, charge: -760, collide: 58, orbit: 155 },
  connector: { label: "Connector", radius: 22, charge: -620, collide: 52, orbit: 205 },
  participant: { label: "Participant", radius: 18, charge: -430, collide: 42, orbit: 260 },
  peripheral: { label: "Peripheral", radius: 15, charge: -300, collide: 34, orbit: 320 },
  external: { label: "External", radius: 17, charge: -340, collide: 38, orbit: 350 },
  system: { label: "System", radius: 16, charge: -320, collide: 36, orbit: 380 }
};

function createAmbientMotionForce() {
  let nodes = [];

  function force(alpha) {
    if (REDUCED_MOTION) {
      return;
    }

    const time = performance.now() * 0.001;
    for (const node of nodes) {
      if ((node.index ?? 0) % 3 === 1) {
        continue;
      }

      const phase = (node.index ?? 0) * 1.73;
      const strength = 0.022 * Math.max(0.25, alpha);
      node.vx += Math.sin(time * 0.7 + phase) * strength;
      node.vy += Math.cos(time * 0.53 + phase) * strength;
    }
  }

  force.initialize = initializedNodes => {
    nodes = initializedNodes;
  };

  return force;
}

function applyIridescentFilm(material, baseColor, isMine) {
  material.onBeforeCompile = shader => {
    shader.uniforms.uIridescentBase = { value: baseColor.clone() };
    shader.uniforms.uIridescentStrength = { value: isMine ? 0.72 : 0.58 };
    shader.uniforms.uIridescentOffset = { value: isMine ? 1.4 : 0.35 };
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
      uniform vec3 uIridescentBase;
      uniform float uIridescentStrength;
      uniform float uIridescentOffset;`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <opaque_fragment>",
      `float filmAngle = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 1.45);
      vec3 filmColor = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + filmAngle * 0.9 + uIridescentOffset));
      filmColor = mix(uIridescentBase, filmColor, 0.82);
      outgoingLight = mix(outgoingLight, outgoingLight + filmColor * (0.42 + filmAngle * 0.86), filmAngle * uIridescentStrength);
      #include <opaque_fragment>`
    );
  };
  material.needsUpdate = true;
  return material;
}

const state = {
  entities: [],
  relationships: [],
  graph: { nodes: [], links: [] },
  selectedEntityId: null,
  selectedRelationshipId: null,
  focusedEntityId: null,
  searchQuery: "",
  relationshipFilters: {
    text: "",
    kind: "",
    direction: "all"
  },
  pendingDelete: null,
  currentUserId: localStorage.getItem(CURRENT_USER_KEY) || "Guido_Machmueller",
  loading: {
    entities: false,
    relationships: false,
    graph: false
  },
  collapsedPanels: JSON.parse(localStorage.getItem(PANEL_STATE_KEY) || "{}"),
  graphFilters: {
    visibleTypes: savedGraphFilters.visibleTypes ?? [...ENTITY_TYPES],
    expandedNodeIds: new Set(savedGraphFilters.expandedNodeIds ?? [])
  }
};

const dom = Object.fromEntries([
  "leftPanel",
  "rightPanel",
  "toggleLeftPanel",
  "toggleRightPanel",
  "demoUser",
  "profileForm",
  "profileTitle",
  "profileModeTag",
  "profileName",
  "profileNote",
  "profileDepartment",
  "profileSkills",
  "profileTopics",
  "profileSubmit",
  "focusMine",
  "departmentOptions",
  "entityList",
  "entitySummaryTitle",
  "entitySummaryModeTag",
  "entitySummaryText",
  "entityMetricGrid",
  "entityNeighborList",
  "entityKindChips",
  "relationshipList",
  "statusSummary",
  "selectionSummary",
  "relationshipModeTag",
  "relationshipResultsSummary",
  "relationshipSearch",
  "relationshipKindFilter",
  "relationshipDirectionFilter",
  "relationshipClearFilters",
  "focusTag",
  "spotlightTag",
  "graphFilterSummary",
  "graphTypeFilters",
  "errorBanner",
  "activityBanner",
  "deleteConfirm",
  "deleteConfirmTitle",
  "deleteConfirmBody",
  "deleteConfirmSubmit",
  "deleteConfirmCancel",
  "undoBanner",
  "undoBannerTitle",
  "undoBannerBody",
  "undoBannerAction",
  "undoBannerDismiss",
  "graphFrame",
  "graph",
  "graphLabels",
  "graphTooltip",
  "graphZoomIn",
  "graphZoomOut",
  "graphResetView",
  "graphFitView",
  "entitySearch",
  "entityForm",
  "entityFormTitle",
  "entityName",
  "entityType",
  "entityNote",
  "entitySubmit",
  "entityReset",
  "entityDelete",
  "relationshipForm",
  "relationshipFormTitle",
  "relationshipInspectorMeta",
  "relationshipFocusNotice",
  "relationshipSource",
  "relationshipTarget",
  "relationshipKind",
  "relationshipNote",
  "relationshipReset",
  "relationshipDelete",
  "relationshipSubmit",
  "focusSelected",
  "showFullGraph",
  "reloadAll",
  "entitiesLoading",
  "relationshipsLoading",
  "graphLoading"
].map(id => [id, document.getElementById(id)]));

function setPanelCollapsed(side, collapsed) {
  const isLeft = side === "left";
  const panel = isLeft ? dom.leftPanel : dom.rightPanel;
  const button = isLeft ? dom.toggleLeftPanel : dom.toggleRightPanel;
  if (!panel || !button) {
    return;
  }

  state.collapsedPanels[side] = collapsed;
  localStorage.setItem(PANEL_STATE_KEY, JSON.stringify(state.collapsedPanels));
  document.querySelector(".shell")?.classList.toggle(`${side}-collapsed`, collapsed);
  panel.classList.toggle("collapsed", collapsed);
  button.setAttribute("aria-expanded", String(!collapsed));
  button.setAttribute("aria-label", `${collapsed ? "Expand" : "Collapse"} ${isLeft ? "employee" : "relationship"} panel`);
  button.textContent = isLeft
    ? collapsed ? ">" : "<"
    : collapsed ? "<" : ">";
  requestAnimationFrame(() => graphView?.resize?.(true));
}

function togglePanel(side) {
  setPanelCollapsed(side, !state.collapsedPanels[side]);
}

if (![...dom.demoUser.options].some(option => option.value === state.currentUserId)) {
  state.currentUserId = "Guido_Machmueller";
  localStorage.setItem(CURRENT_USER_KEY, state.currentUserId);
}

function normalizeText(value) {
  return (value || "").trim().toLowerCase();
}

function currentEmployee() {
  return state.entities.find(entity =>
    entity.type === "employee" &&
    (entity.ownerUserId || "").toLowerCase() === state.currentUserId.toLowerCase()) ?? null;
}

function currentEmployeeId() {
  return currentEmployee()?.id ?? state.currentUserId;
}

function selectedEntity() {
  return state.entities.find(entity => entity.id === state.selectedEntityId) ?? null;
}

function selectedRelationship() {
  return state.relationships.find(edge => edge.id === state.selectedRelationshipId) ?? null;
}

function entityLabel(id) {
  return state.entities.find(entity => entity.id === id)?.name ?? id;
}

function getIncidentRelationships(entityId) {
  return state.relationships.filter(edge =>
    edge.sourceEntityId === entityId || edge.targetEntityId === entityId);
}

function getEntityMetrics(entityId) {
  const incident = getIncidentRelationships(entityId);
  const incoming = incident.filter(edge => edge.targetEntityId === entityId);
  const outgoing = incident.filter(edge => edge.sourceEntityId === entityId);
  const neighborIds = [...new Set(incident.map(edge =>
    edge.sourceEntityId === entityId ? edge.targetEntityId : edge.sourceEntityId))];
  const kinds = [...new Set(incident.map(edge => edge.kind).filter(Boolean))].sort();
  return { incident, incoming, outgoing, neighborIds, kinds };
}

function isSystemEntity(entity) {
  const id = entity.id ?? "";
  const name = entity.name ?? entity.label ?? "";
  return id.includes("@") || name.includes("@") || id.toLowerCase().includes("no_reply");
}

function isExternalEntity(entity) {
  return /\(ext\)/i.test(entity.name ?? entity.label ?? "");
}

function visualRoleForEntity(entity) {
  if (isSystemEntity(entity)) {
    return "system";
  }
  if (isExternalEntity(entity)) {
    return "external";
  }

  const degree = getIncidentRelationships(entity.id).length;
  if (degree >= 30) {
    return "core";
  }
  if (degree >= 15) {
    return "connector";
  }
  if (degree >= 5) {
    return "participant";
  }
  return "peripheral";
}

function visualRoleStyle(entity) {
  return VISUAL_ROLE_STYLES[visualRoleForEntity(entity)] ?? VISUAL_ROLE_STYLES.peripheral;
}

function relationshipWeight(edge) {
  const note = edge.note ?? state.relationships.find(relationship => relationship.id === edge.id)?.note ?? "";
  const match = /weight=(\d+)/i.exec(note);
  return match ? Number(match[1]) : 1;
}

function linkEndpointId(endpoint) {
  return typeof endpoint === "object" ? endpoint.id : endpoint;
}

function saveGraphFilters() {
  localStorage.setItem(GRAPH_FILTER_KEY, JSON.stringify({
    visibleTypes: state.graphFilters.visibleTypes,
    expandedNodeIds: [...state.graphFilters.expandedNodeIds]
  }));
}

function ensureInitialExpansion() {
  if (state.graphFilters.expandedNodeIds.size || !currentEmployee()) {
    return;
  }
  state.graphFilters.expandedNodeIds.add(currentEmployeeId());
  saveGraphFilters();
}

function toggleGraphType(type, enabled) {
  state.graphFilters.visibleTypes = enabled
    ? [...new Set([...state.graphFilters.visibleTypes, type])]
    : state.graphFilters.visibleTypes.filter(item => item !== type);
  saveGraphFilters();
  render();
}

function toggleExpandedNode(id) {
  if (state.graphFilters.expandedNodeIds.has(id)) {
    state.graphFilters.expandedNodeIds.delete(id);
  } else {
    state.graphFilters.expandedNodeIds.add(id);
  }
  saveGraphFilters();
  state.selectedEntityId = id;
  render();
}

function visibleGraph() {
  const nodeById = new Map(state.graph.nodes.map(node => [node.id, node]));
  const expandedIds = new Set(state.graphFilters.expandedNodeIds);
  expandedIds.add(currentEmployeeId());

  const candidateNodeIds = new Set([currentEmployeeId(), ...expandedIds]);
  const candidateLinks = [];
  for (const link of state.graph.links) {
    const sourceId = linkEndpointId(link.source);
    const targetId = linkEndpointId(link.target);
    if (expandedIds.has(sourceId) || expandedIds.has(targetId)) {
      candidateLinks.push(link);
      candidateNodeIds.add(sourceId);
      candidateNodeIds.add(targetId);
    }
  }

  const visibleTypes = new Set(state.graphFilters.visibleTypes);
  const candidates = [...candidateNodeIds]
    .map(id => nodeById.get(id))
    .filter(Boolean)
    .filter(node => visibleTypes.has(node.type));

  const topEmployeeIds = new Set([currentEmployeeId(), ...state.graphFilters.expandedNodeIds]);
  for (const expandedId of expandedIds) {
    const weightedNeighbors = [];
    for (const link of candidateLinks) {
      const sourceId = linkEndpointId(link.source);
      const targetId = linkEndpointId(link.target);
      if (sourceId !== expandedId && targetId !== expandedId) {
        continue;
      }
      const neighborId = sourceId === expandedId ? targetId : sourceId;
      const neighbor = nodeById.get(neighborId);
      if (neighbor?.type === "employee") {
        weightedNeighbors.push([neighborId, relationshipWeight(link)]);
      }
    }
    weightedNeighbors
      .sort((left, right) => right[1] - left[1] || entityLabel(left[0]).localeCompare(entityLabel(right[0])))
      .slice(0, 10)
      .forEach(([id]) => topEmployeeIds.add(id));
  }

  const visibleNodeIds = new Set(candidates
    .filter(node => node.type !== "employee" || topEmployeeIds.has(node.id))
    .map(node => node.id));

  const links = candidateLinks.filter(link =>
    visibleNodeIds.has(linkEndpointId(link.source)) &&
    visibleNodeIds.has(linkEndpointId(link.target)));

  return {
    nodes: [...visibleNodeIds].map(id => nodeById.get(id)).filter(Boolean),
    links
  };
}

function getSelectableEmployees() {
  return state.entities
    .filter(entity => entity.type === "employee" && !isSystemEntity(entity))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function reconcileCurrentUser() {
  if (currentEmployee()) {
    return;
  }

  const fallback = state.entities.find(entity => entity.id === "Guido_Machmueller")
    ?? getSelectableEmployees()[0];
  if (!fallback) {
    return;
  }

  state.currentUserId = fallback.ownerUserId || fallback.id;
  localStorage.setItem(CURRENT_USER_KEY, state.currentUserId);
}

function renderDemoUsers() {
  const employees = getSelectableEmployees();
  if (!employees.length) {
    return;
  }

  dom.demoUser.innerHTML = "";
  for (const employee of employees) {
    const option = document.createElement("option");
    option.value = employee.ownerUserId || employee.id;
    option.textContent = employee.name;
    dom.demoUser.appendChild(option);
  }
  dom.demoUser.value = state.currentUserId;
}

function setError(message) {
  dom.errorBanner.hidden = !message;
  dom.errorBanner.textContent = message || "";
}

function setActivity(message) {
  dom.activityBanner.hidden = !message;
  dom.activityBanner.textContent = message || "";
}

function setLoading(key, value) {
  state.loading[key] = value;
  const indicator = dom[`${key}Loading`];
  if (indicator) {
    indicator.hidden = !value;
    indicator.setAttribute("aria-hidden", String(!value));
  }
}

async function requestJson(url, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = {
    "Content-Type": "application/json",
    ...(method === "GET" ? {} : { "X-SocialGraph-UserId": state.currentUserId }),
    ...options.headers
  };
  const response = await fetch(url, { ...options, headers });

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

  return response.status === 204 ? null : response.json();
}

function appendEmpty(container, text) {
  const empty = document.createElement("div");
  empty.className = "empty";
  empty.textContent = text;
  container.appendChild(empty);
}

function splitValues(value) {
  return [...new Set(value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean))];
}

function findEntityByNameAndType(name, type) {
  const normalized = normalizeText(name);
  return state.entities.find(entity =>
    entity.type === type && normalizeText(entity.name) === normalized) ?? null;
}

async function ensureEntity(name, type) {
  const existing = findEntityByNameAndType(name, type);
  if (existing) {
    return existing;
  }

  return requestJson("/api/entities", {
    method: "POST",
    body: JSON.stringify({ name, note: "", type })
  });
}

async function ensureRelationship(sourceEntityId, targetEntityId, kind, note = "") {
  const existing = state.relationships.find(edge =>
    edge.sourceEntityId === sourceEntityId &&
    edge.targetEntityId === targetEntityId &&
    edge.kind === kind);
  if (existing) {
    return existing;
  }

  try {
    return await requestJson("/api/relationship-edges", {
      method: "POST",
      body: JSON.stringify({ sourceEntityId, targetEntityId, kind, note })
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("conflict:relationship already exists")) {
      return null;
    }
    throw error;
  }
}

async function loadEntities() {
  setLoading("entities", true);
  try {
    state.entities = await requestJson("/api/entities");
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

async function loadGraph() {
  setLoading("graph", true);
  try {
    state.graph = await requestJson("/api/graph");
  } finally {
    setLoading("graph", false);
  }
}

async function refreshAll() {
  setError("");
  await Promise.all([loadEntities(), loadRelationships()]);
  reconcileCurrentUser();
  renderDemoUsers();
  ensureInitialExpansion();
  await loadGraph();
  render();
}

function render() {
  renderProfile();
  renderEntityExplorer();
  renderEntitySummary();
  renderRelationshipControls();
  renderRelationshipExplorer();
  renderSelectionForms();
  renderGraphFilters();
  renderStatus();
  graphView.setGraph(visibleGraph());
}

function renderProfile() {
  const employee = currentEmployee();
  dom.demoUser.value = state.currentUserId;
  dom.profileTitle.textContent = employee ? employee.name : "New employee profile";
  dom.profileModeTag.textContent = "Editable";
  dom.profileName.value = employee?.name ?? "";
  dom.profileNote.value = employee?.note ?? "";

  const profileEdges = employee ? getIncidentRelationships(employee.id).filter(edge => edge.sourceEntityId === employee.id) : [];
  const department = profileEdges
    .map(edge => edge.kind === "in-department" ? state.entities.find(entity => entity.id === edge.targetEntityId) : null)
    .find(Boolean);
  const skills = profileEdges
    .filter(edge => edge.kind === "has-skill")
    .map(edge => entityLabel(edge.targetEntityId));
  const topics = profileEdges
    .filter(edge => edge.kind === "interested-in" || edge.kind === "related-to")
    .map(edge => entityLabel(edge.targetEntityId));

  dom.profileDepartment.value = department?.name ?? "";
  dom.profileSkills.value = skills.join(", ");
  dom.profileTopics.value = topics.join(", ");

  dom.departmentOptions.innerHTML = "";
  for (const departmentEntity of state.entities.filter(entity => entity.type === "department")) {
    const option = document.createElement("option");
    option.value = departmentEntity.name;
    dom.departmentOptions.appendChild(option);
  }
}

function entityMatches(entity) {
  const query = normalizeText(state.searchQuery);
  if (!query) {
    return true;
  }

  return [entity.name, entity.note, entity.type, entity.ownerUserId]
    .some(value => normalizeText(value).includes(query));
}

function renderEntityExplorer() {
  dom.entityList.innerHTML = "";
  const entities = state.entities.filter(entityMatches);
  if (!entities.length) {
    appendEmpty(dom.entityList, "No matching entities.");
    return;
  }

  for (const entity of entities) {
    const card = document.createElement("article");
    card.className = `entity-card explorer-card type-${entity.type}`;
    card.tabIndex = 0;
    card.dataset.explorerCard = "entity";
    card.dataset.entityId = entity.id;
    const roleStyle = visualRoleStyle(entity);
    if (entity.id === state.selectedEntityId) {
      card.classList.add("active");
    }
    card.innerHTML = `
      <div class="entity-row">
        <strong>${escapeHtml(entity.name)}</strong>
        <span class="tag">${escapeHtml(roleStyle.label)}</span>
      </div>
      <p class="muted">${escapeHtml(entity.note || "No note yet")}</p>
      <span class="muted">${getIncidentRelationships(entity.id).length} connections</span>
    `;
    card.addEventListener("click", () => selectEntity(entity.id));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectEntity(entity.id);
      }
      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        focusGraph(entity.id);
      }
    });
    dom.entityList.appendChild(card);
  }
}

function renderEntitySummary() {
  const entity = selectedEntity();
  if (!entity) {
    dom.entitySummaryTitle.textContent = "No entity selected";
    dom.entitySummaryModeTag.textContent = "Full graph context";
    dom.entitySummaryText.textContent = "Select an entity to inspect incident counts, neighboring entities, and quick relationship filters.";
    dom.entityMetricGrid.innerHTML = "";
    dom.entityNeighborList.innerHTML = "";
    dom.entityKindChips.innerHTML = "";
    return;
  }

  const metrics = getEntityMetrics(entity.id);
  dom.entitySummaryTitle.textContent = entity.name;
  dom.entitySummaryModeTag.textContent = entity.type;
  dom.entitySummaryText.textContent = entity.note || "No note yet.";
  dom.entityMetricGrid.innerHTML = [
    ["Incident", metrics.incident.length],
    ["Incoming", metrics.incoming.length],
    ["Outgoing", metrics.outgoing.length],
    ["Neighbors", metrics.neighborIds.length]
  ].map(([label, value]) => `<div class="metric-card"><strong class="metric-value">${value}</strong><span>${label}</span></div>`).join("");

  dom.entityNeighborList.innerHTML = "";
  for (const neighborId of metrics.neighborIds) {
    const neighbor = state.entities.find(item => item.id === neighborId);
    if (!neighbor) {
      continue;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip-button";
    button.textContent = neighbor.name;
    button.addEventListener("click", () => selectEntity(neighbor.id));
    dom.entityNeighborList.appendChild(button);
  }
  if (!metrics.neighborIds.length) {
    appendEmpty(dom.entityNeighborList, "No neighbors yet.");
  }

  dom.entityKindChips.innerHTML = "";
  for (const kind of metrics.kinds) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip-button";
    button.textContent = kind;
    button.addEventListener("click", () => {
      state.relationshipFilters.kind = kind;
      dom.relationshipKindFilter.value = kind;
      render();
    });
    dom.entityKindChips.appendChild(button);
  }
  if (!metrics.kinds.length) {
    appendEmpty(dom.entityKindChips, "No relationship kinds yet.");
  }
}

function getScopedRelationships() {
  const scoped = state.selectedEntityId
    ? getIncidentRelationships(state.selectedEntityId)
    : state.relationships;
  const query = normalizeText(state.relationshipFilters.text);
  return scoped.filter(edge => {
    const matchesText = !query || [
      edge.kind,
      edge.note,
      entityLabel(edge.sourceEntityId),
      entityLabel(edge.targetEntityId)
    ].some(value => normalizeText(value).includes(query));
    const matchesKind = !state.relationshipFilters.kind || edge.kind === state.relationshipFilters.kind;
    const matchesDirection =
      !state.selectedEntityId ||
      state.relationshipFilters.direction === "all" ||
      (state.relationshipFilters.direction === "incoming" && edge.targetEntityId === state.selectedEntityId) ||
      (state.relationshipFilters.direction === "outgoing" && edge.sourceEntityId === state.selectedEntityId);
    return matchesText && matchesKind && matchesDirection;
  });
}

function renderRelationshipControls() {
  const kinds = [...new Set(state.relationships.map(edge => edge.kind).filter(Boolean))].sort();
  dom.relationshipKindFilter.innerHTML = `<option value="">All kinds</option>${kinds.map(kind =>
    `<option value="${escapeHtml(kind)}">${escapeHtml(kind)}</option>`).join("")}`;
  dom.relationshipKindFilter.value = state.relationshipFilters.kind;
  dom.relationshipDirectionFilter.value = state.relationshipFilters.direction;
}

function renderRelationshipExplorer() {
  const relationships = getScopedRelationships();
  dom.relationshipList.innerHTML = "";
  dom.relationshipModeTag.textContent = state.selectedEntityId ? "Selected entity" : "Global browse";
  dom.relationshipResultsSummary.textContent = `${relationships.length} relationship${relationships.length === 1 ? "" : "s"}`;
  dom.selectionSummary.textContent = state.selectedEntityId
    ? `Browsing relationships around ${entityLabel(state.selectedEntityId)}.`
    : "Browse all relationships or narrow the list around a selected entity.";

  if (!relationships.length) {
    appendEmpty(dom.relationshipList, "No matching relationships.");
    return;
  }

  for (const edge of relationships) {
    const card = document.createElement("article");
    card.className = "relationship-card explorer-card";
    card.tabIndex = 0;
    card.dataset.explorerCard = "relationship";
    card.dataset.relationshipId = edge.id;
    if (edge.id === state.selectedRelationshipId) {
      card.classList.add("active");
    }
    card.innerHTML = `
      <div class="relationship-row">
        <strong>${escapeHtml(edge.kind)}</strong>
        <span class="tag">${escapeHtml(edge.id)}</span>
      </div>
      <p>${escapeHtml(entityLabel(edge.sourceEntityId))} -> ${escapeHtml(entityLabel(edge.targetEntityId))}</p>
      <p class="muted">${escapeHtml(edge.note || "No note yet")}</p>
    `;
    card.addEventListener("click", () => selectRelationship(edge.id));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectRelationship(edge.id);
      }
    });
    dom.relationshipList.appendChild(card);
  }
}

function renderGraphFilters() {
  dom.graphTypeFilters.innerHTML = "";
  const visibleTypes = new Set(state.graphFilters.visibleTypes);
  for (const type of ENTITY_TYPES) {
    const label = document.createElement("label");
    label.className = "type-toggle";
    label.innerHTML = `
      <input type="checkbox" value="${escapeHtml(type)}" ${visibleTypes.has(type) ? "checked" : ""}>
      <span>${escapeHtml(type)}</span>
    `;
    label.querySelector("input").addEventListener("change", event => {
      toggleGraphType(type, event.target.checked);
    });
    dom.graphTypeFilters.appendChild(label);
  }

  const expandedCount = state.graphFilters.expandedNodeIds.size;
  dom.graphFilterSummary.textContent = `${expandedCount} expanded, top 10 weighted employees`;
}

function renderSelectionForms() {
  const entity = selectedEntity();
  dom.entityFormTitle.textContent = entity ? "Entity inspector" : "Create topic node";
  dom.entityName.value = entity?.name ?? "";
  dom.entityType.value = entity?.type ?? "topic";
  dom.entityNote.value = entity?.note ?? "";
  dom.entitySubmit.textContent = entity ? "Save node" : "Create node";
  dom.entityDelete.hidden = !entity;

  const employee = currentEmployee();
  dom.relationshipSource.innerHTML = state.entities
    .filter(item => item.type === "employee")
    .map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`)
    .join("");
  dom.relationshipTarget.innerHTML = state.entities
    .map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)} (${escapeHtml(item.type)})</option>`)
    .join("");

  const edge = selectedRelationship();
  dom.relationshipFormTitle.textContent = edge ? "Relationship inspector" : "Create relationship";
  dom.relationshipSubmit.textContent = edge ? "Save relationship" : "Create relationship";
  dom.relationshipDelete.hidden = !edge;
  dom.relationshipSource.value = edge?.sourceEntityId ?? employee?.id ?? "";
  dom.relationshipTarget.value = edge?.targetEntityId ?? state.selectedEntityId ?? "";
  dom.relationshipKind.value = edge?.kind ?? "related-to";
  dom.relationshipNote.value = edge?.note ?? "";
  dom.relationshipFocusNotice.hidden = true;
}

function renderStatus() {
  const graph = visibleGraph();
  const nodeCount = graph.nodes.length;
  const linkCount = graph.links.length;
  dom.statusSummary.textContent = `${nodeCount} shown of ${state.graph.nodes.length} nodes, ${linkCount} links`;
  dom.focusTag.hidden = !state.graphFilters.expandedNodeIds.size;
  dom.focusTag.textContent = state.graphFilters.expandedNodeIds.size
    ? `Expanded: ${state.graphFilters.expandedNodeIds.size}`
    : "";
  dom.spotlightTag.hidden = !state.searchQuery && !state.relationshipFilters.kind && !state.relationshipFilters.text;
  dom.spotlightTag.textContent = "Spotlight active";
  dom.focusSelected.disabled = !state.selectedEntityId;
  dom.showFullGraph.disabled = state.graphFilters.expandedNodeIds.size <= 1 &&
    state.graphFilters.expandedNodeIds.has(currentEmployeeId());
}

async function selectEntity(id) {
  state.selectedEntityId = id;
  state.selectedRelationshipId = null;
  render();
}

function selectRelationship(id) {
  const edge = state.relationships.find(item => item.id === id);
  if (!edge) {
    return;
  }
  state.selectedRelationshipId = id;
  state.selectedEntityId = edge.sourceEntityId;
  render();
}

async function focusGraph(id) {
  state.graphFilters.expandedNodeIds.add(id);
  saveGraphFilters();
  render();
}

async function showFullGraph() {
  state.graphFilters.expandedNodeIds = new Set([currentEmployeeId()]);
  saveGraphFilters();
  render();
}

async function submitProfile(event) {
  event.preventDefault();
  setError("");
  const employee = currentEmployee();
  const payload = {
    name: dom.profileName.value.trim(),
    note: dom.profileNote.value.trim(),
    type: "employee"
  };

  try {
    let saved = employee;
    if (employee) {
      saved = await requestJson(`/api/entities/${encodeURIComponent(employee.id)}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
    } else {
      saved = await requestJson("/api/entities", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }

    await loadEntities();
    state.selectedEntityId = saved.id;

    const departmentName = dom.profileDepartment.value.trim();
    if (departmentName) {
      const department = await ensureEntity(departmentName, "department");
      await ensureRelationship(saved.id, department.id, "in-department", "Profile department");
    }

    for (const skillName of splitValues(dom.profileSkills.value)) {
      const skill = await ensureEntity(skillName, "skill");
      await ensureRelationship(saved.id, skill.id, "has-skill", "Profile skill");
    }

    for (const topicName of splitValues(dom.profileTopics.value)) {
      const type = findEntityByNameAndType(topicName, "interest") ? "interest" : "topic";
      const topic = await ensureEntity(topicName, type);
      await ensureRelationship(saved.id, topic.id, type === "interest" ? "interested-in" : "related-to", "Profile topic");
    }

    await refreshAll();
    setActivity("Profile saved and graph updated.");
  } catch (error) {
    setError(error instanceof Error ? error.message : "Unable to save profile");
  }
}

async function submitEntity(event) {
  event.preventDefault();
  setError("");
  const payload = {
    name: dom.entityName.value.trim(),
    note: dom.entityNote.value.trim(),
    type: dom.entityType.value
  };

  try {
    const entity = selectedEntity();
    const saved = entity
      ? await requestJson(`/api/entities/${encodeURIComponent(entity.id)}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      })
      : await requestJson("/api/entities", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    state.selectedEntityId = saved.id;
    await refreshAll();
    setActivity(entity ? "Node saved." : "Node created.");
  } catch (error) {
    setError(error instanceof Error ? error.message : "Unable to save entity");
  }
}

async function submitRelationship(event) {
  event.preventDefault();
  setError("");
  const payload = {
    sourceEntityId: dom.relationshipSource.value,
    targetEntityId: dom.relationshipTarget.value,
    kind: dom.relationshipKind.value,
    note: dom.relationshipNote.value.trim()
  };

  try {
    const edge = selectedRelationship();
    const saved = edge
      ? await requestJson(`/api/relationship-edges/${encodeURIComponent(edge.id)}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      })
      : await requestJson("/api/relationship-edges", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    state.selectedRelationshipId = saved.id;
    await refreshAll();
    setActivity(edge ? "Relationship saved." : "Relationship created.");
  } catch (error) {
    setError(error instanceof Error ? error.message : "Unable to save relationship");
  }
}

function queueEntityDelete() {
  const entity = selectedEntity();
  if (!entity) {
    return;
  }
  const incidentCount = getIncidentRelationships(entity.id).length;
  state.pendingDelete = { type: "entity", id: entity.id };
  dom.deleteConfirmTitle.textContent = `Delete ${entity.name}?`;
  dom.deleteConfirmBody.textContent = `This also removes ${incidentCount} incident relationship${incidentCount === 1 ? "" : "s"}.`;
  dom.deleteConfirm.hidden = false;
}

function queueRelationshipDelete() {
  const edge = selectedRelationship();
  if (!edge) {
    return;
  }
  state.pendingDelete = { type: "relationship", id: edge.id };
  dom.deleteConfirmTitle.textContent = `Delete ${edge.kind}?`;
  dom.deleteConfirmBody.textContent = `${entityLabel(edge.sourceEntityId)} -> ${entityLabel(edge.targetEntityId)}`;
  dom.deleteConfirm.hidden = false;
}

async function confirmPendingDelete() {
  if (!state.pendingDelete) {
    return;
  }
  setError("");
  try {
    if (state.pendingDelete.type === "entity") {
      await requestJson(`/api/entities/${encodeURIComponent(state.pendingDelete.id)}`, { method: "DELETE" });
      state.selectedEntityId = null;
    } else {
      await requestJson(`/api/relationship-edges/${encodeURIComponent(state.pendingDelete.id)}`, { method: "DELETE" });
      state.selectedRelationshipId = null;
    }
    state.pendingDelete = null;
    dom.deleteConfirm.hidden = true;
    await refreshAll();
    setActivity("Delete completed.");
  } catch (error) {
    setError(error instanceof Error ? error.message : "Unable to delete selection");
  }
}

function cancelPendingDelete() {
  state.pendingDelete = null;
  dom.deleteConfirm.hidden = true;
}

function clearEntitySelection() {
  state.selectedEntityId = null;
  state.selectedRelationshipId = null;
  render();
}

function clearRelationshipSelection() {
  state.selectedRelationshipId = null;
  render();
}

function clearRelationshipFilters() {
  state.relationshipFilters = { text: "", kind: "", direction: "all" };
  dom.relationshipSearch.value = "";
  render();
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

class ThreeGraphView {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf7fbfd);
    this.camera = new THREE.OrthographicCamera(-480, 480, 320, -320, -1200, 1200);
    this.camera.position.set(0, 0, 800);
    this.renderer = new THREE.WebGLRenderer({ canvas: dom.graph, antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.controls = new OrbitControls(this.camera, dom.graph);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enableRotate = false;
    this.controls.screenSpacePanning = true;
    this.controls.minZoom = 0.35;
    this.controls.maxZoom = 3.2;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.nodeMeshes = new Map();
    this.linkLines = new Map();
    this.clock = new THREE.Clock();
    this.simulation = null;
    this.graph = { nodes: [], links: [] };
    this.draggedNode = null;
    this.hoveredNodeId = null;
    this.clickTimer = null;
    this.width = 0;
    this.height = 0;
    this.pixelRatio = 0;

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xb8d6e4, 1.18));
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.36));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.25);
    keyLight.position.set(220, 340, 500);
    this.scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x8deaff, 1.45);
    rimLight.position.set(-360, -220, 420);
    this.scene.add(rimLight);
    const pearlLight = new THREE.PointLight(0xffd6f7, 1.65, 1100);
    pearlLight.position.set(180, -280, 360);
    this.scene.add(pearlLight);

    dom.graph.addEventListener("click", event => this.handleClick(event));
    dom.graph.addEventListener("dblclick", event => this.pick(event, true));
    dom.graph.addEventListener("pointerdown", event => this.startDrag(event));
    dom.graph.addEventListener("pointermove", event => this.handlePointerMove(event));
    dom.graph.addEventListener("pointerleave", () => this.clearTooltip());
    dom.graph.addEventListener("pointerup", () => this.endDrag());
    dom.graph.addEventListener("pointercancel", () => this.endDrag());
    this.resizeObserver = new ResizeObserver(() => this.resize(true));
    this.resizeObserver.observe(dom.graphFrame);
    window.addEventListener("resize", () => this.resize(true));

    this.resize(true);
    this.animate();
  }

  setGraph(graph) {
    const radius = Math.max(190, Math.min(420, graph.nodes.length * 16));
    this.graph = {
      nodes: graph.nodes.map((node, index) => {
        const angle = graph.nodes.length <= 1 ? 0 : (Math.PI * 2 * index) / graph.nodes.length;
        return {
          ...node,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: 0
        };
      }),
      links: graph.links.map(link => ({ ...link }))
    };
    this.rebuild();
  }

  rebuild() {
    for (const mesh of this.nodeMeshes.values()) {
      this.scene.remove(mesh);
    }
    for (const line of this.linkLines.values()) {
      this.scene.remove(line);
    }
    this.nodeMeshes.clear();
    this.linkLines.clear();
    dom.graphLabels.innerHTML = "";
    this.clearTooltip();

    for (const node of this.graph.nodes) {
      const style = visualRoleStyle(node);
      const geometry = this.createNodeGeometry(style.radius, visualRoleForEntity(node));
      const material = this.createNodeMaterial(node, style);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.renderOrder = 10;
      mesh.userData = { type: "node", id: node.id };
      this.nodeMeshes.set(node.id, mesh);
      this.scene.add(mesh);
    }

    for (const link of this.graph.links) {
      const material = new THREE.LineBasicMaterial({
        color: link.id === state.selectedRelationshipId ? 0xd06d1a : 0x2f5362,
        transparent: true,
        opacity: link.id === state.selectedRelationshipId ? 0.95 : 0.5,
        blending: THREE.NormalBlending
      });
      const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      const line = new THREE.Line(geometry, material);
      line.renderOrder = 0;
      line.userData = { type: "link", id: link.id };
      this.linkLines.set(link.id, line);
      this.scene.add(line);
    }

    const linkForce = forceLink(this.graph.links)
      .id(node => node.id)
      .distance(link => Math.max(66, 190 - relationshipWeight(link) * 13))
      .strength(link => 0.18 + relationshipWeight(link) * 0.05);

    this.simulation?.stop();
    this.simulation = forceSimulation(this.graph.nodes, 2)
      .force("link", linkForce)
      .force("charge", forceManyBody().strength(node => visualRoleStyle(node).charge))
      .force("center", forceCenter(0, 0))
      .force("collide", forceCollide(node => visualRoleStyle(node).collide))
      .force("radial", forceRadial(node => visualRoleStyle(node).orbit, 0, 0).strength(0.025))
      .force("ambientMotion", createAmbientMotionForce())
      .alpha(0.95)
      .alphaMin(REDUCED_MOTION ? 0.001 : 0.018)
      .alphaTarget(REDUCED_MOTION ? 0 : 0.032)
      .alphaDecay(REDUCED_MOTION ? 0.08 : 0.018)
      .velocityDecay(0.32);
  }

  createNodeMaterial(node, style) {
    const isMine = node.ownerUserId === state.currentUserId;
    const color = new THREE.Color(TYPE_COLORS[node.type] ?? TYPE_COLORS.topic);
    const emissive = color.clone().lerp(new THREE.Color(0xeffcff), isMine ? 0.52 : 0.24);
    const material = new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.11,
      metalness: 0.02,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      reflectivity: 0.92,
      iridescence: isMine ? 1 : 0.92,
      iridescenceIOR: isMine ? 2.45 : 2.18,
      iridescenceThicknessRange: isMine ? [180, 1200] : [160, 980],
      transmission: 0,
      thickness: 1.35,
      transparent: false,
      opacity: 1,
      depthWrite: true,
      emissive,
      emissiveIntensity: isMine ? 0.44 : 0.16,
      sheen: 0.55,
      sheenRoughness: 0.28,
      sheenColor: new THREE.Color(0xcffaff)
    });
    return applyIridescentFilm(material, color, isMine);
  }

  createNodeGeometry(radius, role) {
    const segments = role === "core" ? 48 : 40;
    return new THREE.SphereGeometry(radius, segments, Math.round(segments * 0.6));
  }

  resize(force = false) {
    const width = Math.max(320, Math.round(dom.graphFrame.clientWidth));
    const height = Math.max(320, Math.round(dom.graphFrame.clientHeight));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    if (!force && width === this.width && height === this.height && pixelRatio === this.pixelRatio) {
      return;
    }

    this.width = width;
    this.height = height;
    this.pixelRatio = pixelRatio;
    this.renderer.setPixelRatio(pixelRatio);
    this.camera.left = -width / 2;
    this.camera.right = width / 2;
    this.camera.top = height / 2;
    this.camera.bottom = -height / 2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.resize();
    if (this.simulation && !REDUCED_MOTION && !this.draggedNode) {
      this.simulation.alphaTarget(0.032).restart();
    }
    this.controls.update();
    this.updateObjects();
    this.renderer.render(this.scene, this.camera);
    this.renderLabels();
  }

  updateObjects() {
    const elapsed = this.clock.getElapsedTime();
    const nodeById = new Map(this.graph.nodes.map(node => [node.id, node]));
    for (const node of this.graph.nodes) {
      const mesh = this.nodeMeshes.get(node.id);
      if (!mesh) {
        continue;
      }
      const depthDrift = REDUCED_MOTION ? 0 : Math.sin(elapsed * 0.85 + (node.index ?? 0) * 0.37) * 10;
      mesh.position.set(node.x || 0, node.y || 0, depthDrift);
      if (!REDUCED_MOTION) {
        mesh.rotation.x += 0.0024;
        mesh.rotation.y += 0.0048;
      }
      const active = node.id === state.selectedEntityId || state.graphFilters.expandedNodeIds.has(node.id);
      const pulse = REDUCED_MOTION ? 1 : 1 + Math.sin(elapsed * 1.6 + (node.index ?? 0) * 0.53) * 0.025;
      mesh.scale.setScalar((active ? 1.22 : 1) * pulse);
    }

    for (const link of this.graph.links) {
      const source = typeof link.source === "object" ? link.source : nodeById.get(link.source);
      const target = typeof link.target === "object" ? link.target : nodeById.get(link.target);
      const line = this.linkLines.get(link.id);
      if (!source || !target || !line) {
        continue;
      }
      const positions = line.geometry.attributes.position;
      const sourceMesh = this.nodeMeshes.get(source.id);
      const targetMesh = this.nodeMeshes.get(target.id);
      positions.setXYZ(0, source.x || 0, source.y || 0, sourceMesh?.position.z ?? 0);
      positions.setXYZ(1, target.x || 0, target.y || 0, targetMesh?.position.z ?? 0);
      positions.needsUpdate = true;
      const weight = relationshipWeight(link);
      line.material.opacity = link.id === state.selectedRelationshipId
        ? 0.95
        : this.relationshipIsSpotlighted(link) ? Math.min(0.72, 0.22 + weight * 0.048) : 0.12;
      line.material.color.setHex(this.relationshipIsSpotlighted(link) ? 0x2f6f80 : 0x345261);
    }
  }

  relationshipIsSpotlighted(link) {
    if (!state.relationshipFilters.kind && !state.relationshipFilters.text) {
      return true;
    }
    return getScopedRelationships().some(edge => edge.id === link.id);
  }

  renderLabels() {
    dom.graphLabels.innerHTML = "";
    const rect = dom.graphFrame.getBoundingClientRect();
    for (const node of this.graph.nodes) {
      const shouldShow =
        node.id === state.selectedEntityId ||
        node.id === state.focusedEntityId ||
        node.ownerUserId === state.currentUserId ||
        (state.searchQuery && entityMatches(node));
      if (!shouldShow) {
        continue;
      }

      const mesh = this.nodeMeshes.get(node.id);
      if (!mesh) {
        continue;
      }
      const projected = mesh.position.clone().project(this.camera);
      const x = (projected.x * 0.5 + 0.5) * rect.width;
      const y = (-projected.y * 0.5 + 0.5) * rect.height;
      const label = document.createElement("span");
      label.className = `graph-label type-${node.type}`;
      label.style.transform = `translate(${x}px, ${y}px)`;
      label.textContent = node.label;
      dom.graphLabels.appendChild(label);
    }
  }

  pick(event, isDoubleClick) {
    const hit = this.getIntersectedNode(event);
    if (!hit) {
      return;
    }
    const id = hit.object.userData.id;
    if (isDoubleClick) {
      if (this.clickTimer) {
        clearTimeout(this.clickTimer);
        this.clickTimer = null;
      }
      event.preventDefault();
      toggleExpandedNode(id);
    } else {
      selectEntity(id);
    }
  }

  handleClick(event) {
    if (event.detail > 1) {
      return;
    }
    const hit = this.getIntersectedNode(event);
    if (!hit) {
      return;
    }
    const id = hit.object.userData.id;
    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
    }
    this.clickTimer = window.setTimeout(() => {
      this.clickTimer = null;
      selectEntity(id);
    }, 220);
  }

  startDrag(event) {
    const hit = this.getIntersectedNode(event);
    if (!hit) {
      return;
    }
    this.draggedNode = this.graph.nodes.find(node => node.id === hit.object.userData.id) ?? null;
    if (this.draggedNode) {
      this.controls.enabled = false;
      this.draggedNode.fx = this.draggedNode.x;
      this.draggedNode.fy = this.draggedNode.y;
      this.draggedNode.fz = this.draggedNode.z;
    }
  }

  drag(event) {
    if (!this.draggedNode) {
      return;
    }
    const scale = 1 / this.camera.zoom;
    this.draggedNode.fx += event.movementX * scale;
    this.draggedNode.fy -= event.movementY * scale;
    this.simulation?.alpha(0.25).restart();
  }

  handlePointerMove(event) {
    if (this.draggedNode) {
      this.drag(event);
      return;
    }

    this.updateTooltip(event);
  }

  updateTooltip(event) {
    const hit = this.getIntersectedNode(event);
    if (!hit) {
      this.clearTooltip();
      return;
    }

    const nodeId = hit.object.userData.id;
    const node = state.entities.find(entity => entity.id === nodeId);
    if (!node) {
      this.clearTooltip();
      return;
    }

    this.hoveredNodeId = nodeId;
    const frameRect = dom.graphFrame.getBoundingClientRect();
    const x = Math.min(frameRect.width - 250, Math.max(0, event.clientX - frameRect.left));
    const y = Math.min(frameRect.height - 110, Math.max(0, event.clientY - frameRect.top));
    const connectionCount = getIncidentRelationships(node.id).length;
    const ownerLine = node.ownerUserId ? `<span>Owner: ${escapeHtml(node.ownerUserId)}</span>` : "";
    const roleStyle = visualRoleStyle(node);

    dom.graphTooltip.innerHTML = `
      <strong>${escapeHtml(node.name)}</strong>
      <span>${escapeHtml(roleStyle.label)} vertex - ${escapeHtml(node.type)}</span>
      <span>ID: ${escapeHtml(node.id)}</span>
      <span>${connectionCount} connection${connectionCount === 1 ? "" : "s"}</span>
      ${ownerLine}
    `;
    dom.graphTooltip.style.transform = `translate(${x}px, ${y}px)`;
    dom.graphTooltip.hidden = false;
    dom.graph.style.cursor = "pointer";
  }

  clearTooltip() {
    this.hoveredNodeId = null;
    dom.graphTooltip.hidden = true;
    dom.graphTooltip.textContent = "";
    dom.graph.style.cursor = "";
  }

  endDrag() {
    if (this.draggedNode) {
      this.draggedNode = null;
      this.controls.enabled = true;
    }
  }

  getIntersectedNode(event) {
    const rect = dom.graph.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    return this.raycaster.intersectObjects([...this.nodeMeshes.values()], false)[0] ?? null;
  }

  zoom(delta) {
    const factor = delta < 0 ? 1.18 : 1 / 1.18;
    this.camera.zoom = Math.max(this.controls.minZoom, Math.min(this.controls.maxZoom, this.camera.zoom * factor));
    this.camera.updateProjectionMatrix();
  }

  reset() {
    this.camera.position.set(0, 0, 800);
    this.camera.zoom = 1;
    this.controls.target.set(0, 0, 0);
    this.camera.updateProjectionMatrix();
    this.controls.update();
  }

  fit() {
    this.reset();
  }
}

const graphView = new ThreeGraphView();

setPanelCollapsed("left", Boolean(state.collapsedPanels.left));
setPanelCollapsed("right", Boolean(state.collapsedPanels.right));

dom.toggleLeftPanel.addEventListener("click", () => togglePanel("left"));
dom.toggleRightPanel.addEventListener("click", () => togglePanel("right"));
dom.demoUser.addEventListener("change", async event => {
  state.currentUserId = event.target.value;
  localStorage.setItem(CURRENT_USER_KEY, state.currentUserId);
  state.selectedEntityId = null;
  state.selectedRelationshipId = null;
  await refreshAll();
});
dom.profileForm.addEventListener("submit", submitProfile);
dom.focusMine.addEventListener("click", () => {
  const employee = currentEmployee();
  if (employee) {
    focusGraph(employee.id);
  }
});
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
dom.entityDelete.addEventListener("click", queueEntityDelete);
dom.relationshipForm.addEventListener("submit", submitRelationship);
dom.relationshipReset.addEventListener("click", clearRelationshipSelection);
dom.relationshipDelete.addEventListener("click", queueRelationshipDelete);
dom.deleteConfirmSubmit.addEventListener("click", confirmPendingDelete);
dom.deleteConfirmCancel.addEventListener("click", cancelPendingDelete);
dom.undoBannerAction.addEventListener("click", () => {});
dom.undoBannerDismiss.addEventListener("click", () => { dom.undoBanner.hidden = true; });
dom.graphZoomIn.addEventListener("click", () => graphView.zoom(-120));
dom.graphZoomOut.addEventListener("click", () => graphView.zoom(120));
dom.graphResetView.addEventListener("click", () => graphView.reset());
dom.graphFitView.addEventListener("click", () => graphView.fit());
dom.focusSelected.addEventListener("click", () => state.selectedEntityId && focusGraph(state.selectedEntityId));
dom.showFullGraph.addEventListener("click", showFullGraph);
dom.reloadAll.addEventListener("click", refreshAll);

refreshAll().catch(error => setError(error instanceof Error ? error.message : "Unable to load SocialGraph"));
