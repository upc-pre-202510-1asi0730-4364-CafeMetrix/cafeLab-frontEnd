/**
 * @class CuppingSession
 * @description Represents a cupping session entity in the sensory evaluation context.
 */
class CuppingSession {
  /**
   * @param {string} id - The unique identifier for the cupping session.
   * @param {string} name - The name of the cupping session.
   * @param {string} date - The date of the cupping session (e.g., 'YYYY-MM-DD').
   * @param {string} origin - The origin of the coffee.
   * @param {string} variety - The variety of the coffee.
   * @param {string} process - The processing method of the coffee.
   * @param {string} lot - The lot identifier for the coffee.
   * @param {string} profile - The profile of the coffee.
   * @param {Object} ratings - An object containing sensory ratings (e.g., fragancia, sabor, etc.).
   */
  constructor(id, name, date, origin, variety, process, lot, profile, ratings = {}) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.origin = origin;
    this.variety = variety;
    this.process = process;
    this.lot = lot;
    this.profile = profile;
    this.ratings = ratings;
  }

  /**
   * Creates a CuppingSession instance from a plain object (e.g., from an API response).
   * @param {Object} data - The plain object containing cupping session data.
   * @returns {CuppingSession}
   */
  static fromJson(data) {
    return new CuppingSession(
      data.id,
      data.name,
      data.date,
      data.origin,
      data.variety,
      data.process,
      data.lot,
      data.profile,
      data.ratings
    );
  }

  /**
   * Converts the CuppingSession instance to a plain object (e.g., for sending to an API).
   * @returns {Object}
   */
  toJson() {
    return {
      id: this.id,
      name: this.name,
      date: this.date,
      origin: this.origin,
      variety: this.variety,
      process: this.process,
      lot: this.lot,
      profile: this.profile,
      ratings: this.ratings,
    };
  }
}

export { CuppingSession }; 