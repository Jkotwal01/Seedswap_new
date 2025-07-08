const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const upload = require("../middlewares/upload"); // ✅ include this
const {
  getMyProfile,
  updateMyProfile,
  updateProfileImage,
  getDashboardStats,
} = require("../controllers/userController");

router.get("/me", verifyToken, getMyProfile);
router.put("/me", verifyToken, updateMyProfile);
router.put(
  "/me/photo",
  verifyToken,
  upload.single("image"),
  updateProfileImage
); // ✅ this one
router.get("/dashboard", verifyToken, getDashboardStats);

module.exports = router;
