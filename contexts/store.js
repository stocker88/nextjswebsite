// eventHandler.js
const eventHandlers = {};

export const subscribeToEvent = (eventName, callback) => {
  if (!eventHandlers[eventName]) {
    eventHandlers[eventName] = [];
  }
  eventHandlers[eventName].push(callback);
};

export const emitEvent = (eventName, data) => {
  const handlers = eventHandlers[eventName];
  if (handlers) {
    handlers.forEach((handler) => handler(data));
  }
};
