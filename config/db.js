const mongoose = require('mongoose');
const bookSchema = require('../models/Book');

function connect(uri, label) {
  if (!uri) throw new Error(`Thieu bien moi truong cho ket noi ${label}`);
  const conn = mongoose.createConnection(uri, { serverSelectionTimeoutMS: 10000 });
  conn.on('connected', () => console.log(`[DB] ${label} connected`));
  conn.on('error', (e) => console.error(`[DB] ${label} error:`, e.message));
  return conn;
}

// Hai ket noi doc lap, moi cai dung mot tai khoan Atlas rieng
const readConn = connect(process.env.MONGO_READ_URI, 'READ (reader_23IT048)');
const writeConn = connect(process.env.MONGO_WRITE_URI, 'WRITE (writer_23IT048)');

// Moi connection tu dang ky model rieng -> dieu huong Read/Write ro rang
const BookRead = readConn.model('Book', bookSchema);
const BookWrite = writeConn.model('Book', bookSchema);

module.exports = { readConn, writeConn, BookRead, BookWrite };
