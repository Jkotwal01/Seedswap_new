const mongoose = require("mongoose");

const seedSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: String, // e.g., Herb, Vegetable, Flower
    quantity: {
      type: Number,
      default: 1,
    },
    image: String, // URL or path
    available: {
      type: Boolean,
      default: true,
    },
    location: String,
    
    public: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Seed || mongoose.model("Seed", seedSchema);

