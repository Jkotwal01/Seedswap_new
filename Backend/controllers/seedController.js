const Seed = require("../models/seed");

exports.createSeed = async (req, res) => {
  try {
    const { name, type, location, description, public } = req.body;

    const newSeed = new Seed({
      name,
      type,
      location,
      description,
      public, // ✅ use `public` flag
      image: req.file?.filename,
      owner: req.userId,
    });

    await newSeed.save();
    res.status(201).json(newSeed);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
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
    const { id } = req.params;

    const updates = {
      name: req.body.name,
      type: req.body.type,
      location: req.body.location,
      description: req.body.description,
      public: req.body.public, // ✅ include `public`
    };

    if (req.file?.filename) {
      updates.image = req.file.filename;
    }

    const updatedSeed = await Seed.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.status(200).json(updatedSeed);
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
