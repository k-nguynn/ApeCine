-- ==========================================
-- BƯỚC 1: XÓA TẤT CẢ CÁC BẢNG CŨ (KỂ CẢ USERS NẾU MUỐN LÀM SẠCH TỪ ĐẦU)
-- ==========================================
DROP TABLE IF EXISTS BookingSeats;
DROP TABLE IF EXISTS Bookings;
DROP TABLE IF EXISTS Showtimes;
DROP TABLE IF EXISTS Auditoriums;
DROP TABLE IF EXISTS Cinemas;
DROP TABLE IF EXISTS Movies;
DROP TABLE IF EXISTS Users; -- Đã thêm dòng này để không bị lỗi trùng lặp


-- ==========================================
-- BƯỚC 2: TẠO MỚI TOÀN BỘ CẤU TRÚC BẢNG
-- ==========================================
CREATE TABLE Users (
  UserId INT IDENTITY(1,1) PRIMARY KEY,
  FullName NVARCHAR(100) NOT NULL,
  EmailOrPhone VARCHAR(100) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE()
);

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
);

CREATE TABLE Cinemas (
  CinemaId INT IDENTITY(1,1) PRIMARY KEY,
  CinemaName NVARCHAR(150) NOT NULL,
  City NVARCHAR(100) NOT NULL,
  Address NVARCHAR(255)
);

CREATE TABLE Auditoriums (
  AuditoriumId INT IDENTITY(1,1) PRIMARY KEY,
  CinemaId INT FOREIGN KEY REFERENCES Cinemas(CinemaId),
  AuditoriumName NVARCHAR(50) NOT NULL,
  TotalRows INT DEFAULT 6,
  SeatsPerRow INT DEFAULT 10
);

CREATE TABLE Showtimes (
  ShowtimeId INT IDENTITY(1,1) PRIMARY KEY,
  MovieId VARCHAR(50) FOREIGN KEY REFERENCES Movies(MovieId),
  AuditoriumId INT FOREIGN KEY REFERENCES Auditoriums(AuditoriumId),
  ShowDate DATE NOT NULL,
  StartTime VARCHAR(10) NOT NULL,
  FormatType VARCHAR(50) DEFAULT 'Standard 2D'
);

CREATE TABLE Bookings (
  BookingId INT IDENTITY(1,1) PRIMARY KEY,
  UserId INT FOREIGN KEY REFERENCES Users(UserId),
  ShowtimeId INT FOREIGN KEY REFERENCES Showtimes(ShowtimeId),
  TotalAmount DECIMAL(18,2) NOT NULL,
  PaymentMethod VARCHAR(50) DEFAULT 'MoMo',
  CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE BookingSeats (
  BookingSeatId INT IDENTITY(1,1) PRIMARY KEY,
  BookingId INT FOREIGN KEY REFERENCES Bookings(BookingId),
  ShowtimeId INT FOREIGN KEY REFERENCES Showtimes(ShowtimeId),
  SeatCode VARCHAR(10) NOT NULL,
  Price DECIMAL(18,2) NOT NULL
);


-- ==========================================
-- BƯỚC 3: CHÈN DỮ LIỆU 12 BỘ PHIM
-- ==========================================
INSERT INTO Movies (MovieId, Title, Genre, Duration, Rating, AgeRating, Language, Director, [Cast], ReleaseDate, Description, PosterUrl, TrailerUrl) VALUES
('an-mang-karaoke', N'Án Mạng Karaoke', N'Trinh Thám, Giật Gân', 110, 8.1, 'T18', N'Phụ đề tiếng Việt', N'Nguyễn Trọng Khoa', N'Thái Hòa, Quang Tuấn', '2026-10-01', N'Một vụ án mạng bí ẩn xảy ra tại một quán karaoke nổi tiếng vào nửa đêm, hé lộ nhiều góc khuất đen tối.', 'https://cdn.galaxycine.vn/media/2026/10/20/an-mang-karaoke-500_1792466369788.jpg', 'https://www.youtube.com/embed/N_jtjt1xb-o?si=ohbix773ChI31JUK'),

('bo-sua-bay', N'Bò Sữa Bay', N'Hoạt Hình, Hài Hước, Thiếu Nhi', 95, 7.9, 'P', N'Lồng tiếng Việt', N'Animation Studio', N'Đội ngũ lồng tiếng Việt', '2026-09-15', N'Hành trình kỳ diệu và đầy tiếng cười của chú bò sữa nhỏ có ước mơ bay lượn trên bầu trời cao.', 'https://static-cgv.vncdn.vn/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/t/e/teaser_poster_bsb_digital_2.jpg', 'https://www.youtube.com/embed/kKhAo3l2Bb4?si=udM2V4XiWhgvn9CL'),

('clayface', N'ClayFace', N'Hành Động, Siêu Anh Hùng, Kinh Dị', 125, 8.4, 'T18', N'Phụ đề tiếng Việt', N'DC Films', N'Action Cast', '2026-08-10', N'Nguồn gốc đen tối và bi kịch của một trong những kẻ phản diện khét tiếng trong thành phố tội phạm.', 'https://cdn.galaxycine.vn/media/2026/5/4/clayface-500_1777865100712.jpg', 'https://www.youtube.com/embed/OGO4Mqvo3jI?si=bE6yny_sZErC7bgQ'),

('demon-slayer-infinity', N'Demon Slayer: Infinity Castle', N'Hoạt Hình, Anime, Hành Động', 145, 9.5, 'T16', N'Phụ đề tiếng Việt', N'Haruo Sotozaki', N'Natsuki Hanae, Akari Kito', '2026-04-20', N'Trận chiến cuối cùng đầy cam go giữa Sát Quỷ Sĩ và các Thượng Huyền Quỷ tại Vô Hạn Thành.', 'https://image.tmdb.org/t/p/w1280/fWVSwgjpT2D78VUh6X8UBd2rorW.jpg', 'https://www.youtube.com/embed/x7uLutVRBfI?si=4L0O-qsA8ZJmIAfK'),

('doraemon-45', N'Doraemon Movie 45 (2026)', N'Hoạt Hình, Phiêu Lưu, Gia Đình', 110, 8.8, 'P', N'Lồng tiếng Việt', N'Fujiko F. Fujio Studio', N'Wasabi Mizuta, Megumi Ohara', '2026-05-25', N'Cuộc phiêu lưu mới nhất kỷ niệm bộ phim điện ảnh thứ 45 của chú mèo máy thông minh Doraemon.', 'https://cdn.galaxycine.vn/media/2026/5/22/doraemon-the-movie-new-nobita-and-the-castle-of-the-undersea-devil-3_1779408706840.jpg', 'https://www.youtube.com/embed/u3JgYkmuK78?si=Nh1Fs55OVlROSb58'),

('dune2', N'Dune: Hành Tinh Cát 2', N'Khoa Học Viễn Tưởng, Hành Động', 166, 9.2, 'T13', N'Phụ đề tiếng Việt', N'Denis Villeneuve', N'Timothée Chalamet, Zendaya', '2026-03-01', N'Hành trình huyền thoại của Paul Atreides khi anh hợp sức cùng Chani và tộc người Fremen.', 'https://wallpaperaccess.com/full/12718841.jpg', 'https://www.youtube.com/embed/Way9Dexny3w'),

('godzilla-kong', N'Godzilla x Kong: Đế Chế Mới', N'Hành Động, Viễn Tưởng, Quái Vật', 115, 8.0, 'T13', N'Phụ đề tiếng Việt', N'Adam Wingard', N'Rebecca Hall, Dan Stevens', '2026-03-25', N'Hai titan huyền thoại phải gác lại bất hòa để đối đầu với mối đe dọa khổng lồ ẩn giấu trong lòng đất.', 'https://image.tmdb.org/t/p/w1280/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg', 'https://www.youtube.com/embed/lV1OOlGwExM?si=lg9RfNrhc_4t6dnA'),

('mai', N'MAI', N'Tâm Lý, Tình Cảm, Drama', 131, 8.5, 'T18', N'Tiếng Việt', N'Trấn Thành', N'Phương Anh Đào, Tuấn Trần', '2024-02-10', N'Câu chuyện chân thực và đầy cảm xúc về cuộc đời, tình yêu của Mai - một người phụ nữ có quá khứ nhiều trắc trở.', 'https://image.tmdb.org/t/p/original/uFsn8qBEzbeJCqH0LsViwPom5ww.jpg', 'https://www.youtube.com/embed/HXWRTGbhb4U?si=6ddwbtq4j5fAeLti'),

('natra-2', N'Na Tra 2: Ma Đồng Náo Hải', N'Hoạt Hình, Thần Thoại, Hành Động', 140, 9.0, 'T13', N'Phụ đề tiếng Việt', N'Sủi Tỷ (Jiao Zi)', N'Voice Cast', '2026-01-29', N'Tiếp nối siêu phẩm thần thoại Trung Hoa, Na Tra đối mặt với những thử thách mới vô cùng chấn động.', 'https://image.tmdb.org/t/p/w500/bTMf8M7rZ21fChGdtsZtJj4Dfqh.jpg', 'https://www.youtube.com/embed/ETlOSBR92Fs?si=4_BWMc1xq9vtjGQ3'),

('ramayana', N'RAMAYANA', N'Sử Thi, Thần Thoại, Hành Động', 180, 8.3, 'T13', N'Phụ đề tiếng Việt', N'Nitesh Tiwari', N'Ranbir Kapoor, Sai Pallavi', '2026-11-01', N'Bộ phim sử thi hoành tráng tái hiện lại truyền thuyết kinh điển của văn hóa phương Đông.', 'https://image.tmdb.org/t/p/original/hz2Hv8tPToHvQ7HaxzqeLvahmcJ.jpg', 'https://www.youtube.com/embed/1zip1rNaNYs?si=Se1YAd__qk7r5SI_'),

('transformers', N'Transformers: Quái Thú Trỗi Dậy', N'Hành Động, Khoa Học Viễn Tưởng', 127, 7.9, 'T13', N'Phụ đề tiếng Việt', N'Steven Caple Jr.', N'Anthony Ramos, Dominique Fishback', '2026-06-08', N'Cuộc chiến toàn cầu với sự xuất hiện của các thế lực Maximals, Predacons và Terrorcons.', 'https://image.tmdb.org/t/p/original/gPbM0MK8CP8A174rmUwGsADNYKD.jpg', 'https://www.youtube.com/embed/itnqEauWQZM'),

('aquaman2', N'Aquaman Và Vương Quốc Thất Lạc', N'Hành Động, Phiêu Lưu, Viễn Tưởng', 124, 7.6, 'T13', N'Phụ đề tiếng Việt', N'James Wan', N'Jason Momoa, Patrick Wilson, Amber Heard', '2025-12-20', N'Aquaman phải bảo vệ Atlantis và gia đình trước một sức mạnh cổ xưa tàn khốc.', 'https://image.tmdb.org/t/p/original/8xV47NDrjdZDpkVcCFqkdHa3T0C.jpg', 'https://www.youtube.com/embed/FV3bqvOHfGY');

-- ==========================================
-- BƯỚC 4: CHÈN DỮ LIỆU CỤM RẠP & PHÒNG CHIẾU
-- ==========================================
INSERT INTO Cinemas (CinemaName, City, Address) VALUES
(N'ApeCine Đà Nẵng', N'Đà Nẵng', N'Tầng 4, Vincom Plaza, Q. Sơn Trà, Đà Nẵng'),
(N'ApeCine Hà Nội', N'Hà Nội', N'Tầng 5, Vincom Center Bà Triệu, Q. Hai Bà Trưng, Hà Nội'),
(N'ApeCine TP.HCM', N'TP. Hồ Chí Minh', N'AEON Mall Tân Phú, Q. Tân Phú, TP.HCM');

INSERT INTO Auditoriums (CinemaId, AuditoriumName, TotalRows, SeatsPerRow) VALUES
(1, N'Phòng 1 (IMAX)', 8, 12),
(1, N'Phòng 2 (Gold Class)', 6, 8),
(2, N'Phòng 1 (IMAX)', 8, 12),
(2, N'Phòng 2 (Standard)', 7, 10),
(3, N'Phòng 1 (IMAX)', 8, 12),
(3, N'Phòng 2 (Gold Class)', 6, 8);


-- ==========================================
-- BƯỚC 5: CHÈN DỮ LIỆU SUẤT CHIẾU (05/11 - 10/11/2026)
-- ==========================================
DECLARE @StartDate DATE = '2026-11-05';
DECLARE @EndDate DATE = '2026-11-10';
DECLARE @CurrentDate DATE = @StartDate;

WHILE @CurrentDate <= @EndDate
BEGIN
    INSERT INTO Showtimes (MovieId, AuditoriumId, ShowDate, StartTime, FormatType) VALUES
    ('an-mang-karaoke', 2, @CurrentDate, '10:00', 'Standard 2D'),
    ('an-mang-karaoke', 4, @CurrentDate, '14:30', 'Standard 2D'),
    ('bo-sua-bay', 4, @CurrentDate, '09:00', 'Standard 2D'),
    ('bo-sua-bay', 6, @CurrentDate, '11:30', 'Gold Class'),
    ('clayface', 1, @CurrentDate, '19:00', 'IMAX 2D'),
    ('clayface', 3, @CurrentDate, '21:45', 'IMAX 2D'),
    ('demon-slayer-infinity', 1, @CurrentDate, '13:15', 'IMAX 2D'),
    ('demon-slayer-infinity', 3, @CurrentDate, '16:45', 'IMAX 2D'),
    ('demon-slayer-infinity', 5, @CurrentDate, '20:00', 'IMAX 2D'),
    ('doraemon-45', 2, @CurrentDate, '09:30', 'Standard 2D'),
    ('doraemon-45', 4, @CurrentDate, '12:00', 'Standard 2D'),
    ('dune2', 1, @CurrentDate, '09:30', 'IMAX 2D'),
    ('dune2', 2, @CurrentDate, '13:30', 'Gold Class'),
    ('dune2', 5, @CurrentDate, '20:15', 'IMAX 2D'),
    ('godzilla-kong', 3, @CurrentDate, '10:00', 'IMAX 2D'),
    ('godzilla-kong', 5, @CurrentDate, '14:00', 'IMAX 2D'),
    ('mai', 2, @CurrentDate, '17:30', 'Standard 2D'),
    ('mai', 6, @CurrentDate, '20:30', 'Gold Class'),
    ('natra-2', 1, @CurrentDate, '16:30', 'IMAX 2D'),
    ('natra-2', 3, @CurrentDate, '19:30', 'IMAX 2D'),
    ('ramayana', 5, @CurrentDate, '17:00', 'IMAX 2D'),
    ('ramayana', 6, @CurrentDate, '14:00', 'Gold Class'),
    ('transformers', 4, @CurrentDate, '17:00', 'Standard 2D'),
    ('transformers', 2, @CurrentDate, '21:00', 'Standard 2D'),
    ('aquaman2', 4, @CurrentDate, '11:00', 'Standard 2D'),
    ('aquaman2', 6, @CurrentDate, '16:30', 'Gold Class');

    SET @CurrentDate = DATEADD(day, 1, @CurrentDate);
END



-- ==========================================
-- BẢO ĐẢM THÊM ĐẦY ĐỦ SUẤT CHIẾU CHO TẤT CẢ 12 BỘ PHIM (05/11 - 10/11/2026)
-- ==========================================
DECLARE @StartDate DATE = '2026-11-05';
DECLARE @EndDate DATE = '2026-11-10';
DECLARE @CurrentDate DATE = @StartDate;

WHILE @CurrentDate <= @EndDate
BEGIN
    INSERT INTO Showtimes (MovieId, AuditoriumId, ShowDate, StartTime, FormatType) VALUES
    -- 1. Án Mạng Karaoke
    ('an-mang-karaoke', 2, @CurrentDate, '10:00', 'Standard 2D'),
    ('an-mang-karaoke', 4, @CurrentDate, '14:30', 'Standard 2D'),
    
    -- 2. Bò Sữa Bay
    ('bo-sua-bay', 4, @CurrentDate, '09:00', 'Standard 2D'),
    ('bo-sua-bay', 6, @CurrentDate, '11:30', 'Gold Class'),
    
    -- 3. ClayFace
    ('clayface', 1, @CurrentDate, '19:00', 'IMAX 2D'),
    ('clayface', 3, @CurrentDate, '21:45', 'IMAX 2D'),
    ('clayface', 5, @CurrentDate, '15:00', 'IMAX 2D'),
    
    -- 4. Demon Slayer: Infinity Castle
    ('demon-slayer-infinity', 1, @CurrentDate, '13:15', 'IMAX 2D'),
    ('demon-slayer-infinity', 3, @CurrentDate, '16:45', 'IMAX 2D'),
    ('demon-slayer-infinity', 5, @CurrentDate, '20:00', 'IMAX 2D'),

    -- 5. Doraemon Movie 45 (2026)
    ('doraemon-45', 2, @CurrentDate, '09:30', 'Standard 2D'),
    ('doraemon-45', 4, @CurrentDate, '12:00', 'Standard 2D'),
    ('doraemon-45', 6, @CurrentDate, '10:15', 'Gold Class'),

    -- 6. Dune: Hành Tinh Cát 2
    ('dune2', 1, @CurrentDate, '09:30', 'IMAX 2D'),
    ('dune2', 2, @CurrentDate, '13:30', 'Gold Class'),
    ('dune2', 5, @CurrentDate, '20:15', 'IMAX 2D'),

    -- 7. Godzilla x Kong: Đế Chế Mới
    ('godzilla-kong', 3, @CurrentDate, '10:00', 'IMAX 2D'),
    ('godzilla-kong', 5, @CurrentDate, '14:00', 'IMAX 2D'),
    ('godzilla-kong', 1, @CurrentDate, '17:30', 'IMAX 2D'),

    -- 8. MAI
    ('mai', 2, @CurrentDate, '17:30', 'Standard 2D'),
    ('mai', 6, @CurrentDate, '20:30', 'Gold Class'),
    ('mai', 4, @CurrentDate, '19:00', 'Standard 2D'),

    -- 9. Na Tra 2: Ma Đồng Náo Hải
    ('natra-2', 1, @CurrentDate, '16:30', 'IMAX 2D'),
    ('natra-2', 3, @CurrentDate, '19:30', 'IMAX 2D'),
    ('natra-2', 5, @CurrentDate, '11:00', 'IMAX 2D'),

    -- 10. RAMAYANA
    ('ramayana', 5, @CurrentDate, '17:00', 'IMAX 2D'),
    ('ramayana', 6, @CurrentDate, '14:00', 'Gold Class'),
    ('ramayana', 1, @CurrentDate, '22:00', 'IMAX 2D'),

    -- 11. Transformers: Quái Thú Trỗi Dậy
    ('transformers', 4, @CurrentDate, '17:00', 'Standard 2D'),
    ('transformers', 2, @CurrentDate, '21:00', 'Standard 2D'),
    ('transformers', 3, @CurrentDate, '13:00', 'IMAX 2D'),

    -- 12. Aquaman Và Vương Quốc Thất Lạc
    ('aquaman2', 4, @CurrentDate, '11:00', 'Standard 2D'),
    ('aquaman2', 6, @CurrentDate, '16:30', 'Gold Class'),
    ('aquaman2', 2, @CurrentDate, '19:15', 'Standard 2D');

    -- Tăng ngày lên 1
    SET @CurrentDate = DATEADD(day, 1, @CurrentDate);
END