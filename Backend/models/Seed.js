const mongoose = require("mongoose");

const seedSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: String,
    location: String,
    description: String,
    image: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    public: { type: Boolean, default: false }, // ✅ <-- Add this line
  },
  { timestamps: true }
);

module.exports = mongoose.models.Seed || mongoose.model("Seed", seedSchema);
