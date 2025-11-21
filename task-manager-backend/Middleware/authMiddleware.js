import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Your token payload is: { id: user._id }
    // So decoded has .id, not .user
    req.user = { id: decoded.id };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;
