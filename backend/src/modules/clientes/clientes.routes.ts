import { Router } from "express";
import { ClientesController } from "./clientes.controller";
import { checkJwt } from "../../middlewares/session";

const router = Router();
const controller = new ClientesController();

// Rutas protegida: Solo si envían el Token del Login podrán crear clientes
router.post("/", checkJwt, (req, res) => controller.create(req, res));

router.get("/", checkJwt, (req, res) => controller.list(req, res));

router.get("/:id", checkJwt, (req, res) => controller.getDetail(req, res));

router.put("/:id", checkJwt, (req, res) => controller.update(req, res));

router.delete("/:id", checkJwt, (req, res) => controller.delete(req, res));

export { router };