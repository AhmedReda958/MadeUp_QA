export default class IntegerRange {
  #start;
  get start() { return this.#start; }
  set start(value) {
    if (!Number.isInteger(value) && Math.abs(value) != Infinity)
      throw new Error("Range start must be an integer or Infinity.");
    this.#start = value;
  }

  #end;
  get end() { return this.#end; }
  set end(value) {
    if (!Number.isInteger(value) && Math.abs(value) != Infinity)
      throw new Error("Range end must be an integer or Infinity.");
    this.#end = value;
  }

  #step;
  get step() { return this.#step; }
  set step(value) {
    if (!Number.isInteger(value))
      throw new Error("Range step must be an integer.");
    this.#step = Math.abs(value);
  }

  #includeStart;
  get includeStart() { return this.#includeStart; }
  set includeStart(value) {
    if (typeof value != 'boolean')
      throw new Error("Range includeStart state must be a boolean value.");
    this.#includeStart = value;
  }

  #includeEnd;
  get includeEnd() { return this.#includeEnd; }
  set includeEnd(value) {
    if (typeof value != 'boolean')
      throw new Error("Range includeEnd state must be a boolean value.");
    this.#includeEnd = value;
  }

  get ascending() { return this.#start <= this.#end; }

  includes(value) {
    if (!Number.isInteger(value)) return false;
    if (value == this.#start) return this.#includeStart;
    if (value == this.#end) return this.#includeEnd;
    let afterStart = value > this.#start;
    if (!afterStart || value > this.#end) return false;
    if (this.#step == 1) return true;
    return (value - (afterStart ? this.#start : this.#end)) % this.#step == 0;
  }

  /**
   * @param {number} start 
   * @param {number} end 
   * @param {number} step 
   * @param {boolean} includeStart 
   * @param {boolean} includeEnd 
   */
  constructor(start = -Infinity, end = Infinity, step = 1, includeStart = true, includeEnd = true) {
    this.start = start;
    this.end = end;
    this.step = step;
    this.includeStart = includeStart;
    this.includeEnd = includeEnd;
  }
}