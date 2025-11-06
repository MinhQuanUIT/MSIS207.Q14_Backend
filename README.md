# MSIS207.Q14_Backend

Backend API cho dự án MSIS207 Q14 sử dụng Node.js, Express và MongoDB.

## 🚀 Công nghệ sử dụng

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **dotenv** - Environment variables
- **cors** - Cross-Origin Resource Sharing

## 📁 Cấu trúc thư mục

```
MSIS207.Q14_Backend/
├── config/
│   └── db.js              # Cấu hình kết nối MongoDB
├── controllers/
│   └── userController.js  # Logic xử lý user
├── middlewares/
│   └── errorHandler.js    # Middleware xử lý lỗi
├── models/
│   └── User.js            # Model User
├── routes/
│   └── userRoutes.js      # Routes cho User API
├── .env                   # Biến môi trường
├── .gitignore            # Git ignore file
├── package.json          # Dependencies
└── server.js             # Entry point
```

## ⚙️ Cài đặt

1. Clone repository:
```bash
git clone https://github.com/MinhQuanUIT/MSIS207.Q14_Backend.git
cd MSIS207.Q14_Backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Cấu hình file `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/msis207_q14
NODE_ENV=development
```

4. Khởi động MongoDB (nếu chạy local)

5. Chạy server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Lấy tất cả users |
| GET | `/api/users/:id` | Lấy user theo ID |
| POST | `/api/users` | Tạo user mới |
| PUT | `/api/users/:id` | Cập nhật user |
| DELETE | `/api/users/:id` | Xóa user |

### Ví dụ request:

**Tạo user mới:**
```bash
POST /api/users
Content-Type: application/json

{
  "name": "Nguyen Van A",
  "email": "vana@example.com",
  "password": "123456",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Nguyen Van A",
    "email": "vana@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-11-05T...",
    "updatedAt": "2025-11-05T..."
  }
}
```

## 🛠️ Development

Cài đặt nodemon để auto-restart server khi có thay đổi:
```bash
npm install -D nodemon
```

## 📝 License

ISC

## 👥 Author

MinhQuanUIT
