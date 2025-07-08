const Swap = require("../models/Swap");
const Seed = require("../models/Seed");

exports.initiateSwap = async (req, res) => {
  const { seedOffered, seedRequested } = req.body;
  try {
    const offered = await Seed.findById(seedOffered);
    const requested = await Seed.findById(seedRequested);

    if (!offered || !requested)
      return res.status(404).json({ msg: "Seed not found" });

    const swap = await Swap.create({
      requester: req.userId,
      receiver: requested.owner,
      seedOffered,
      seedRequested,
    });

    res.status(201).json(swap);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getMySwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ requester: req.userId }, { receiver: req.userId }],
    }).populate("seedOffered seedRequested requester receiver", "-password");

    res.status(200).json(swaps);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateSwapStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const swap = await Swap.findById(req.params.id).populate("receiver");

    if (!swap) return res.status(404).json({ msg: "Swap not found" });

    // Only receiver can update the status
    if (swap.receiver._id.toString() !== req.userId)
      return res.status(403).json({ msg: "Unauthorized" });

    swap.status = status;
    await swap.save();

    res.status(200).json(swap);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
