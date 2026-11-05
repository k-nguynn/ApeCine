// ==================== COMPONENTS DÙNG CHUNG ====================

const COMMON_NAVBAR = `
  <header class="fixed top-0 left-0 right-0 z-50 bg-[#0a0d14]/90 backdrop-blur-xl border-b border-white/10">
    <div class="h-20 max-w-[1360px] mx-auto px-6 flex items-center justify-between gap-6">
      
      <!-- Logo ApeCine & Custom Location Selector -->
      <div class="flex items-center gap-6">
        <a href="Homepage.html" class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[#e50914] text-3xl">local_activity</span>
          <span class="font-extrabold text-2xl tracking-wider">APE<span class="text-[#e50914]">CINE</span></span>
        </a>
        
        <!-- CUSTOM LOCATION DROPDOWN -->
        <div class="relative hidden sm:block">
          <button id="location-btn" onclick="toggleLocationMenu()" class="flex items-center gap-2 bg-[#151922] hover:bg-[#1f2430] px-3.5 py-2 rounded-xl border border-white/10 text-xs font-semibold transition-all">
            <span class="material-symbols-outlined text-[#e50914] text-base">location_on</span>
            <span id="current-location-text">Đà Nẵng</span>
            <span class="material-symbols-outlined text-gray-400 text-sm transition-transform duration-200" id="location-arrow">expand_more</span>
          </button>

          <!-- MENU CHỌN KHU VỰC -->
          <div id="location-dropdown-menu" class="absolute left-0 mt-2 w-48 bg-[#151922] border border-white/10 rounded-2xl shadow-2xl py-2 hidden z-50 backdrop-blur-xl">
            <div class="px-3 py-1.5 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Chọn thành phố</div>
            
            <button onclick="selectLocation('Đà Nẵng')" class="location-item w-full flex items-center justify-between px-4 py-2.5 text-xs text-gray-200 hover:bg-[#1f2430] hover:text-[#ffb400] transition-colors">
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-sm text-gray-400">apartment</span> Đà Nẵng
              </span>
              <span class="material-symbols-outlined text-sm text-[#e50914] check-icon">check</span>
            </button>

            <button onclick="selectLocation('Hà Nội')" class="location-item w-full flex items-center justify-between px-4 py-2.5 text-xs text-gray-200 hover:bg-[#1f2430] hover:text-[#ffb400] transition-colors">
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-sm text-gray-400">apartment</span> Hà Nội
              </span>
              <span class="material-symbols-outlined text-sm text-[#e50914] check-icon hidden">check</span>
            </button>

            <button onclick="selectLocation('TP. Hồ Chí Minh')" class="location-item w-full flex items-center justify-between px-4 py-2.5 text-xs text-gray-200 hover:bg-[#1f2430] hover:text-[#ffb400] transition-colors">
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-sm text-gray-400">apartment</span> TP. Hồ Chí Minh
              </span>
              <span class="material-symbols-outlined text-sm text-[#e50914] check-icon hidden">check</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop Navigation Menu -->
      <nav class="hidden xl:flex items-center gap-6 text-sm font-semibold">
        <a href="Homepage.html" class="text-gray-300 hover:text-white transition-colors">Trang Chủ</a>
        <a href="Homepage.html#movies-section" class="text-gray-300 hover:text-white transition-colors">Phim Đang Chiếu</a>
        <a href="Homepage.html#quick-booking" class="text-gray-300 hover:text-white transition-colors">Lịch Chiếu</a>
        <a href="Homepage.html#news-section" class="text-gray-300 hover:text-white transition-colors">Tin Tức & Ưu Đãi</a>
      </nav>

      <!-- Right Area: Search, Auth & Hamburger Button -->
      <div class="flex items-center gap-3 md:gap-4">
        <!-- AUTH AREA -->
        <div id="auth-container">
          <div id="logged-out-view" class="flex items-center gap-2">
            <button onclick="openAuthModal('login')" class="px-4 py-2 rounded-xl bg-[#d31419] hover:bg-[#b01014] text-white font-bold text-xs border border-white/10 transition-all hidden sm:inline-block">
              Đăng Nhập / Đăng Ký
            </button>
          </div>

          <div id="logged-in-view" class="relative hidden">
            <button onclick="toggleUserMenu()" class="flex items-center gap-2 bg-[#151922] hover:bg-[#1f2430] px-3 py-1.5 rounded-xl border border-white/10 transition-all text-xs font-bold">
              <span class="w-7 h-7 rounded-full bg-[#e50914] text-white flex items-center justify-center" id="user-avatar-initial">L</span>
              <span id="user-name-display" class="hidden sm:inline-block">Thành Viên</span>
              <span class="material-symbols-outlined text-gray-400 text-sm">expand_more</span>
            </button>

            <div id="user-dropdown-menu" class="absolute right-0 mt-2 w-48 bg-[#151922] border border-white/10 rounded-2xl shadow-2xl py-2 hidden z-50">
              <a href="Profile.html" class="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-300 hover:bg-[#1f2430] hover:text-white transition-colors">
                <span class="material-symbols-outlined text-base">person</span> Hồ Sơ 
              </a>
              <a href="Profile.html" class="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-300 hover:bg-[#1f2430] hover:text-white transition-colors">
                <span class="material-symbols-outlined text-base">confirmation_number</span> Lịch Sử Đặt Vé
              </a>
              <div class="h-px bg-white/10 my-1"></div>
              <button onclick="simulateLogout()" class="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                <span class="material-symbols-outlined text-base">logout</span> Đăng Xuất
              </button>
            </div>
          </div>
        </div>

        <!-- HAMBURGER MENU -->
        <button onclick="toggleSideMenu()" class="p-2.5 rounded-xl bg-[#151922] hover:bg-[#1f2430] border border-white/10 text-white transition-colors flex items-center justify-center">
          <span class="material-symbols-outlined text-2xl">menu</span>
        </button>
      </div>
    </div>
  </header>

  <!-- MODAL ĐĂNG NHẬP / ĐĂNG KÝ -->
  <div id="auth-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden flex items-center justify-center p-4">
    <div class="relative w-full max-w-md bg-[#151922] rounded-3xl border border-white/10 shadow-2xl p-8 overflow-hidden">
      <button onclick="closeAuthModal()" class="absolute top-5 right-5 text-gray-400 hover:text-white">
        <span class="material-symbols-outlined text-2xl">close</span>
      </button>
      <div class="text-center mb-6">
        <div class="flex items-center justify-center gap-2 mb-2">
          <span class="material-symbols-outlined text-[#e50914] text-3xl">local_activity</span>
          <span class="font-extrabold text-2xl tracking-wider">APE<span class="text-[#e50914]">CINE</span></span>
        </div>
        <p id="modal-subtitle" class="text-xs text-gray-400">Chào mừng bạn đến với hệ thống đặt vé điện ảnh</p>
      </div>
      <div class="grid grid-cols-2 gap-2 bg-[#1f2430] p-1.5 rounded-2xl mb-6">
        <button id="tab-login" onclick="switchAuthTab('login')" class="py-2.5 rounded-xl text-xs font-bold transition-all bg-[#e50914] text-white">Đăng Nhập</button>
        <button id="tab-register" onclick="switchAuthTab('register')" class="py-2.5 rounded-xl text-xs font-bold transition-all text-gray-400 hover:text-white">Tạo Tài Khoản</button>
      </div>
      <form onsubmit="handleAuthSubmit(event)" class="space-y-4">
        <div id="register-name-field" class="hidden space-y-1.5">
          <label class="text-xs text-gray-300 font-semibold">Họ và tên</label>
          <input type="text" id="reg-name" placeholder="Nhập họ và tên của bạn" class="w-full bg-[#10141c] text-xs text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#e50914]">
        </div>
        <div class="space-y-1.5">
          <label class="text-xs text-gray-300 font-semibold">Email hoặc Số điện thoại</label>
          <input type="text" id="auth-email" required placeholder="name@example.com hoặc số điện thoại" class="w-full bg-[#10141c] text-xs text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#e50914]">
        </div>
        <div class="space-y-1.5">
          <label class="text-xs text-gray-300 font-semibold">Mật khẩu</label>
          <input type="password" id="auth-pass" required placeholder="••••••••" class="w-full bg-[#10141c] text-xs text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#e50914]">
        </div>
        <button type="submit" id="auth-submit-btn" class="w-full py-3.5 rounded-xl bg-[#e50914] hover:bg-[#b01014] text-white font-extrabold text-xs transition-all shadow-lg glow-primary mt-2">Đăng Nhập</button>
      </form>
    </div>
  </div>

  <!-- SIDEBAR NAVIGATION OVERLAY -->
  <div id="side-menu-overlay" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden transition-opacity duration-300" onclick="toggleSideMenu()"></div>
  <div id="side-menu-drawer" class="fixed top-0 right-0 z-[55] w-80 h-full bg-[#121620] border-l border-white/10 shadow-2xl p-6 flex flex-col justify-between transform translate-x-full transition-transform duration-300">
    <div>
      <div class="flex items-center justify-between pb-6 border-b border-white/10">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[#e50914] text-2xl">local_activity</span>
          <span class="font-extrabold text-xl tracking-wider">APE<span class="text-[#e50914]">CINE</span></span>
        </div>
        <button onclick="toggleSideMenu()" class="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white">
          <span class="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>
      <nav class="flex flex-col gap-2 mt-6">
        <a href="Homepage.html" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1f2430] text-gray-300 hover:text-white font-semibold text-sm transition-colors"><span class="material-symbols-outlined">home</span> Trang Chủ</a>
        <a href="Homepage.html#movies-section" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1f2430] text-gray-300 hover:text-white font-semibold text-sm transition-colors"><span class="material-symbols-outlined">movie</span> Phim Đang Chiếu</a>
        <a href="Profile.html" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1f2430] text-gray-300 hover:text-white font-semibold text-sm transition-colors"><span class="material-symbols-outlined">account_circle</span> Tài Khoản Cá Nhân</a>
      </nav>
    </div>
  </div>
`;

const COMMON_FOOTER = `
  <footer class="bg-[#06080d] text-gray-400 pt-16 pb-12 border-t border-white/10 mt-16">
    <div class="max-w-[1360px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
      
      <!-- Cột 1: Thông tin thương hiệu -->
      <div class="space-y-4">
        <a href="Homepage.html" class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[#e50914] text-3xl">local_activity</span>
          <span class="font-extrabold text-2xl tracking-wider text-white">APE<span class="text-[#e50914]">CINE</span></span>
        </a>
        <p class="text-xs leading-relaxed text-gray-400">
          CÔNG TY CỔ PHẦN GIẢI TRÍ ĐIỆN ẢNH APECINE.<br>
          Hệ thống rạp chiếu phim thương mại hàng đầu Việt Nam với công nghệ IMAX Laser, Dolby Atmos và dịch vụ chuẩn quốc tế.
        </p>
        <p class="text-xs text-gray-500">Giấy CNĐKDN: 0312345678 do Sở KH&ĐT TP. Đà Nẵng cấp lần đầu ngày 10/01/2024.</p>
      </div>

      <!-- Cột 2: Quy định & Điều khoản -->
      <div class="space-y-3 text-xs">
        <h4 class="font-extrabold text-white text-sm uppercase tracking-wider mb-2 border-l-2 border-[#e50914] pl-2">Điều Khoản Sử Dụng</h4>
        <p><a href="#" class="hover:text-white transition-colors">Điều Khoản Chung</a></p>
        <p><a href="#" class="hover:text-white transition-colors">Chính Sách Thanh Toán & Hoàn Vé</a></p>
        <p><a href="#" class="hover:text-white transition-colors">Chính Sách Bảo Mật Thông Tin</a></p>
        <p><a href="#" class="hover:text-white transition-colors">Quy Định Về Độ Tuổi Xem Phim</a></p>
        <p><a href="#" class="hover:text-white transition-colors">Quyền Lợi Thành Viên ApeClub</a></p>
      </div>

      <!-- Cột 3: Hỗ trợ khách hàng -->
      <div class="space-y-3 text-xs">
        <h4 class="font-extrabold text-white text-sm uppercase tracking-wider mb-2 border-l-2 border-[#e50914] pl-2">Chăm Sóc Khách Hàng</h4>
        <p class="flex items-center gap-2">
          <span class="material-symbols-outlined text-base text-gray-400">call</span>
           Hotline: <strong class="text-[#ffb400] text-sm">1900XXXX</strong> 
        </p>
        <p class="flex items-center gap-2">
          <span class="material-symbols-outlined text-base text-gray-400">mail</span>
          Email: <span class="text-white">cskh@apecine.vn</span>
        </p>
        <p class="flex items-center gap-2">
          <span class="material-symbols-outlined text-base text-gray-400">location_on</span>
          Trụ sở chính: <span class="text-white"> Q. Hải Châu, TP. Đà Nẵng</span>
        </p>
      </div>

      <!-- Cột 4: Thanh toán & Chứng nhận -->
      <div class="space-y-4 text-xs">
        <h4 class="font-extrabold text-white text-sm uppercase tracking-wider mb-2 border-l-2 border-[#e50914] pl-2">Đối Tác Thanh Toán</h4>
        <div class="flex flex-wrap gap-2">
          <span class="px-2.5 py-1 rounded bg-[#151922] border border-white/10 text-gray-300 font-bold text-[11px]">MoMo</span>
          <span class="px-2.5 py-1 rounded bg-[#151922] border border-white/10 text-gray-300 font-bold text-[11px]">VNPay</span>
          <span class="px-2.5 py-1 rounded bg-[#151922] border border-white/10 text-gray-300 font-bold text-[11px]">ZaloPay</span>
          <span class="px-2.5 py-1 rounded bg-[#151922] border border-white/10 text-gray-300 font-bold text-[11px]">Visa/Master</span>
        </div>
      </div>

    </div>

    <!-- Bản quyền cuối trang -->
    <div class="max-w-[1360px] mx-auto px-6 pt-6 border-t border-white/10 text-center text-xs text-gray-500">
      © 2026 APECINE CINEMA CORPORATION. All rights reserved.
    </div>
  </footer>
`;

// HÀM TIÊM HTML NGAY LẬP TỨC (Không chờ DOMContentLoaded để tránh độ trễ click)
function injectComponents() {
  const headerPlaceholder = document.getElementById('common-header');
  if (headerPlaceholder) headerPlaceholder.innerHTML = COMMON_NAVBAR;

  const footerPlaceholder = document.getElementById('common-footer');
  if (footerPlaceholder) footerPlaceholder.innerHTML = COMMON_FOOTER;

  initLocation();
  checkLoginStatus();
}

// Chạy ngay lập tức khi file script được đọc
injectComponents();

let currentAuthMode = 'login';

function toggleLocationMenu() {
  const menu = document.getElementById('location-dropdown-menu');
  if (menu) menu.classList.toggle('hidden');
}

function selectLocation(name) {
      localStorage.setItem('apecine_city', name);
      const locText = document.getElementById('current-location-text');
      if (locText) locText.innerText = name;

      // Cập nhật trạng thái hiển thị dấu check cho các nút khu vực
      document.querySelectorAll('.location-item').forEach(item => {
        const checkIcon = item.querySelector('.check-icon');
        if (item.textContent.includes(name)) {
          if (checkIcon) checkIcon.classList.remove('hidden');
        } else {
          if (checkIcon) checkIcon.classList.add('hidden');
        }
      });

      toggleLocationMenu();
    }

function initLocation() {
  const saved = localStorage.getItem('apecine_city') || 'Đà Nẵng';
  const locText = document.getElementById('current-location-text');
  if (locText) locText.innerText = saved;
}

function toggleSideMenu() {
  const drawer = document.getElementById('side-menu-drawer');
  const overlay = document.getElementById('side-menu-overlay');
  if (drawer) drawer.classList.toggle('translate-x-full');
  if (overlay) overlay.classList.toggle('hidden');
}

function toggleUserMenu() {
  const menu = document.getElementById('user-dropdown-menu');
  if (menu) menu.classList.toggle('hidden');
}

function checkLoginStatus() {
  const storedUser = localStorage.getItem('apecine_user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      const nameDisp = document.getElementById('user-name-display');
      const avatarInit = document.getElementById('user-avatar-initial');
      const outView = document.getElementById('logged-out-view');
      const inView = document.getElementById('logged-in-view');

      if (nameDisp) nameDisp.innerText = user.FullName;
      if (avatarInit) avatarInit.innerText = user.FullName.charAt(0).toUpperCase();
      if (outView) outView.classList.add('hidden');
      if (inView) inView.classList.remove('hidden');
    } catch (e) {
      console.error(e);
    }
  }
}

function simulateLogout() {
  localStorage.removeItem('apecine_user');
  location.reload();
}

// Thêm vào cuối file components.js để đảm bảo modal và các nút bấm hoạt động trơn tru ở mọi trang
function openAuthModal(mode = 'login') {
  if (typeof switchAuthTab === 'function') {
    switchAuthTab(mode);
  }
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.add('hidden');
}

function switchAuthTab(mode) {
  currentAuthMode = mode;
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const nameField = document.getElementById('register-name-field');
  const submitBtn = document.getElementById('auth-submit-btn');
  const subtitle = document.getElementById('modal-subtitle');

  if (!tabLogin || !tabRegister) return;

  if (mode === 'login') {
    tabLogin.className = "py-2.5 rounded-xl text-xs font-bold transition-all bg-[#e50914] text-white";
    tabRegister.className = "py-2.5 rounded-xl text-xs font-bold transition-all text-gray-400 hover:text-white";
    if (nameField) nameField.classList.add('hidden');
    const regName = document.getElementById('reg-name');
    if (regName) regName.required = false;
    if (submitBtn) submitBtn.innerText = "Đăng Nhập";
    if (subtitle) subtitle.innerText = "Chào mừng bạn quay lại hệ thống đặt vé ApeCine";
  } else {
    tabRegister.className = "py-2.5 rounded-xl text-xs font-bold transition-all bg-[#e50914] text-white";
    tabLogin.className = "py-2.5 rounded-xl text-xs font-bold transition-all text-gray-400 hover:text-white";
    if (nameField) nameField.classList.remove('hidden');
    const regName = document.getElementById('reg-name');
    if (regName) regName.required = true;
    if (submitBtn) submitBtn.innerText = "Đăng Ký Tài Khoản";
    if (subtitle) subtitle.innerText = "Tạo tài khoản mới để nhận ưu đãi thành viên ApeClub";
  }
}