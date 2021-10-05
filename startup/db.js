const mongoose = require("mongoose");

module.exports = function (uri) {
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err) => {
      console.error(err.stack);
      process.exit(1);
    })
    .then(() => {
      console.log("Connected to MongoDB...");
    });
};
