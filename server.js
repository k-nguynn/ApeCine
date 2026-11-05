const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

const allowedOrigins = ['https://apecine.onrender.com', 'http://localhost:3000'];
app.use(cors({
    origin: function (origin, callback) {
        // Cho phép các request không có origin (như Postman hoặc mobile apps) hoặc nằm trong danh sách cho phép
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning']
}));

app.use(express.json());

// Cấu hình kết nối SQL Server của bạn
const dbConfig = {
  user: 'sa',                  // Tài khoản SQL Server
  password: '123',             // Mật khẩu SQL Server của bạn
  server: 'localhost',         // Tên server / localhost
  database: 'ApeCineDB',       // Tên Cơ sở dữ liệu
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// --- HÀM TẠO BẢNG TỰ ĐỘNG (ĐÃ TÁCH RIÊNG KHỎI LOGIC CHÍNH) ---
async function initDatabase() {
  try {
    let pool = await sql.connect(dbConfig);
    console.log('Đang kiểm tra và khởi tạo cấu trúc các bảng CSDL...');

    // 1. Bảng Users
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
      CREATE TABLE Users (
        UserId INT IDENTITY(1,1) PRIMARY KEY,
        FullName NVARCHAR(100) NOT NULL,
        EmailOrPhone VARCHAR(100) UNIQUE NOT NULL,
        Password VARCHAR(255) NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE()
      )
    `);

    // 2. Bảng Movies
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Movies' AND xtype='U')
      CREATE TABLE Movies (
        MovieId VARCHAR(50) PRIMARY KEY,
        Title NVARCHAR(200) NOT NULL,
        Genre NVARCHAR(100),
        Duration INT,
        Rating DECIMAL(3,1),
        AgeRating VARCHAR(10),
        Language NVARCHAR(50),
        Director NVARCHAR(100),
        [Cast] NVARCHAR(MAX),
        ReleaseDate DATE,
        Description NVARCHAR(MAX),
        PosterUrl VARCHAR(MAX),
        TrailerUrl VARCHAR(MAX)
      )
    `);

    // 3. Bảng Cinemas
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Cinemas' AND xtype='U')
      CREATE TABLE Cinemas (
        CinemaId INT IDENTITY(1,1) PRIMARY KEY,
        CinemaName NVARCHAR(150) NOT NULL,
        City NVARCHAR(100) NOT NULL,
        Address NVARCHAR(255)
      )
    `);

    // 4. Bảng Auditoriums
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Auditoriums' AND xtype='U')
      CREATE TABLE Auditoriums (
        AuditoriumId INT IDENTITY(1,1) PRIMARY KEY,
        CinemaId INT FOREIGN KEY REFERENCES Cinemas(CinemaId),
        AuditoriumName NVARCHAR(50) NOT NULL,
        TotalRows INT DEFAULT 6,
        SeatsPerRow INT DEFAULT 10
      )
    `);

    // 5. Bảng Showtimes
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Showtimes' AND xtype='U')
      CREATE TABLE Showtimes (
        ShowtimeId INT IDENTITY(1,1) PRIMARY KEY,
        MovieId VARCHAR(50) FOREIGN KEY REFERENCES Movies(MovieId),
        AuditoriumId INT FOREIGN KEY REFERENCES Auditoriums(AuditoriumId),
        ShowDate DATE NOT NULL,
        StartTime VARCHAR(10) NOT NULL,
        FormatType VARCHAR(50) DEFAULT 'Standard 2D'
      )
    `);

    // 6. Bảng Bookings
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Bookings' AND xtype='U')
      CREATE TABLE Bookings (
        BookingId INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT FOREIGN KEY REFERENCES Users(UserId),
        ShowtimeId INT FOREIGN KEY REFERENCES Showtimes(ShowtimeId),
        TotalAmount DECIMAL(18,2) NOT NULL,
        PaymentMethod VARCHAR(50) DEFAULT 'MoMo',
        CreatedAt DATETIME DEFAULT GETDATE()
      )
    `);

    // 7. Bảng BookingSeats
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='BookingSeats' AND xtype='U')
      CREATE TABLE BookingSeats (
        BookingSeatId INT IDENTITY(1,1) PRIMARY KEY,
        BookingId INT FOREIGN KEY REFERENCES Bookings(BookingId),
        ShowtimeId INT FOREIGN KEY REFERENCES Showtimes(ShowtimeId),
        SeatCode VARCHAR(10) NOT NULL,
        Price DECIMAL(18,2) NOT NULL
      )
    `);

    console.log('Khởi tạo cấu trúc bảng CSDL thành công!');
  } catch (err) {
    console.error('Lỗi khi khởi tạo bảng CSDL:', err);
  }
}

// ==========================================
// CÁC API ENDPOINTS CHÍNH
// ==========================================

// --- API 1: Lấy danh sách toàn bộ phim (Homepage) ---
app.get('/api/movies', async (req, res) => {
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request().query('SELECT * FROM Movies');
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi truy vấn danh sách phim:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách phim' });
  }
});

// --- API 2: Lấy chi tiết 1 bộ phim theo MovieId (Moviedetail) ---
app.get('/api/movies/:id', async (req, res) => {
  const movieId = req.params.id;
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request()
      .input('movieId', sql.VarChar, movieId)
      .query('SELECT * FROM Movies WHERE MovieId = @movieId');

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ message: 'Không tìm thấy phim với ID này!' });
    }
  } catch (err) {
    console.error('Lỗi lấy chi tiết phim:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin chi tiết phim' });
  }
});

// --- API 3: Đăng ký tài khoản ---
app.post('/api/register', async (req, res) => {
  const { fullName, emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ email/số điện thoại và mật khẩu!' });
  }

  try {
    let pool = await sql.connect(dbConfig);

    let checkUser = await pool.request()
      .input('emailOrPhone', sql.VarChar, emailOrPhone)
      .query('SELECT * FROM Users WHERE EmailOrPhone = @emailOrPhone');

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ message: 'Email hoặc số điện thoại này đã được đăng ký!' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let insertResult = await pool.request()
      .input('fullName', sql.NVarChar, fullName || 'Thành viên ApeCine')
      .input('emailOrPhone', sql.VarChar, emailOrPhone)
      .input('password', sql.VarChar, hashedPassword)
      .query(`
        INSERT INTO Users (FullName, EmailOrPhone, Password) 
        OUTPUT INSERTED.UserId, INSERTED.FullName, INSERTED.EmailOrPhone 
        VALUES (@fullName, @emailOrPhone, @password)
      `);

    res.status(201).json({
      message: 'Đăng ký tài khoản thành công!',
      user: insertResult.recordset[0]
    });

  } catch (err) {
    console.error('Lỗi đăng ký:', err);
    res.status(500).json({ message: 'Lỗi server khi đăng ký tài khoản' });
  }
});

// --- API 4: Đăng nhập ---
app.post('/api/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập tài khoản và mật khẩu!' });
  }

  try {
    let pool = await sql.connect(dbConfig);

    let result = await pool.request()
      .input('emailOrPhone', sql.VarChar, emailOrPhone)
      .query('SELECT * FROM Users WHERE EmailOrPhone = @emailOrPhone');

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      const isMatch = await bcrypt.compare(password, user.Password);

      if (isMatch) {
        res.json({
          message: 'Đăng nhập thành công!',
          user: { UserId: user.UserId, FullName: user.FullName, EmailOrPhone: user.EmailOrPhone }
        });
      } else {
        res.status(401).json({ message: 'Mật khẩu không chính xác!' });
      }
    } else {
      res.status(401).json({ message: 'Tài khoản không tồn tại trong hệ thống!' });
    }

  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
});

// --- API 5: Cập nhật thông tin cá nhân (Profile) ---
app.post('/api/update-profile', async (req, res) => {
  const { userId, fullName, emailOrPhone, newPassword } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'Thiếu thông tin người dùng!' });
  }

  try {
    let pool = await sql.connect(dbConfig);

    if (newPassword && newPassword.trim() !== '') {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await pool.request()
        .input('userId', sql.Int, userId)
        .input('fullName', sql.NVarChar, fullName)
        .input('emailOrPhone', sql.VarChar, emailOrPhone)
        .input('password', sql.VarChar, hashedPassword)
        .query('UPDATE Users SET FullName = @fullName, EmailOrPhone = @emailOrPhone, Password = @password WHERE UserId = @userId');
    } else {
      await pool.request()
        .input('userId', sql.Int, userId)
        .input('fullName', sql.NVarChar, fullName)
        .input('emailOrPhone', sql.VarChar, emailOrPhone)
        .query('UPDATE Users SET FullName = @fullName, EmailOrPhone = @emailOrPhone WHERE UserId = @userId');
    }

    res.json({ message: 'Cập nhật thông tin cá nhân thành công!' });
  } catch (err) {
    console.error('Lỗi cập nhật profile:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin cá nhân' });
  }
});

// --- API 6: Lấy danh sách Suất chiếu theo Phim ---
app.get('/api/showtimes/:movieId', async (req, res) => {
  const movieId = req.params.movieId;
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request()
      .input('movieId', sql.VarChar, movieId)
      .query(`
        SELECT s.ShowtimeId, s.ShowDate, s.StartTime, s.FormatType, 
               a.AuditoriumId, a.AuditoriumName, a.TotalRows, a.SeatsPerRow, 
               c.CinemaId, c.CinemaName, c.City 
        FROM Showtimes s
        JOIN Auditoriums a ON s.AuditoriumId = a.AuditoriumId
        JOIN Cinemas c ON a.CinemaId = c.CinemaId
        WHERE s.MovieId = @movieId
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi lấy lịch chiếu:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy lịch chiếu' });
  }
});

// --- API 7: Lấy danh sách các Ghế ĐÃ BÁN của 1 Suất chiếu ---
app.get('/api/booked-seats/:showtimeId', async (req, res) => {
  const showtimeId = req.params.showtimeId;
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request()
      .input('showtimeId', sql.Int, showtimeId)
      .query('SELECT SeatCode FROM BookingSeats WHERE ShowtimeId = @showtimeId');
    
    const bookedSeats = result.recordset.map(row => row.SeatCode);
    res.json(bookedSeats);
  } catch (err) {
    console.error('Lỗi lấy danh sách ghế đã đặt:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách ghế' });
  }
});

// --- API 8: Lưu Đặt Vé và Ghế vào CSDL khi Thanh Toán ---
app.post('/api/checkout', async (req, res) => {
  const { userId, showtimeId, seats, totalAmount, paymentMethod } = req.body;

  if (!seats || seats.length === 0 || !showtimeId) {
    return res.status(400).json({ message: 'Thông tin đặt vé không hợp lệ!' });
  }

  try {
    let pool = await sql.connect(dbConfig);
    
    let bookingResult = await pool.request()
      .input('userId', sql.Int, userId || null)
      .input('showtimeId', sql.Int, showtimeId)
      .input('totalAmount', sql.Decimal(18,2), totalAmount)
      .input('paymentMethod', sql.VarChar, paymentMethod || 'MoMo')
      .query('INSERT INTO Bookings (UserId, ShowtimeId, TotalAmount, PaymentMethod) OUTPUT INSERTED.BookingId VALUES (@userId, @showtimeId, @totalAmount, @paymentMethod)');

    const newBookingId = bookingResult.recordset[0].BookingId;

    for (let seat of seats) {
      await pool.request()
        .input('bookingId', sql.Int, newBookingId)
        .input('showtimeId', sql.Int, showtimeId)
        .input('seatCode', sql.VarChar, seat.id)
        .input('price', sql.Decimal(18,2), seat.price)
        .query('INSERT INTO BookingSeats (BookingId, ShowtimeId, SeatCode, Price) VALUES (@bookingId, @showtimeId, @seatCode, @price)');
    }

    res.status(200).json({ message: 'Đặt vé thành công!', bookingId: newBookingId });
  } catch (err) {
    console.error('Lỗi lưu đặt vé:', err);
    res.status(500).json({ message: 'Lỗi kết nối CSDL khi thanh toán' });
  }
});

// --- API 9: Lấy lịch sử đặt vé của Người dùng ---
app.get('/api/user-bookings/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT b.BookingId, m.Title AS MovieTitle, c.CinemaName, s.FormatType, 
               s.StartTime, CONVERT(VARCHAR(10), s.ShowDate, 103) AS ShowDate, 
               b.TotalAmount, b.PaymentMethod,
               STRING_AGG(bs.SeatCode, ', ') AS SeatList
        FROM Bookings b
        JOIN Showtimes s ON b.ShowtimeId = s.ShowtimeId
        JOIN Movies m ON s.MovieId = m.MovieId
        JOIN Auditoriums a ON s.AuditoriumId = a.AuditoriumId
        JOIN Cinemas c ON a.CinemaId = c.CinemaId
        LEFT JOIN BookingSeats bs ON b.BookingId = bs.BookingId
        WHERE b.UserId = @userId
        GROUP BY b.BookingId, m.Title, c.CinemaName, s.FormatType, s.StartTime, s.ShowDate, b.TotalAmount, b.PaymentMethod, b.CreatedAt
        ORDER BY b.CreatedAt DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi lấy lịch sử đặt vé:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy lịch sử đặt vé' });
  }
});

// Khởi động server tại cổng 3000 và gọi hàm kiểm tra khởi tạo CSDL
const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
  await initDatabase();
});