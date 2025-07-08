const Seed = require("../models/seed");
const User = require("../models/User");

exports.getPublicSeeds = async (req, res) => {
  try {
    const { search, type, location } = req.query;

    const query = { public: true };

    if (search) query.name = { $regex: search, $options: "i" };
    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: "i" };

    const seeds = await Seed.find(query)
      .populate("owner", "name location gardenType profileImg") // show basic user info
      .sort({ createdAt: -1 });

    res.status(200).json(seeds);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
