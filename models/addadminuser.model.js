const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addadminuserSchema = new Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    isDeleted:{
      type:Boolean,
      default:false,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = new mongoose.model("Admin-User", addadminuserSchema);