const express = require("express");
const router = express.Router();
const { getPublicSeeds } = require("../controllers/marketplaceController");

router.get("/", getPublicSeeds); // GET /api/marketplace?search=tomato&type=Herb&location=Pune

module.exports = router;
