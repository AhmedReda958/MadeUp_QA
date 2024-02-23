export default class CommonError extends Error {
  /**
   * @param {any} source 
   * @param {string?} message 
   */
  constructor(source, message) {
    super(message);
    this.name = "CommonError";
    this.source = source;
  }
}
