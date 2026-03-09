import { Router } from "express";
import { CitasController } from "./citas.controller";
import { checkJwt } from "../../middlewares/session";

const router = Router();
const controller = new CitasController();

router.post("/", checkJwt, (req, res) => controller.create(req, res));

router.get("/", checkJwt, (req, res) => controller.list(req, res));

router.put("/:id", checkJwt, (req, res) => controller.update(req, res));

router.delete("/:id", checkJwt, (req, res) => controller.delete(req, res));

export { router };