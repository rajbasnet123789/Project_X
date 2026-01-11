const streams = new Map();

export function openStream(taskId, ws) {
  streams.set(taskId, ws);
}

export function closeStream(taskId) {
  streams.delete(taskId);
}

export function sendStream(taskId, message) {
  const ws = streams.get(taskId);
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(message));
  }
}
