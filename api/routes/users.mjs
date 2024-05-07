import express from "express";
import UsersController from "../controllers/users.mjs";

const router = express.Router();

const usersController = new UsersController();

router.get("/me", async (req, res) => {
  const userId = req.auth.sub;
  const user = await usersController.getUser(userId);
  res.send(user).status(200);
});

router.put("/me", async (req, res) => {
  const userId = req.auth.sub;
  const response = await usersController.updateUser(userId, req.body);
  res.send(response).status(200);
});

router.get("/teams", async (req, res) => {
  const teams = await usersController.getTeams();
  res.send(teams).status(200);
});

export default router;