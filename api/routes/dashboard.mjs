import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();

router.get("/filters", async (req, res) => {

  const collection = db.collection("routes");
  const utm_source = await collection.distinct("utms.utm_source");
  const utm_term = await collection.distinct("utms.utm_term");
  const utm_medium = await collection.distinct("utms.utm_medium");
  const utm_content = await collection.distinct("utms.utm_content");
  const results = {
    utm_source, utm_term, utm_medium, utm_content
  };

  res.send(results).status(200);
});

export default router;