const sessions = {};

function setSession(sessionId, data) {
  sessions[sessionId] = { ...sessions[sessionId], ...data };
}

function getSession(sessionId) {
  return sessions[sessionId] || {};
}

function clearSession(sessionId) {
  delete sessions[sessionId];
}

module.exports = { setSession, getSession, clearSession };