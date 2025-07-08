// controllers/messageController.js

const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  try {
    const msgs = await Message.find({ swapId: req.params.swapId })
      .sort({ createdAt: 1 }) // Oldest first
      .populate("sender", "name profileImg");

    res.status(200).json(msgs);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
