


function checkAuthUser(req, res, next) {

  if (req.isAuthenticated()) {

    return next();
  } else {
  res.redirect("/");
  }
  
}




function checkNotAuthUser(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/employee");
  }
  next();
}

function checkAdmin(req, res, next) {
  if (
    req.user.roles == "Admin" ||
    req.user.roles == "Manager" ||
    req.user.roles == "Owner" ||
    req.user.roles == "Super"
  ) {
    next();
  } else {
    req.flash("message", "You are not authorised.");
    return res.redirect("/employee");
  }
}

module.exports = { checkAuthUser, checkNotAuthUser, checkAdmin };
