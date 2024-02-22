export default class UnhandledError extends Error {
  constructor(action, error, message) {
    super(message);
    this.name = "UnhandledError";
    this.action = action;
    this.error = error;
  }
}
