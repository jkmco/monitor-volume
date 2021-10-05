const mongoose = require("mongoose");

const VolumeAlert = mongoose.model(
  "VolumeAlert",
  new mongoose.Schema(
    {
      symbol: String,
      closePrice: Number,
      totalVolume: Number,
      averageVolume: Number,
      latestVolume: Number,
      btcTotalVolume: Number,
      btcAverageVolume: Number,
      btcLatestVolume: Number,
      isVolumeIncreasedBy50x: Boolean,
      isBtcVolumeIncreasedBy10x: Boolean,
      isConsiderationLargerThan500k: Boolean,
      updatedAt: Date,
    },
    { timestamps: { createdAt: "createdAt" } }
  )
);

module.exports = VolumeAlert;
