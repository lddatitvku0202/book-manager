require('dotenv').config();
const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const student = require('./config/student');

const app = express();

// Render nam sau reverse proxy -> can de cookie secure hoat dong
app.set('trust proxy', 1);

app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    helpers: {
      money: (v) => new Intl.NumberFormat('vi-VN').format(v) + ' ₫',
      date: (d) => (d ? new Date(d).toLocaleString('vi-VN') : '')
    }
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));

// Dat TRUOC session: ping giu app thuc va favicon khong tao session rac tren Atlas
app.get('/healthz', (req, res) => res.send('ok'));
app.get('/favicon.ico', (req, res) => res.status(204).end());

// [SESSION] Session luu tren MongoDB Atlas (nhanh feature/session)
app.use(require('./config/session'));

// Thong tin sinh vien dung cho footer o moi trang
app.use((req, res, next) => {
  res.locals.student = student;
  next();
});

// [DB] Route dung 2 ket noi Read/Write (nhanh feature/database)
app.get('/', (req, res) => res.redirect('/books'));
app.use('/books', require('./routes/books'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server chay tai cong ${PORT} (VAT ${student.vat}%)`));
