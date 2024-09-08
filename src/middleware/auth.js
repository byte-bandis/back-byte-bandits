const jwt = require('jsonwebtoken');
const { tryCatch } = require('../utils/tryCatch');

exports.authenticate = tryCatch(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized. Token not available.'
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode.user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized. Error while verifying the token'
    });
  }
});

exports.authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      message: 'Unauthorized to access this route'
    });
  }
  next();
};
