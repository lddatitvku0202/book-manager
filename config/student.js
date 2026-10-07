// Thong tin ca nhan hoa: tat ca gia tri suy ra tu MSSV, khong hardcode VAT.
const id = (process.env.STUDENT_ID || '23IT048').trim();
const fullName = (process.env.FULL_NAME || '').trim();

const last3 = id.slice(-3);                   // "048" -> tien to bat buoc cua ma san pham
const lastDigit = parseInt(id.slice(-1), 10); // 8
const vat = lastDigit + 4;                    // VAT = (chu so cuoi + 4)% = 12

// Chan cau hinh sai: thieu ten hoac MSSV khong ket thuc bang 3 chu so
if (!/^\d{3}$/.test(last3) || Number.isNaN(lastDigit)) {
  throw new Error(`STUDENT_ID "${id}" khong hop le: 3 ky tu cuoi phai la chu so`);
}
if (!fullName) {
  throw new Error('Thieu FULL_NAME (ho ten hien o footer)');
}

// Ma SP hop le: tien to 048 + it nhat 1 ky tu chu/so/-/_
const productCodeRegex = new RegExp(`^${last3}[A-Za-z0-9_-]+$`);

module.exports = { id, fullName, last3, lastDigit, vat, productCodeRegex };
