import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

export default class Landings {
  async getLandings(query) {
    if (!query) {
      query = {};
    }
    let collection = await db.collection("landings");
    let results = await collection.find(query).toArray();

    return results;
  }

  async getLanding(identifier) {
    let collection = await db.collection("landings");
    let results = await collection.findOne({identifier});
    return results;
  }

  async createLanding(landing, userId) {
    let collection = await db.collection("landings");
    landing.owner = userId;
    let results = await collection.insertOne(landing);
    return results;
  }

  async updateLanding(identifier, update) {
    let collection = await db.collection("landings");
    let results = await collection.updateOne({identifier}, { $set: update });
    return results;
  }

  async deleteLanding(identifier) {
    let collection = await db.collection("landings");
    let results = await collection.deleteOne({ identifier });
    return results;
  }
}