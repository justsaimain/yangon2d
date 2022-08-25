const { Router } = require("express");
const router = Router();
const api = require("../controllers/api");

router.get("/", api.getIndex);
router.get("/live", api.getLive);
router.get("/today", api.getTodayResult);
router.get("/close-days", api.getCloseDays);
router.get("/alert", api.getAlertText);
router.get("/results", api.getResult);
module.exports = router;
