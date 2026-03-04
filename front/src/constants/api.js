export const API_PORT = 8368;
export const API_URL = `http://localhost:${API_PORT}/api/`;
export const mediaUrl = (path) => path.startsWith('http') ? path : `http://localhost:${API_PORT}/media/${path}`;
export const wsUrl = (group, clientId) => `ws://localhost:${API_PORT}/api/ws/${group}?clientId=${clientId}`;
