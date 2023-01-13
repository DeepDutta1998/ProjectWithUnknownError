const router = require("express").Router();
const adminController = require("../controllers/admin.controller");

// image upload using multer

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/admin");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        "_" +
        Date.now() +
        "my_img" +
        path.extname(file.originalname)
    );
  },
});

const maxsize = 1 * 1024 * 1024;
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/gif" ||
      file.mimetype == "image/tiff" ||
      file.mimetype == "image/bmp" ||
      file.mimetype == "image/svg" ||
      file.mimetype == "image/heic" ||
      file.mimetype == "image/raw" ||
      file.mimetype == "image/webp" ||
      file.mimetype == "image/gif" ||
      file.mimetype == "image/ico" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only accept jpg or png or jpeg"));
    }
  },
  limits: maxsize,
});

router.get("/", adminController.showIndex);
router.get("/admin-registration", adminController.registration);
router.post( "/admin-register",upload.single("image"),adminController.adminRegister);
router.post("/admin-login", adminController.adminLogin);
router.get("/admin-logout", adminController.adminlogout);
router.get("/admin-table",adminController.admintable)
router.get("/mailSending", adminController.mailSending);
router.get("/admin-add-user-page",adminController.showadduserregistration)
router.post("/admin-add-user-registration",upload.single("image"),adminController.adduserregistration)
router.get("/admin-add-user-edit/:id",adminController.adminadduseredit)
router.get("/admin-add-user-delete/:id",adminController.adminadduserdelete)
router.post("/admin-add-user-update",upload.single("image"),adminController.adminadduserupdate)
router.get("/dashboard",  adminController.dashboard);

// FAQ ROUTER 
router.get("/admin-fag-table",adminController.adminfagTable)
router.get("/admin-add-faq",adminController.showadminfaqpage)
router.post("/admin-add-faq-post",adminController.adminaddfaqlist)
router.get("/admin-add-faq-edit/:id",adminController.adminaddfaqedit)
// router.post("/admin-add-faq-update",adminController.adminfaqupdate)
router.get("/admin-add-faq-delete/:id",adminController.adminaddfaqdelete)

// BLOG ROUTER
router.get("/admin-blog-table",adminController.adminblogTable)
router.get("/admin-add-blog",adminController.adminblogpage)
router.post("/admin-add-blog-post",upload.single("images"),adminController.adminbloglist)
// router.get("/admin-add-blog-edit/:id",adminController.adminaddblogedit)
// router.post("/admin-add-blog-update",adminController.adminblogupdate)
// router.get("/admin-add-blog-delete/:id",adminController.adminaddblogdelete)


module.exports = router;
