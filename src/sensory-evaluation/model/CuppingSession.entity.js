class CuppingSession {
  constructor(id, name, date, origin, variety, process, lot, profile, ratings = {}, user_id = null) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.origin = origin;
    this.variety = variety;
    this.process = process;
    this.lot = lot;
    this.profile = profile;
    this.ratings = ratings;
    this.user_id = user_id; // nombre correcto
  }

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
        data.ratings,
        data.user_id // aquí también
    );
  }

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
      user_id: this.user_id // y aquí
    };
  }
}
