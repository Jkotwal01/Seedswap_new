const User = require("../models/User");
const Seed = require("../models/seed");
const Swap = require("../models/Swap");

// GET /api/user/me
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// PUT /api/user/me
exports.updateMyProfile = async (req, res) => {
  try {
    const updates = req.body;
    const updated = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
    }).select("-password");
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// GET /api/user/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;

    const seedCount = await Seed.countDocuments({ owner: userId });

    const swaps = await Swap.find({
      $or: [{ requester: userId }, { receiver: userId }],
    });

    const stats = {
      totalSeeds: seedCount,
      totalSwaps: swaps.length,
      sent: swaps.filter((s) => s.requester.toString() === userId).length,
      received: swaps.filter((s) => s.receiver.toString() === userId).length,
      completed: swaps.filter((s) => s.status === "completed").length,
      pending: swaps.filter((s) => s.status === "pending").length,
    };

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
exports.updateProfileImage = async (req, res) => {
  try {
    const image = req.file ? req.file.path : null;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { profileImg: image },
      { new: true }
    ).select("-password");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: "Image upload failed" });
  }
};
