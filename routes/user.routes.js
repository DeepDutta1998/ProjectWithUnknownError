const router = require("express").Router();
const userController = require("../controllers/user.controller");

// image upload using multer

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
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

router.get("/", userController.showIndex);
router.get("/user-registration", userController.registration);
router.post( "/user-register",upload.single("image"),userController.userRegister);
router.post("/user-login", userController.userLogin);
router.get("/dashboard", userController.userAuth, userController.dashboard);

// FAQ ROUTER 
router.get("/user-fag-table",userController.userfagTable)
router.get("/user-add-faq",userController.showuserfaqpage)
router.post("/user-add-faq-post",userController.useraddfaqlist)
router.get("/user-add-faq-edit/:id",userController.useraddfaqedit)
// router.post("/user-add-faq-update",userController.userfaqupdate)
router.get("/user-add-faq-delete/:id",userController.useraddfaqdelete)



module.exports = router;
