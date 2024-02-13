import express from "express";
import RoutesController from "../controllers/routes.mjs";
import VisitorsController from "../controllers/visitors.mjs";

const router = express.Router();

const routesController = new RoutesController();
const visitorsController = new VisitorsController();

router.get("/", async (req, res) => {
  const results = await routesController.getRoutes();
  res.send(results).status(200);
});

router.post("/redirect", async (req, res) => {
  const route = req.query.route;
  const routeDetails = await routesController.getRoute(route);
  if (routeDetails) {
    visitorsController.insertVisitor(
      route,
      routeDetails,
      req.body
    );
    return res.send(routeDetails).status(200);
  } else {
    const allRoutes = await routesController.getRoutes({isPublic: true});
    return res.send(allRoutes).status(404);
  }
});

router.get("/stats", async (req, res) => {
  const route = req.query.route;
  const results = await routesController.getRouteStats(route);
  res.send(results).status(200);
});

router.delete("/:id", async (req, res) => {
  const result = await routesController.deleteRoute(req.params.id);

  res.send(result).status(200);
});

router.post("/", async (req, res) => {
  try {
    const results = await routesController.createRoute(req.body, req.auth.sub);
    res.send(results).status(201);
  } catch (e) {
    console.error(e);
    const error = {
      error: e.toString(),
      status: "failed"
    };
    return res.status(500).send(error);
  }
});

router.put("/:id", async (req, res) => {
  const results = await routesController.updateRoute(req.params.id, req.body);

  res.send(results).status(200);
});

export default router;