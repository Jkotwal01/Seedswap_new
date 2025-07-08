const Seed = require("../models/seed");

exports.createSeed = async (req, res) => {
  const { name, type, quantity, location } = req.body;
  try {
    const image = req.file ? req.file.path : null;

    const seed = await Seed.create({
      name,
      type,
      quantity,
      location,
      image,
      owner: req.userId,
    });

    res.status(201).json(seed);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create seed" });
  }
};

exports.getAllSeeds = async (req, res) => {
  try {
    const { type, location } = req.query;
    const filters = {};

    if (type) filters.type = type;
    if (location) filters.location = location;

    const seeds = await Seed.find(filters).populate("owner", "name location");
    res.status(200).json(seeds);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getSeedById = async (req, res) => {
  try {
    const seed = await Seed.findById(req.params.id).populate(
      "owner",
      "name location"
    );
    if (!seed) return res.status(404).json({ msg: "Seed not found" });

    res.status(200).json(seed);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateSeed = async (req, res) => {
  try {
    const seed = await Seed.findById(req.params.id);
    if (!seed) return res.status(404).json({ msg: "Seed not found" });

    if (seed.owner.toString() !== req.userId)
      return res.status(403).json({ msg: "Unauthorized" });

    const updated = await Seed.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.deleteSeed = async (req, res) => {
  try {
    const seed = await Seed.findById(req.params.id);
    if (!seed) return res.status(404).json({ msg: "Seed not found" });

    if (seed.owner.toString() !== req.userId)
      return res.status(403).json({ msg: "Unauthorized" });

    await Seed.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Seed deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
