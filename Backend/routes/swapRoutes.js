const express = require("express");
const router = express.Router();

const {
  initiateSwap,
  getMySwaps,
  acceptSwap,
  rejectSwap,
  completeSwap,
} = require("../controllers/swapController");

const { verifyToken } = require("../middlewares/auth");

router.post("/", verifyToken, initiateSwap);
router.get("/me", verifyToken, getMySwaps);
router.put("/:id/accept", verifyToken, acceptSwap);
router.put("/:id/reject", verifyToken, rejectSwap);
router.put("/:id/complete", verifyToken, completeSwap);

module.exports = router;
