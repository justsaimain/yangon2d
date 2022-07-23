const { Router } = require("express");
const bodyParser = require("body-parser");
const router = Router();
const admin = require("../controllers/admin");
const adminMiddleware = require("../middlewares/admin");

router.get("/login", admin.getLogin);
router.post("/login", admin.postLogin);
// router.use(adminMiddleware);

router.get("/", admin.getIndex);
router.get("/close-days", admin.getCloseDay);
router.post("/close-days", admin.saveCloseDay);
router.delete("/close-days/:id", admin.deleteCloseDay);

module.exports = router;
