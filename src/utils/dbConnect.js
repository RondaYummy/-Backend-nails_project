const mongoose = require('mongoose');

module.exports = async (uri) => {
  await mongoose.connect(
    uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    },
  );

  console.log(`MongoDB is connected on: ${uri}`);
};
