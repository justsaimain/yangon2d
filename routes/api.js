const { Router } = require("express");
const router = Router();
const api = require("../controllers/api");

router.get("/", api.getIndex);

module.exports = router;
