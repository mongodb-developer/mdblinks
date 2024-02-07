import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

export default class Routes {
  async getRoutes(query) {
    if (!query) {
      query = {};
    }
    let collection = await db.collection("routes");
    let results = await collection.find(query).toArray();

    return results;
  }

  async getRoute(route) {
    let collection = await db.collection("routes");
    let results = await collection.findOne({route});
    return results;
  }

  async getRouteStats(route) {
    let time7DaysAgo = (new Date()).getTime() - 7*24*60*60*1000;
    let time30DaysAgo = (new Date()).getTime() - 30*24*60*60*1000;

    let getLastDaysPipeline = (timestamp) => {
      return [
      {$match: {requestedRoute: route}},
      {$match: {
        timestamp: {
          "$gt": new Date(timestamp),
          "$lt": new Date()
          }
        }
      },
      {$count: 'visits'}];
    };

    let collection = await db.collection("visitors");
    let visitorsLast7Days = await collection.aggregate(getLastDaysPipeline(time7DaysAgo)).toArray();
    let visitorsLast30Days = await collection.aggregate(getLastDaysPipeline(time30DaysAgo)).toArray();

    let visitorsAllTime = await collection.aggregate([
      {$match: {requestedRoute: route}},
      {$count: 'visits'}]
    ).toArray();

    let topReferrers = await collection.aggregate([
      {$match: {
            requestedRoute: route,
            originalReferrer: { $nin: ["", null] } },
      },
      {$group: {
        _id: "$originalReferrer",
        count: { $sum: 1 }
        }
      },
      {$sort: { count: -1 } },
      { $limit: 5 },
    ]).toArray();

    const results = {
      route,
      stats: {
        visits: visitorsLast7Days[0]?.visits?.toString(),
        visits30: visitorsLast30Days[0]?.visits?.toString(),
        visitsAllTime: visitorsAllTime[0]?.visits?.toString(),
        topReferrers
      }
    };

    return results;
  }

  extractUtmsFromUrl(url) {
    const urlParams = new URLSearchParams(url.substr(url.indexOf("?")));

    let utms = {};

    for (let key of urlParams.keys()) {
      if (key.startsWith("utm")) {
        utms[key] = urlParams.get(key);
      }
    }

    return utms;
  }

  async deleteRoute(id) {
    let collection = await db.collection("routes");
    let result = await collection.deleteOne({ _id: new ObjectId(id) });

    return result;
  }

  async createRoute(route, userId) {
    let collection = await db.collection("routes");
    route.utms = this.extractUtmsFromUrl(route.to);
    route.owner = userId;
    let result = await collection.insertOne(route);

    return result;
  }

  async updateRoute(id, route) {
    let collection = await db.collection("routes");
    route.utms = this.extractUtmsFromUrl(route.to);
    let result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: route });

    return result;
  }
}
