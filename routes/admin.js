const { Router } = require("express");
const router = Router();
const admin = require("../controllers/admin");

router.get("/", admin.getIndex);

module.exports = router;
