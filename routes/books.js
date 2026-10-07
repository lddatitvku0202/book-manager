const express = require('express');
const { BookRead, BookWrite } = require('../config/db');
const student = require('../config/student');

const router = express.Router();

async function renderList(res, status, extra = {}) {
  // READ -> tai khoan reader
  const books = await BookRead.find().sort({ createdAt: -1 }).lean();
  res.status(status).render('books', { books, ...extra });
}

// Xem danh sach (READ)
router.get('/', async (req, res) => {
  try {
    await renderList(res, 200);
  } catch (err) {
    console.error(err);
    res.status(500).render('books', { books: [], error: 'Khong doc duoc du lieu tu may chu.' });
  }
});

// Them moi (WRITE)
router.post('/', async (req, res) => {
  const form = {
    maSP: String(req.body.maSP || '').trim(),
    tenSach: String(req.body.tenSach || '').trim(),
    tacGia: String(req.body.tacGia || '').trim(),
    gia: String(req.body.gia || '').trim()
  };

  try {
    // Bo loc 1: ma san pham phai bat dau bang 3 so cuoi MSSV -> sai thi tu choi, khong ghi DB
    if (!student.productCodeRegex.test(form.maSP)) {
      return await renderList(res, 400, {
        form,
        error: `Ma san pham phai bat dau bang "${student.last3}" va co them ky tu phia sau (vd ${student.last3}001). Ma "${form.maSP}" bi tu choi.`
      });
    }
    if (!form.tenSach) {
      return await renderList(res, 400, { form, error: 'Ten sach khong duoc de trong.' });
    }
    const giaGoc = Number(form.gia);
    if (!Number.isInteger(giaGoc) || giaGoc <= 0) {
      return await renderList(res, 400, { form, error: 'Gia phai la so nguyen duong (don vi dong).' });
    }

    // Bo loc 2: tinh gia sau thue o server truoc khi luu
    const vat = student.vat;
    const giaSauThue = Math.round((giaGoc * (100 + vat)) / 100);

    await BookWrite.create({
      maSP: form.maSP,
      tenSach: form.tenSach,
      tacGia: form.tacGia,
      giaGoc,
      vat,
      giaSauThue
    });

    if (req.session) req.session.flash = `Da them sach "${form.tenSach}" (gia sau thue ${giaSauThue.toLocaleString('vi-VN')} d).`;
    res.redirect('/books');
  } catch (err) {
    if (err && err.code === 11000) {
      return renderList(res, 409, { form, error: `Ma san pham "${form.maSP}" da ton tai.` }).catch(() => res.status(409).end());
    }
    if (err && err.name === 'ValidationError') {
      return renderList(res, 400, { form, error: err.message }).catch(() => res.status(400).end());
    }
    console.error(err);
    res.status(500).send('Loi may chu khi them sach.');
  }
});

module.exports = router;
