const jwt = require("jsonwebtoken");

class AdminAuthentication {
  async adminAuth(req, res, next) {
    if (req.cookies && req.cookies.adminToken) {
      jwt.verify(req.cookies.adminToken, "DEEP984563434", (err, data) => {
        req.admin = data;
        // console.log("OK", req.admin);
        next();
      });
    } else {
      // console.log("Something went wrong");
      next();
    }
  }
}
module.exports = new AdminAuthentication();

