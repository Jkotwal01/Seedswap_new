const express = require("express");
const router = express.Router();
const {
  createSeed,
  getAllSeeds,
  getSeedById,
  updateSeed,
  deleteSeed,
} = require("../controllers/seedController");
const { verifyToken } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// Public
router.get("/", getAllSeeds);
router.get("/:id", getSeedById);

// Protected
router.post("/", verifyToken, createSeed);
router.patch("/:id", verifyToken, updateSeed);
router.delete("/:id", verifyToken, deleteSeed);
router.post("/", verifyToken, upload.single("image"), createSeed);

module.exports = router;
