const mongoose = require('mongoose');
const student = require('../config/student');

// autoIndex/autoCreate tat: user "chi ghi" khong co quyen createIndex/createCollection.
// Index unique cho maSP duoc tao thu cong tren Atlas bang tai khoan admin.
const bookSchema = new mongoose.Schema(
  {
    maSP: {
      type: String,
      required: true,
      trim: true,
      // Lop bao ve thu 2: du ghi tu dau, ma sai tien to cung bi tu choi
      match: [student.productCodeRegex, `Ma san pham phai bat dau bang ${student.last3}`]
    },
    tenSach: { type: String, required: true, trim: true },
    tacGia: { type: String, trim: true, default: '' },
    giaGoc: { type: Number, required: true, min: 1 },
    vat: { type: Number, required: true },        // % ap dung luc luu
    giaSauThue: { type: Number, required: true }, // da tinh san o server
    createdAt: { type: Date, default: Date.now }
  },
  { collection: 'books', autoIndex: false, autoCreate: false, versionKey: false }
);

module.exports = bookSchema;
