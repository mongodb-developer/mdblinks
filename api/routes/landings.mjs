import express from "express";
import LandingsController from "../controllers/landings.mjs";

const router = express.Router();
const landingsController = new LandingsController();

router.get("/", async (req, res) => {
  let results = await landingsController.getLandings();

  res.send(results).status(200);
});

router.get("/:identifier", async (req, res) => {
  let results = await landingsController.getLanding(req.params.identifier);

  res.send(results).status(200);
});

router.delete("/:identifier", async (req, res) => {
  const result = await landingsController.deleteLanding(req.params.identifier);

  res.send(result).status(200);
});

router.post("/", async (req, res) => {
  const results = await landingsController.createLanding(req.body, req.auth.sub);

  res.send(results).status(201);
});

router.put("/:identifier", async (req, res) => {
  const results = await landingsController.updateLanding(req.params.identifier, req.body);

  res.send(results).status(200);
});

export default router;