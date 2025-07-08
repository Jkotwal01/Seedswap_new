const Swap = require("../models/Swap");
const Seed = require("../models/seed");
const User = require("../models/User");
const { sendMail } = require("../utils/mailer");

// ✅ Initiate a Swap Request
exports.initiateSwap = async (req, res) => {
  try {
    const { requestedSeedId, offeredSeedId } = req.body;

    const seedRequested = await Seed.findById(requestedSeedId).populate(
      "owner"
    );
    const seedOffered = await Seed.findById(offeredSeedId);

    if (!seedRequested || !seedOffered) {
      return res.status(404).json({ msg: "Seed not found" });
    }

    const swap = new Swap({
      requester: req.userId,
      receiver: seedRequested.owner._id,
      requestedSeed: requestedSeedId,
      offeredSeed: offeredSeedId,
    });

    await swap.save();

    // ✅ Send email to receiver
    await sendMail(
      seedRequested.owner.email,
      "🌱 New Swap Request on SeedSwap",
      `Hi ${seedRequested.owner.name},\n\nYou've received a new swap request for "${seedRequested.name}".\nLog in to SeedSwap to respond.\n\n— The SeedSwap Team`
    );

    res.status(201).json({ msg: "Swap request initiated", swap });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

// ✅ Get All Swaps Related to Current User
exports.getMySwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ requester: req.userId }, { receiver: req.userId }],
    })
      .populate("requestedSeed offeredSeed requester receiver", "-password")
      .sort({ createdAt: -1 });

    res.status(200).json(swaps);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Accept a Swap
exports.acceptSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id)
      .populate("requester")
      .populate("requestedSeed");

    if (!swap) return res.status(404).json({ msg: "Swap not found" });
    if (swap.receiver.toString() !== req.userId)
      return res.status(403).json({ msg: "Unauthorized" });

    swap.status = "accepted";
    await swap.save();

    await sendMail(
      swap.requester.email,
      "✅ Your Seed Swap Was Accepted!",
      `Hi ${swap.requester.name},\n\nYour seed swap request for "${swap.requestedSeed.name}" was accepted!\nPlease coordinate with the user to complete the swap.\n\n— The SeedSwap Team`
    );

    res.status(200).json({ msg: "Swap accepted", swap });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ❌ Reject a Swap
exports.rejectSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id)
      .populate("requester")
      .populate("requestedSeed");

    if (!swap) return res.status(404).json({ msg: "Swap not found" });
    if (swap.receiver.toString() !== req.userId)
      return res.status(403).json({ msg: "Unauthorized" });

    swap.status = "rejected";
    await swap.save();

    await sendMail(
      swap.requester.email,
      "❌ Your Swap Request Was Rejected",
      `Hi ${swap.requester.name},\n\nYour request for "${swap.requestedSeed.name}" was rejected.\nYou can try requesting other seeds on SeedSwap.\n\n— The SeedSwap Team`
    );

    res.status(200).json({ msg: "Swap rejected", swap });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Complete a Swap
exports.completeSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id)
      .populate("requester")
      .populate("receiver");

    if (!swap) return res.status(404).json({ msg: "Swap not found" });

    if (
      ![swap.requester._id.toString(), swap.receiver._id.toString()].includes(
        req.userId
      )
    ) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    swap.status = "completed";
    await swap.save();

    await sendMail(
      swap.receiver.email,
      "🌟 Swap Completed",
      `Hi ${swap.receiver.name},\n\nYour seed swap with ${swap.requester.name} has been marked as completed.\nThanks for participating!\n\n— SeedSwap`
    );

    await sendMail(
      swap.requester.email,
      "🌟 Swap Completed",
      `Hi ${swap.requester.name},\n\nYour seed swap with ${swap.receiver.name} has been marked as completed.\nThanks for participating!\n\n— SeedSwap`
    );

    res.status(200).json({ msg: "Swap completed", swap });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
