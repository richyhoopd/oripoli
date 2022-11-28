// import useful libraries and frameworks
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
require('dotenv').config();

// import necessary files
const authRoutes = require('./routes/auth-routes');
const schRoutes = require('./routes/schedule-routes');
const OrgAccount = require('./models/org');
const isAuth = require('./middleware/is-auth');

// set up the server
const MONGODB_URL = process.env.MONGODB_URL || process.env.DB_CONNECTION;

const PORT = process.env.PORT || 5050;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
};

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: 'sessions',
});

const csrfProtection = csrf({});

// configuracion de las vistas y el motor de renderizado
app.set('view engine', 'ejs');
app.set('views', 'views');

// configuracion de body parser
app.use(bodyParser.urlencoded({ extended: false }));

// configurar archivo estatico publico
app.use(express.static(path.join(__dirname, 'public')));

// configurar la sesion
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// habilitar proteccion csrf
app.use(csrfProtection);

// las varirbales del servidor
app.use((req, res, next) => {
  res.locals.isAuth = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.org) {
    return next();
  }
  OrgAccount.findById(req.session.org._id)
    .then((org) => {
      // aqui nos aseguramos que haya un usuario
      if (!org) {
        return next();
      }
      req.org = org;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

// configurar rrutas
app.use('/schedule', isAuth, schRoutes);
app.use(authRoutes);

app.get('/', (req, res, next) => {
  res.render('home', {
    pageTitle: 'Inicio',
    msg: 'Bienvenido al sitio de orientación educativa',
    isAuthenticated: req.session.isLoggedIn,
  });
});


// empezar el servidor y escuchar peticiones
mongoose
  .connect(MONGODB_URL, options)
  .then((result) => {
    console.log(`Listening on ${PORT}`);
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
