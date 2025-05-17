const jwt = require('jsonwebtoken');


const User = require("../models/User");

async function checkAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(400).json({
        status: false,
        message: MessageContant.token_not_exists,
        data: []
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        let message = 'Invalid token';

        if (err.name === 'TokenExpiredError') {
          message = 'Token has expired';
        } else if (err.name === 'JsonWebTokenError') {
          message = 'Invalid token format';
        } else if (err.name === 'NotBeforeError') {
          message = 'Token not active yet';
        }

        return res.status(401).json({
          status: false,
          message,
          data: []
        });
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          status: false,
          message: 'User not found.',
          data: []
        });
      }

     
      req.token = token;
      req.apiAuth = decoded;
      req.user = user;

      next();
    });

  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
      data: []
    });
  }
}

module.exports = {
  checkAuth
};
