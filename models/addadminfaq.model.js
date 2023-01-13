const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminFaq = new Schema(
  {
    questions:{
      type:String,
      required:true
    },
    answers:{
      type:String,
      required:true
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

module.exports = new mongoose.model("Admin-Faq", adminFaq);
