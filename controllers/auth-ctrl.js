// importar librerias necesarias
const bcrypt = require('bcryptjs');

// import necessay files
const OrgAccount = require('../models/org');


exports.getLogin = (req, res, next) => {
  res.render('login', {
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};


exports.postLogin = (req, res, next) => {
  const orgId = req.body.orgId;
  const pass = req.body.password;


  OrgAccount.findOne({ orgId: orgId })
    .then((org) => {

      if (!org) {
        console.log('No organization with that id found');
        return res.redirect('/login');
      }

      bcrypt
        .compare(pass, org.password)
        .then((isMatch) => {

          if (isMatch) {
            req.session.isLoggedIn = true;
            req.session.org = org;
            return req.session.save((err) => {
              console.log(err);

              res.redirect('/schedule');
            });
          }

          console.log('Invalid credentials.');
          return res.redirect('/login');
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/login');
    });
};


exports.getRegister = (req, res, next) => {
  res.render('register', {
    pageTitle: 'Register',
    isAuthenticated: false,
  });
};


exports.postRegister = (req, res, next) => {

  const orgName = req.body.name;
  const orgId = req.body.orgId;
  const pass = req.body.password;
  const confirmPass = req.body.confirmPassword;


  if (pass !== confirmPass) {
    console.log('Unable to create account.');
    return res.redirect('/register');
  }


  bcrypt
    .hash(pass, 12)
    .then((result) => {

      const org = new OrgAccount({
        name: orgName,
        orgId: orgId,
        password: result,
      });
      return org.save();
    })
    .then((result) => {
      return res.redirect('/login');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
