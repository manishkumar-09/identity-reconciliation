import { Router } from "express";
import { handleIndentity } from "../controllers/identity.controller";

const router = Router();

router.post("/identity", handleIndentity);

export { router };
