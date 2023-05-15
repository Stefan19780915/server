const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (userEmail, password, done) => {
    const user = await getUserByEmail(userEmail);

    if (user == null) {
      return done(null, false, {
        message: "No user found with provided email.",
      });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password." });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(
    new LocalStrategy(
      {
        usernameField: "userEmail",
      },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    const user = await getUserById(id);
    return done(null, user);
  });
}

module.exports = initialize;