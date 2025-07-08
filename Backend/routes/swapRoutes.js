const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const {
  initiateSwap,
  getMySwaps,
  updateSwapStatus,
} = require("../controllers/swapController");

// Protected
router.post("/", verifyToken, initiateSwap);
router.get("/me", verifyToken, getMySwaps);
router.patch("/:id", verifyToken, updateSwapStatus);

module.exports = router;
