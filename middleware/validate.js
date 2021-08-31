const jwt = require('jsonwebtoken')
// const { UserModel } = require("../models");

const validateSession = async (req, res, next) => {
  if (req.method == "OPTIONS") {
    next();
  } else if (req.headers.authorization) {
    const { authorization } = req.headers;
    const payload = authorization
      ? jwt.verify(authorization, process.env.JWT_SECRET)
      : undefined;
    if (payload) {
      let foundUser = await LoginModel.findOne({//change here
        where: {
          name: payload.name,//change here
        },
      });
      if (foundUser) {
        req.user = foundUser;
        next();
      } else {
        res.status(400).send({
          message: "Not Authorized.",
        });
      }
    } else {
      res.status(401).send({
        message: "Invalid Token",
      });
    }
  } else {
    res.status(500).send({
      message: "Forbidden",
    });
  }
};

module.exports = validateSession;