const jwt = require("jsonwebtoken");

class UserAuthentication {
  async userAuth(req, res, next) {
    if (req.cookies && req.cookies.Token) {
      jwt.verify(req.cookies.userToken, "deep988899797", (err, data) => {
        req.user = data;
        next();
      });
    } else {
      next();
    }
  }
}
module.exports = new UserAuthentication();
