const { Router } = require("express");
const router = Router();
const user = require("../controllers/user");

router.get("/", user.getIndex);

module.exports = router;
