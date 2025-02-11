import { Hono } from "hono";
import { KomikuController } from "../controllers/komiku_controller.js";

const komikuRoute = new Hono();
komikuRoute.get('/popular', KomikuController.popular);
komikuRoute.get('/updated', KomikuController.updated);
komikuRoute.get('/detail/:endpoint', KomikuController.detail);
komikuRoute.get('/search', KomikuController.search);
komikuRoute.get('/chapter/:endpoint', KomikuController.chapter);

export default komikuRoute