const { Router } = require("express");
const router = Router();
const admin = require("../controllers/admin");
const adminMiddleware = require("../middlewares/admin");

router.get("/login", admin.getLogin);
router.post("/login", admin.postLogin);

router.use(adminMiddleware);

router.post("/logout", admin.postLogout);

router.get("/", admin.getIndex);

router.get("/alert", admin.getAlert);
router.post("/alert", admin.postAlert);

router.get("/next", admin.getNext);
router.post("/next", admin.postNext);
router.delete("/next/:id", admin.deleteNext);

router.get("/close-days", admin.getCloseDay);
router.post("/close-days", admin.saveCloseDay);
router.delete("/close-days/:id", admin.deleteCloseDay);

router.get("/results", admin.getResult);
router.get("/results/add", admin.addResultPage);
router.post("/results/add", admin.addResult);
router.post("/results/update", admin.updateResult);
router.get("/results/:id", admin.editResultPage);
router.delete("/results/:id", admin.deleteResult);

module.exports = router;
