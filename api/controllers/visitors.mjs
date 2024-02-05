import db from "../db/conn.mjs";

export default class Visitors {
  async insertVisitor(route, routeDetails, request) {
    let collection = await db.collection("visitors");
    let location = {};
    if (request.remoteIPAddress) {
      const locationData = await this.getLocationFromIP(request.remoteIPAddress);
      location = locationData;
    }
    const visitor = Object.assign(
      {},
      request,
      {requestedRoute: route},
      {routeDetails},
      {timestamp: new Date()},
      {location}
    );
    let result = await collection.insertOne(visitor);
    return result;
  }

  async getLocationFromIP(ip) {
    const url = `http://ip-api.com/json/${ip}`;
    const location = await fetch(url).then(resp => resp.json());
    if (location.status === "fail") {
      return {};
    }
    return location;
  }
}