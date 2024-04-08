const mongoose = require("mongoose");
// for fix "MongooseServerSelectionError" change "localhost" into "127.0.0.1" ↓ 
const mongooseURI = "mongodb://127.0.0.1:27017/inotebook";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongooseURI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

module.exports = connectToMongo;
