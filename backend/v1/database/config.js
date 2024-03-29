const mongoose = require('mongoose');

const dbConecction = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('db online');
  } catch (error) {
    // console.log(error);
    throw new Error('Error en la base de datos');
  }
};

module.exports = { dbConecction };
