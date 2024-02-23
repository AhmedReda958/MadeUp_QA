import CommonError from "./common.mjs";
export default class DatabaseError extends CommonError {
  /**
   * @param {string} action 
   * @param {ConstructorParameters<typeof CommonError>} params 
   */
  constructor(action, ...params) {
    super(...params);
    this.name = "DatabaseError";
    this.action = action;
  }
}
