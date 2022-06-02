const users = require("../models/users");
function authRoleLogin(role) {
  return async (req, res, next) => {
    const locateuser = await users.findOne({
      where: { email: req.body.email, password: req.body.password, role: role },
    });
    if (locateuser) {
      const getuser = locateuser.toJSON();
      console.log(getuser);
      console.log("verify");
      next();
    } else {
      res.send("User doesnt exist or the link is wrong");
    }
  };
}
function authBasic() {
  return async (req, res, next) => {
    const locateuser = await users.findOne({ where: { id: req.params.id } });
    if (locateuser) {
      const getuser = locateuser.toJSON();
      if (getuser.role === "basic") {
        next();
      } else {
        res.send("Admin not allowed");
      }
    } else {
      res.send("User doesnt exist");
    }
  };
}
function authAdminAccess() {
  return async (req, res, next) => {
    const locateuser = await users.findOne({ where: { id: req.params.id } });
    if (locateuser) {
      const getuser = locateuser.toJSON();
      if (getuser.role === "admin") {
        next();
      } else {
        res.send("User not allowed");
      }
    } else {
      res.send("Admin doesnt exist");
    }
  };
}
module.exports = { authRoleLogin, authBasic, authAdminAccess };
