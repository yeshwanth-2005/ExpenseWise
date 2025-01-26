const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

router.get("/", auth, userController.getUserInfo);
router.delete("/delete", auth, userController.deleteUser);
router.put("/update", auth, userController.updateUser);
router.put("/password", auth, userController.changePassword);

module.exports = router;
