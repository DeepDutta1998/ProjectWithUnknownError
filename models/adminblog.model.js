const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userBlog = new Schema(
  {
    titles: {
      type: String,
      require:true
    },
    dates:{
        type: String,
        require: true
    },
    writers:{
        type: String,
        require: true
    },
    images:{
        type: String,
        require: true
    },
    contents:{
        type: String,
        require: true
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
module.exports = new mongoose.model("user-Blog", userBlog);
