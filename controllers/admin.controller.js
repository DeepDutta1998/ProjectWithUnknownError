const admin = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const AdminUser = require("../models/addadminuser.model");
const AdminFaq = require("../models/addadminfaq.model");
const AdminBlog = require("../models/adminblog.model");


class AdminController {
  constructor() {}

  /**
   * @Method showIndex
   * @Description To Show The Index Page / Login Page
   */

  async showIndex(req, res) {
    try {
      res.render("admin/index", {
        title: "Admin || Login",
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
      res.render("admin/adminRegistration", {
        title: "Admin||Registation",
        message: req.flash("message"),
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @Method AdminRegistration
   * @Description To Show The Register Admin
   */

  async adminRegister(req, res) {
    try {
      if (req.body.password === req.body.confirmpassword) {
        req.body.password = bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10)
        );
        let isEmailExits = await admin.findOne({ email: req.body.email });
        if (!isEmailExits) {
          req.body.image = req.file.filename;
          let saveData = await admin.create(req.body);
          console.log(req.body);
          if (saveData && saveData._id) {
            console.log("Registration Done Successfully !!!");
            req.flash("message", "Registration Successfull ......");
            res.redirect("/admin/");
          } else {
            req.flash("message", "Email  already exists");
            console.log("Email  already exists");
            res.redirect("/admin-registation");
          }
        }
      } else {
        req.flash("message", "Something went wrong");
        console.log("Something went wrong");
        res.redirect("/admin-registation");
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * @Methode : Login
   * @Description : To Login The Admin
   */

  async adminLogin(req, res) {
    try {
      let isUserExists = await admin.findOne({
        email: req.body.email,
      });
      console.log(isUserExists);

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
            "DEBAYAN123",
            { expiresIn: "10m" }
          );
          res.cookie("adminToken", token);
          req.flash("message", "Admin Login Successfull....");
          res.redirect("/admin/dashboard");
        } else {
          req.flash("message", "Admin Login Successfull....");
          console.log("wrong password entered...");
          res.redirect("/admin/");
        }
      } else {
        req.flash("message", "Not A valid admin....");
        console.log("Admin not exists ....");
        res.redirect("/admin/");
      }
    } catch (err) {
      throw err;
    }
  }


    /**
   * @Methode : Forget Password
   * @Description : To Show The Forget Password Page
   */

    async forgetpassword(req, res) {
      try {
        res.render("admin/addforgetpassword", {
          title: "Admin || Template",
        });
      } catch (err) {
        throw err;
      }
    }


  /**
   * @Methode :  nodemail 
   * @Description : To send mail to the forgot password
   */

  async mailSending(req, res) {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'nilldeepinslg@gmail.com',
        pass: 'tlxcfjrxaytyvkci',
      },
    })

    let mailOptions = {
      from: 'no-reply@deepin.in',
      to: 'deepinslg@gmail.com',
      subject: 'Forget Your Password!',
      text: 'Forget Your Password ',
    }
    transporter.sendMail(mailOptions, (err) => {
      if (!err) {
        res.status(200).send({
          message: 'Mail Sent Successfully!',
        })
      } else {
        console.log(err)
        res.status(400).send({
          message: 'Mail Not Sent Successfully!',
        })
      }
    })
  }


   
  /**
   * @Method dashboard
   * @Description To Show The Dashboard
   */

  async dashboard(req, res) {
    try {
      // let adminData = req.admin.email;
      // let data = await admin.findOne({ email: adminData });
      // console.log(data);
      let data = req.admin;
      res.render("admin/dashboard", {
        title: "Admin || Dashboard",
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

  async adminAuth(req, res, next) {
    try {
      if (req.admin) {
        next();
      } else {
        res.redirect("/");
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
      res.render("admin/template", {
        title: "Admin || Template",
      });
    } catch (err) {
      throw err;
    }
  } 

  /**
   * @Methode : Render
   * @Description : To Show The Admin Table
   */

  async admintable(req, res) {
    try {
      // let userData = req.admin;
      // let data = await admin.findOne({ email: userData });

      let saveData = await AdminUser.find({});
      let data = req.admin;
      res.render("admin/admintable", {
        title: "Admin || Table",
        message: req.flash("message"),
        response: data,
        element: saveData,
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @Methode : Render
   * @Description : To Show The Admin Registration Page
   */

  async showadduserregistration(req, res) {
    try {
      // let userData = req.AdminUser;
      // let data = await AdminUser.findOne({ email: userData });
      let data = req.admin;
      res.render("admin/addadminuser", {
        title: "Admin || Table",
        message: req.flash("message"),
        response: data,
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @Methode : Add Data
   * @Description : To Add The Admin User Data
   */

  async adduserregistration(req, res) {
    try {
      console.log(req.file);
      if (req.body.password === req.body.confirmpassword) {
        req.body.password = bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10)
        );
        let isEmailExits = await AdminUser.findOne({ email: req.body.email });
        if (!isEmailExits) {
          req.body.image = req.file.filename;
          let saveData = await AdminUser.create(req.body);
          console.log(req.body);
          if (saveData && saveData._id) {
            console.log("Registration Done Successfully !!!");
            req.flash("message", "Registration Successfull ......");
            res.redirect("/admin/admin-table");
          } else {
            req.flash("message", "Email  already exists");
            console.log("Email  already exists");
            res.redirect("/admin-add-user-page");
          }
        }
      } else {
        req.flash("message", "Something went wrong");
        console.log("Something went wrong");
        res.redirect("/admin-add-user-page");
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * @Methode : Edit
   * @Description : To Edit The Admin User
   */

  async adminadduseredit(req, res) {
    try {
      let userData = await AdminUser.find({ _id: req.params.id });
      console.log(userData[0]);
      res.render("admin/addadminuseredit", {
        title: "Admin-User|| Edit",
        response: userData[0],
      });
    } catch (err) {
      throw err;
    }
  }

  /**
 * @Method delete
 * @Description Delete Admin User Data
 * @Delete Soft delete
 */

  async adminadduserdelete(req, res) {
    try {
      let deleteData = await AdminUser.findByIdAndRemove(req.params.id, {
        isDeleted: true,
      });
      console.log(deleteData);
      if (deleteData && deleteData._id) {
        console.log("Data Deleted Successsfully");
        req.flash("message", "Data Deleted Successfully...");
        res.redirect("/admin/admin-table");
      } else {
        console.log("Data Not Deleted Successsfully");
        req.flash("message", "Data Not Deleted Successfully...");
        res.redirect("/admin/admin-table");
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * @Methode : Update
   * @Description : To Update The Admin User
   */

  async adminadduserupdate(req, res) {
    try {
      console.log(req.file);
      let Data = await AdminUser.findOne({ _id: req.body.id });
      console.log(Data);
      req.body.firstName = req.body.firstName.trim();
      req.body.lastName = req.body.lastName.trim();
      if (req.body.firstName && req.body.lastName) {
        // if (req.body.password === req.body.confirmpassword) {
        //   req.body.password = bcrypt.hashSync(
        //     req.body.password,
        //     bcrypt.genSaltSync(10)
        //   );
        let isEmailExits = await AdminUser.findOne({
          email: req.body.email,
          isDelete: false,
          _id: { $ne: req.body.id },
        });
        //email verification
        if (!isEmailExits) {
          // if (req.file) {
          //   req.body.image = req.file.filename;
          // }
          let saveData = await AdminUser.findByIdAndUpdate(
            req.body.id,
            req.body
          );
          // if (req.file) {
          //   fs.unlinkSync(`./public/uploads/admin/${Data.image}`);
          // }
          if (saveData && saveData._id) {
            req.flash("message", "Data Updated successfully......");
            console.log("Data Updated");
            res.redirect("/admin/admin-table");
          } else {
            req.flash("message", "Data not updated...");
            console.log("Data Not updated");
            res.redirect("/admin/admin-table");
          }
        } else {
          console.log(" Email exists ");
          req.flash("message", "Email  already exists");
          res.redirect("/admin/admin-table");
        }
        // } else {
        //   console.log("Password not match");
        //   req.flash("message", "Password is not matching");
        //   res.redirect("/admin/admin-table");
        // }
      } else {
        console.log("field never be empty");
        req.flash("message", "Donot keep the field empty ");
        res.redirect("/admin/admin-table");
      }
    } catch (err) {
      throw err;
    }
  }

  /**
 * @Method Render Admin Faq Table
 * @Description To Show Admin FAQ TABLE Page
 */

  async adminfagTable(req, res) {
    try {
      let saveData = await AdminFaq.find({ isDeleted: false });
      let data = req.admin;
      res.render("admin/addadminfaqtable", {
        title: "Admin || Table",
        message: req.flash("message"),
        response: data,
        element: saveData,
      });
    } catch (err) {
      throw err;
    }
  }

  /**
 * @Method Render Admin Faq Page
 * @Description To Show Admin FAQ Page
 */

  async showadminfaqpage(req, res) {
    try {
      let data = req.admin;
      res.render("admin/addadminfaq", {
        title: "Admin-User|| FAQ Page",
        message: req.flash("message"),
        response: data,
      });
    } catch (err) {
      throw err;
    }
  }

   /**
 * @Method Creat List
 * @Description Admin FAQ list
 */

  async adminaddfaqlist(req, res) {
    try {
      console.log(req.file);
      console.log(req.body);
      let faqData = await AdminFaq.create(req.body);
      console.log(faqData);
      if (faqData && faqData._id) {
        console.log("Faq added sucessfully....");
        req.flash("message", "Faq Data added sucessfully");
        res.redirect("/admin/admin-fag-table");
      } else {
        console.log("Faq  Not added sucessfully....");
        req.flash("message", "Faq Not  Data added sucessfully");
        res.redirect("/admin-add-faq");
      }
    } catch (err) {
      throw err;
    }
  }
  

  /**
   * @Methode : edit
   * @Description : To edit The Admin Faq 
   */

  async adminaddfaqedit(req, res) {
    try {
      let faqData = await AdminFaq.find({ _id: req.params.id });
      console.log(faqData[0]);
      res.render("admin/adminaddfaqedit", {
        title: "Admin-FAQ|| Edit",
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

  async adminaddfaqdelete(req, res) {
    try {
      console.log(req.file);
      let deleteData = await AdminFaq.findByIdAndRemove(req.params.id, {
        isDeleted: true,
      });
      console.log(deleteData);
      if (deleteData && deleteData._id) {
        console.log("Data Deleted Successsfully");
        req.flash("message", "Data Deleted Successfully...");
        res.redirect("/admin/admin-fag-table");
      } else {
        console.log("Data Not Deleted Successsfully");
        req.flash("message", "Data Not Deleted Successfully...");
        res.redirect("/admin/admin-add-faq");
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

  // async adminaddfaqdelete(req, res) {
  //   try {
  //     let deleteData = await AdminFaq.findByIdAndRemove(req.params.id); 
  //     if (deleteData) {
  //       console.log("Data Deleted Successsfully");
  //       req.flash("message", "Data Deleted Successfully...");
  //       res.redirect("/admin/admin-fag-table");
  //     } else {
  //       console.log("Data Not Deleted Successsfully");
  //       req.flash("message", "Data Not Deleted Successfully...");
  //       res.redirect("/admin/admin-fag-table");
  //     }
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  /**
 * @Method Render
 * @Description To Show Admin Blog Table
 */

  async adminblogTable(req, res) {
    try {
      let BlogData = await AdminFaq.find({});
      let data = req.admin;
      res.render("admin/addadminblogtable", {
        title: "Admin || Blog-Table",
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
 * @Description To Show Admin Blog Page
 */

async adminblogpage(req,res){
  try{
    let data = req.admin;
    res.render("admin/addadminblog", {
      title: "Admin-User|| Blog Page",
      message: req.flash("message"),
      response: data,
    });
  }catch(err){
    throw err;
  }
}

/**
 * @Method Create Data
 * @Description To add Data in Admin Blog list
 */

async adminbloglist(req, res){
  try{
    console.log(req.file);
    let BlogData = await AdminBlog.create(req.body);
    // console.log(req.body);

    console.log(BlogData);
    if (BlogData && BlogData._id) {
      console.log("Blog added sucessfully....");
      req.flash("message", "Blog added sucessfully");
      res.redirect("/admin/admin-blog-table");
    } else {
      console.log("Blog Not added sucessfully....");
      req.flash("message", "Blog Not  Data added sucessfully");
      res.redirect("/admin/admin-add-blog");
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

 async adminaddblogdelete(req, res) {
  try {
    console.log(req.file);
    let deleteData = await AdminBlog.findByIdAndRemove(req.params.id, {
      isDeleted: true,
    });
    console.log(deleteData);
    if (deleteData && deleteData._id) {
      console.log("Data Deleted Successsfully");
      req.flash("message", "Data Deleted Successfully...");
      res.redirect("/admin/admin-blog-table");
    } else {
      console.log("Data Not Deleted Successsfully");
      req.flash("message", "Data Not Deleted Successfully...");
      res.redirect("/admin/admin-add-blog");
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

// async adminaddblogdelete(req, res) {
//   try {
//     let deleteData = await AdminBlog.findByIdAndRemove(req.params.id); 
//     if (deleteData) {
//       console.log("Data Deleted Successsfully");
//       req.flash("message", "Data Deleted Successfully...");
//       res.redirect("/admin/admin-fag-table");
//     } else {
//       console.log("Data Not Deleted Successsfully");
//       req.flash("message", "Data Not Deleted Successfully...");
//       res.redirect("/admin/admin-fag-table");
//     }
//   } catch (err) {
//     throw err;
//   }
// }


 /**
 * @Method Logout
 * @Description To Clear Cookie for Admin Logout
 */

  async adminlogout(req, res) {
    console.log(req.cookies);
    console.log("Admin Logout Successfull");
    // alert message
    req.flash("message", "Log out Succesfully!!!!");
    res.clearCookie("adminToken");
    res.redirect("/admin");
  }
}

module.exports = new AdminController();
