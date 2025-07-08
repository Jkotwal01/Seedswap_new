// routes/messageRoutes.js

const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { getMessages } = require("../controllers/messageController");

router.get("/messages/:swapId", verifyToken, getMessages);

module.exports = router;
