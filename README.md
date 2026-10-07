# Quản lý sách - Giữa kỳ Điện toán đám mây (MSSV 23IT048)

- Mã sản phẩm phải bắt đầu bằng `048` và có thêm ký tự phía sau (vd `048001`)
- VAT = (8 + 4)% = **12%**, tính ở server trước khi lưu
- DB `DB_23IT048`, user đọc `reader_23IT048`, user ghi `writer_23IT048`

## 1. Setup MongoDB Atlas (bằng tài khoản admin)
1. Tạo database `DB_23IT048`, tạo sẵn 2 collection: `books`, `sessions`.
2. `books` → Indexes → tạo index `{ maSP: 1 }` với Unique.
3. Database Access → Custom Roles:
   - `reader_role_23IT048`: `find` trên `DB_23IT048.books`
   - `writer_role_23IT048`: `insert` trên `DB_23IT048.books`; `find, insert, update, remove` trên `DB_23IT048.sessions`
4. Tạo user `reader_23IT048` (gán reader role) và `writer_23IT048` (gán writer role).
5. Network Access → thêm `0.0.0.0/0`.
6. Lấy 2 connection string (Connect → Drivers), thêm `/DB_23IT048` sau `.mongodb.net`.

## 2. Chạy local
```
npm install
cp .env.example .env   # điền giá trị thật
npm start
```

## 3. Git (2 nhánh, merge --no-ff)
```
git init -b main
git add .gitignore .env.example package.json package-lock.json README.md
git commit -m "chore: khoi tao project"

git checkout -b feature/database
# app.js: tạm xóa 2 dòng dưới comment [SESSION]
git add config/student.js config/db.js models routes views app.js
git commit -m "feat(db): 2 ket noi read/write, loc ma 048, VAT 12%"
git checkout main
git merge --no-ff feature/database -m "Merge branch 'feature/database'"

git checkout -b feature/session
# app.js: thêm lại dòng app.use(require('./config/session'))
git add config/session.js app.js
git commit -m "feat(session): luu session len MongoDB Atlas"
git checkout main
git merge --no-ff feature/session -m "Merge branch 'feature/session'"

git log --graph --oneline --all
```

## 4. Render
Build `npm install`, Start `npm start`. Environment:
`NODE_ENV=production`, `STUDENT_ID=23IT048`, `FULL_NAME`, `MONGO_READ_URI`, `MONGO_WRITE_URI`, `SESSION_SECRET`.
Giữ app thức: UptimeRobot ping `https://<app>.onrender.com/healthz` mỗi 5 phút.
