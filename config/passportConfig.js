const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (userEmail, password, done) => {
    let user = await getUserByEmail(userEmail);

    if (user == null) {
      return done(null, false, {
        message: "No user found with provided email.",
      });
    }

    try {
      if (!user.active) {
        return done(null, false, {
          message:
            "Your account is not active. Please contact the administrator.",
        });
      }
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

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await getUserById(id);
      return done(null, user);
    
  });
}

module.exports = initialize;
