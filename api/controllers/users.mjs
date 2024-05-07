import db from "../db/conn.mjs";

export default class Users {
  async getUser(_id) {
    let collection = await db.collection("users");
    let user = await collection.aggregate([
      {
        '$match': { _id }
      }, {
        '$lookup': {
          'from': 'utms',
          'localField': 'team',
          'foreignField': '_id',
          'as': 'utms'
        }
      }, {
        '$set': {
          'utms': {
            '$cond': {
              'if': {
                '$size': '$utms'
              },
              'then': {
                '$arrayElemAt': [
                  '$utms', 0
                ]
              },
              'else': {
                'campaigns': [],
                'mediums': [],
                'sources': [],
                'contents': [],
                'terms': []
              }
            }
          }
        }
      }
    ]).toArray();
    user = user[0] || {};

    return user;
  }

  async updateUser(_id, data) {
    let collection = await db.collection("users");
    let result = await collection.updateOne({_id}, {$set: data}, {upsert: true});

    return result;
  }

  async getTeams() {
    let collection = await db.collection("utms");
    let utms = await collection.find().toArray();
    let teams = utms.map(team => {
      return {value: team._id, displayName: team.displayName}
    });

    return teams;
  }
}
