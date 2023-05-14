function checkAuthUser(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/");
}

function checkNotAuthUser(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/employee");
  }
  next();
}

module.exports = { checkAuthUser, checkNotAuthUser };
