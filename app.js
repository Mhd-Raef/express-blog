const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// connect to mongodb
const dbURI = "mongodb+srv://0xraef:test123@nodetut.lkjhz.mongodb.net/note-tuts?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.set('views', 'views');



// middlewares & static files
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: "0xraefsecretkey", resave: false, saveUninitialized: false }));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));


// app.use((req, res, next) => {
//   res.locals.path = req.path;
//   next();
// });


// routes
app.get('*', checkUser);

app.get('/', function (req, res) {
  res.redirect('/about');
})

app.get('/about', function (req, res) {
  res.render('about', { title: 'About' });
})

// blog routes
app.use('/blogs', requireAuth, blogRoutes);

// auth routes
app.use(authRoutes);



app.use(function (req, res) {
  res.status(404).render('404', { title: '404' })
})

