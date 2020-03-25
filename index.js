const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const usersRouter = require('./users/users-router.js');
const authRouter = require('./auth/auth-router');
const restricted = require('./auth/restricted-middleware.js');

function checkRole(role) {
  return (req, res, next) => {
    if (
      req.decodedToken &&
      req.decodedToken.role &&
      req.decodedToken.role.toLowerCase() === role
    ) {
      next();
    } else {
      res.status(403).json({ message: "Excuse me, but . . . umm . . . you're not allowed to be here" });
    }
  };
}

const server = express();
      server.use(express.json());
      server.use(helmet());
      server.use('/api/users', restricted, checkRole('user'), usersRouter);
      server.use("/api/auth", authRouter);

server.get('/', (req, res) => {
  res.send(`
    <h2>Welcome to the server!</h2>
  `)
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n ** SERVER LISTENING ON PORT: ${PORT} **`);
});
