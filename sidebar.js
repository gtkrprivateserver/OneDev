// Ambil elemen
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');

// Daftar halaman otomatis (bisa ditambah di sini)
const pages = [
  { name: 'Home', link: '#' },
  { name: 'About', link: '#about' },
  { name: 'Services', link: '#services' },
  { name: 'Portfolio', link: '#portfolio' },
  { name: 'Contact', link: '#contact' },
  // Tambahkan halaman baru di sini
  { name: 'Blog', link: '#blog' },
  { name: 'Shop', link: '#shop' }
];

// Fungsi toggle sidebar
function toggleSidebar() {
  sidebar.classList.toggle('active');
  mainContent.classList.toggle('shift');
}

// Tombol menu tetap bisa toggle manual
menuBtn.addEventListener('click', toggleSidebar);

// Buat menu otomatis dari daftar pages
function generateSidebarMenu() {
  // Hapus menu lama (kecuali credit)
  sidebar.innerHTML = '';

  pages.forEach(page => {
    const a = document.createElement('a');
    a.href = page.link;
    a.textContent = page.name;
    sidebar.appendChild(a);
  });

  // Tambahkan credit otomatis di bawah sidebar
  const credit = document.createElement('div');
  credit.style.position = 'absolute';
  credit.style.bottom = '20px';
  credit.style.left = '20px';
  credit.style.fontSize = '12px';
  credit.style.color = '#aaa';
  credit.innerHTML = 'Credit by <a href="https://onedevofficial.vercel.app" target="_blank" style="color:#aaa; text-decoration:none;">OneDev</a>';
  sidebar.appendChild(credit);
}

// Otomatis buka sidebar saat halaman dimuat (desktop)
window.addEventListener('DOMContentLoaded', () => {
  generateSidebarMenu();

  if (window.innerWidth > 768) {
    sidebar.classList.add('active');
    mainContent.classList.add('shift');
  }
});

// Jika layar diubah, sesuaikan otomatis
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    sidebar.classList.add('active');
    mainContent.classList.add('shift');
  } else {
    sidebar.classList.remove('active');
    mainContent.classList.remove('shift');
  }
});