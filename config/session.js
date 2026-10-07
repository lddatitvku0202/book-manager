const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { writeConn } = require('./db');

const router = express.Router();
const isProd = process.env.NODE_ENV === 'production';

if (!process.env.SESSION_SECRET) throw new Error('Thieu SESSION_SECRET');

// Stateless: session luu tap trung tren Atlas (collection "sessions"), KHONG dung MemoryStore.
// Dung lai ket noi WRITE (writer_23IT048) -> toan he thong chi co dung 2 ket noi.
router.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      clientPromise: writeConn.asPromise().then((conn) => conn.getClient()),
      collectionName: 'sessions',
      ttl: 14 * 24 * 60 * 60,
      autoRemove: 'interval', // khong can quyen createIndex
      autoRemoveInterval: 10
    }),
    cookie: {
      httpOnly: true,
      secure: isProd,   // can app.set('trust proxy', 1) khi chay sau proxy cua Render
      sameSite: 'lax',
      maxAge: 14 * 24 * 60 * 60 * 1000
    }
  })
);

// Dung session de chung minh: dem luot truy cap + flash message
router.use((req, res, next) => {
  req.session.views = (req.session.views || 0) + 1;
  res.locals.visits = req.session.views;
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

module.exports = router;
