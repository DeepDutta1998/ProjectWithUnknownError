const user = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserFaq = require("../models/adduserfaq.model");



class UserController {
  constructor() {}

  /**
   * @Method showIndex
   * @Description To Show The Index Page / Login Page
   */

  async showIndex(req, res) {
    try {
      res.render("user/index", {
        title: "User || Login",
        message: req.flash("message"),
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @Method Registration
   * @Description To Show The Registration Page
   */

  async registration(req, res) {
    try {
      res.render("user/userRegistration", {
        title: "User||Registation",
        message: req.flash("message"),
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @Method UserRegistration
   * @Description To Show The Register User
   */

  async userRegister(req, res) {
    try {
      if (req.body.password === req.body.confirmpassword) {
        req.body.password = bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10)
        );
        let isEmailExits = await user.findOne({ email: req.body.email });
        if (!isEmailExits) {
          req.body.image = req.file.filename;
          let saveData = await user.create(req.body);
          console.log(req.body);
          if (saveData && saveData._id) {
            console.log("Registration Done Successfully !!!");
            req.flash("message", "Registration Successfull ......");
            res.redirect("/user/");
          } else {
            req.flash("message", "Email  already exists");
            console.log("Email  already exists");
            res.redirect("/user-registation");
          }
        }
      } else {
        req.flash("message", "Something went wrong");
        console.log("Something went wrong");
        res.redirect("/user-registation");
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * @Methode : Login
   * @Description : To Login The User
   */

  async userLogin(req, res) {
    try {
      let isUserExists = await user.findOne({
        email: req.body.email,
      });
      // console.log(isUserExists);

      if (isUserExists) {
        let hashPassword = isUserExists.password;
        if (bcrypt.compareSync(req.body.password, hashPassword)) {
          // token generation

          const token = jwt.sign(
            {
              _id: req.body.id,
              fullName: `${isUserExists.firstName} ${isUserExists.lastName}`,
              image: `${isUserExists.image}`,
              email: req.body.email,
            
            },
            "deep988899797",
            { expiresIn: "10m" }
          );
          res.cookie("userToken", token);
          req.flash("message", "User Login Successfull....");
          res.redirect("/user/dashboard");
        } else {
          req.flash("message", "User Login Successfull....");
          console.log("wrong password entered...");
          res.redirect("/user/");
        }
      } else {
        req.flash("message", "Not A valid user....");
        console.log("User not exists ....");
        res.redirect("/user/");
      }
    } catch (err) {
      throw err;
    }
  }




  async dashboard(req, res) {
    try {
      // let userData = req.user.email;
      // let data = await user.findOne({ email: userData });
      // console.log(data);
      let data = req.user;
      res.render("user/dashboard", {
        title: "User || Dashboard",
        message: req.flash("message"),
        response: data,
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method: Athentication
   * @descrtiotion : Cookies Data
   */

  async userAuth(req, res, next) {
    try {
      console.log(req.user);
      if (req.user) {
        next();
      } else {
        res.redirect("/user");
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * @Method template
   * @Description Basic Template
   */
  
  async template(req, res) {
    try {
      res.render("user/template", {
        title: "User || Template",
      });
    } catch (err) {
      throw err;
    }
  } 

  /**
 * @Method Render User Faq Table
 * @Description To Show User FAQ TABLE Page
 */

  async userfagTable(req, res) {
    try {
      let saveData = await UserFaq.find({ isDeleted: false });
      let data = req.user;
      res.render("user/adduserfaqtable", {
        title: "User || Table",
        message: req.flash("message"),
        response: data,
        element: saveData,
      });
    } catch (err) {
      throw err;
    }
  }

  /**
 * @Method Render User Faq Page
 * @Description To Show User FAQ Page
 */

  async showuserfaqpage(req, res) {
    try {
      let data = req.user;
      res.render("user/adduserfaq", {
        title: "User-User|| FAQ Page",
        message: req.flash("message"),
        response: data,
      });
    } catch (err) {
      throw err;
    }
  }

   /**
 * @Method Creat List
 * @Description User FAQ list
 */

  async useraddfaqlist(req, res) {
    try {
      console.log(req.file);
      console.log(req.body);
      let faqData = await UserFaq.create(req.body);
      console.log(faqData);
      if (faqData && faqData._id) {
        console.log("Faq added sucessfully....");
        req.flash("message", "Faq Data added sucessfully");
        res.redirect("/user/user-fag-table");
      } else {
        console.log("Faq  Not added sucessfully....");
        req.flash("message", "Faq Not  Data added sucessfully");
        res.redirect("/user-add-faq");
      }
    } catch (err) {
      throw err;
    }
  }
  

  /**
   * @Methode : edit
   * @Description : To edit The User Faq 
   */

  async useraddfaqedit(req, res) {
    try {
      let faqData = await UserFaq.find({ _id: req.params.id });
      console.log(faqData[0]);
      res.render("user/useraddfaqedit", {
        title: "User-FAQ|| Edit",
        response: faqData[0],
      });
    } catch (err) {
      throw err;
    }
  }

   /**
 * @Method delete
 * @Description Delete Faq Data
 * @Delete Soft delete
 */

  async useraddfaqdelete(req, res) {
    try {
      console.log(req.file);
      let deleteData = await UserFaq.findByIdAndRemove(req.params.id, {
        isDeleted: true,
      });
      console.log(deleteData);
      if (deleteData && deleteData._id) {
        console.log("Data Deleted Successsfully");
        req.flash("message", "Data Deleted Successfully...");
        res.redirect("/user/user-fag-table");
      } else {
        console.log("Data Not Deleted Successsfully");
        req.flash("message", "Data Not Deleted Successfully...");
        res.redirect("/user/user-add-faq");
      }
    } catch (err) {
      throw err;
    }
  }
   
   /**
 * @Method delete
 * @Description Delete faq Data
 * @Delete Hard delete
 */

  // async useraddfaqdelete(req, res) {
  //   try {
  //     let deleteData = await UserFaq.findByIdAndRemove(req.params.id); 
  //     if (deleteData) {
  //       console.log("Data Deleted Successsfully");
  //       req.flash("message", "Data Deleted Successfully...");
  //       res.redirect("/user/user-fag-table");
  //     } else {
  //       console.log("Data Not Deleted Successsfully");
  //       req.flash("message", "Data Not Deleted Successfully...");
  //       res.redirect("/user/user-fag-table");
  //     }
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  /**
 * @Method Render
 * @Description To Show User Blog Table
 */

  async userblogTable(req, res) {
    try {
      let BlogData = await UserFaq.find({});
      let data = req.user;
      res.render("user/adduserblogtable", {
        title: "User || Blog-Table",
        message: req.flash("message"),
        response: data,
        element: BlogData,
      });
    } catch (err) {
      throw err;
    }
  }

/**
 * @Method Render
 * @Description To Show User Blog Page
 */

async userblogpage(req,res){
  try{
    let data = req.user;
    res.render("user/adduserblog", {
      title: "User-User|| Blog Page",
      message: req.flash("message"),
      response: data,
    });
  }catch(err){
    throw err;
  }
}

/**
 * @Method Create Data
 * @Description To add Data in User Blog list
 */

async userbloglist(req, res){
  try{
    console.log(req.file);
    let BlogData = await UserBlog.create(req.body);
    // console.log(req.body);

    console.log(BlogData);
    if (BlogData && BlogData._id) {
      console.log("Blog added sucessfully....");
      req.flash("message", "Blog added sucessfully");
      res.redirect("/user/user-blog-table");
    } else {
      console.log("Blog Not added sucessfully....");
      req.flash("message", "Blog Not  Data added sucessfully");
      res.redirect("/user/user-add-blog");
    }
  }catch(err){
    throw err;
  }
}

 /**
 * @Method delete
 * @Description Delete Faq Data
 * @Delete Soft delete
 */

 async useraddblogdelete(req, res) {
  try {
    console.log(req.file);
    let deleteData = await UserBlog.findByIdAndRemove(req.params.id, {
      isDeleted: true,
    });
    console.log(deleteData);
    if (deleteData && deleteData._id) {
      console.log("Data Deleted Successsfully");
      req.flash("message", "Data Deleted Successfully...");
      res.redirect("/user/user-blog-table");
    } else {
      console.log("Data Not Deleted Successsfully");
      req.flash("message", "Data Not Deleted Successfully...");
      res.redirect("/user/user-add-blog");
    }
  } catch (err) {
    throw err;
  }
}
 
 /**
* @Method delete
* @Description Delete faq Data
* @Delete Hard delete
*/

// async useraddblogdelete(req, res) {
//   try {
//     let deleteData = await UserBlog.findByIdAndRemove(req.params.id); 
//     if (deleteData) {
//       console.log("Data Deleted Successsfully");
//       req.flash("message", "Data Deleted Successfully...");
//       res.redirect("/user/user-fag-table");
//     } else {
//       console.log("Data Not Deleted Successsfully");
//       req.flash("message", "Data Not Deleted Successfully...");
//       res.redirect("/user/user-fag-table");
//     }
//   } catch (err) {
//     throw err;
//   }
// }


 /**
 * @Method Logout
 * @Description To Clear Cookie for User Logout
 */

  async userlogout(req, res) {
    console.log(req.cookies);
    console.log("User Logout Successfull");
    // alert message
    req.flash("message", "Log out Succesfully!!!!");
    res.clearCookie("userToken");
    res.redirect("/user");
  }
}

module.exports = new UserController();










// fhgjvctgkxfghjkszxtrf