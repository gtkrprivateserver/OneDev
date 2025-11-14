document.addEventListener('DOMContentLoaded', () => {
  // ===== Elements =====
  const loginBtn = document.getElementById('loginBtn');
  const loginPopup = document.getElementById('loginPopup');
  const doLoginBtn = document.getElementById('doLogin');
  const accountWrapper = document.getElementById('accountDropdown');
  const accountBtn = document.getElementById('accountBtn');
  const dropdownContent = document.getElementById('dropdownContent');
  const openUploadBtn = document.getElementById('openUpload');
  const uploadPopup = document.getElementById('uploadPopup');
  const closePopupBtns = document.querySelectorAll('.closePopup');
  const uploadBtn = document.getElementById('uploadBtn');
  const videosContainer = document.getElementById('videosContainer');
  const logoutBtn = document.getElementById('logoutBtn');

  let loggedIn = false;

  // ===== Dummy akun =====
  const accounts = [
    { username: 'admin', password: 'admin123' },
    { username: 'user', password: 'user123' }
  ];

  // ===== Ban akun =====
  const bannedAccounts = ['bannedUser'];

  // ===== Kata/unsur 18+ untuk ban video =====
  const bannedKeywords = ['18+', 'dewasa', 'nsfw'];

  // ===== Array untuk simpan video permanen =====
  let videoList = JSON.parse(localStorage.getItem('videoList')) || [];

  // ===== Login =====
  loginBtn.addEventListener('click', () => {
    loginPopup.classList.remove('hidden');
  });

  doLoginBtn.addEventListener('click', () => {
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    // Cek banned akun
    if (bannedAccounts.includes(username)) {
      alert('Akun ini dibanned!');
      return;
    }

    const account = accounts.find(acc => acc.username === username && acc.password === password);

    if (!account) {
      alert('Username atau password salah!');
      return;
    }

    loggedIn = true;
    loginPopup.classList.add('hidden');
    loginBtn.classList.add('hidden');
    accountWrapper.classList.remove('hidden');

    // Render semua video permanen
    renderVideos();
  });

  // ===== Account dropdown =====
  accountBtn.addEventListener('click', () => {
    dropdownContent.classList.toggle('hidden');
  });

  // ===== Open Upload Popup =====
  openUploadBtn.addEventListener('click', () => {
    uploadPopup.classList.remove('hidden');
  });

  // ===== Close Popup =====
  closePopupBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.popup').classList.add('hidden');
    });
  });

  // ===== Upload Video =====
  uploadBtn.addEventListener('click', () => {
    const title = document.getElementById('videoTitle').value;
    const thumbnail = document.getElementById('thumbnailInput').files[0];
    const video = document.getElementById('videoInput').files[0];

    if (!title || !thumbnail || !video) {
      alert('Mohon isi semua field!');
      return;
    }

    // Cek kata/unsur 18+
    const isBanned = bannedKeywords.some(keyword => title.toLowerCase().includes(keyword));
    if (isBanned) {
      alert('Video mengandung konten terlarang (18+)!');
      return;
    }

    // Simpan di array permanen
    videoList.push({ title, thumbnail, video });
    localStorage.setItem('videoList', JSON.stringify(videoList));

    // Render semua video
    renderVideos();

    // Reset form dan tutup popup
    document.getElementById('videoTitle').value = '';
    document.getElementById('thumbnailInput').value = '';
    document.getElementById('videoInput').value = '';
    uploadPopup.classList.add('hidden');
  });

  // ===== Fungsi render video =====
  function renderVideos() {
    videosContainer.innerHTML = '';
    videoList.forEach((vid, index) => {
      const videoCard = document.createElement('div');
      videoCard.classList.add('video-card');
      videoCard.innerHTML = `
        <img src="${URL.createObjectURL(vid.thumbnail)}" alt="Thumbnail" class="video-thumb">
        <h3>${vid.title}</h3>
        <video src="${URL.createObjectURL(vid.video)}" controls class="video-player"></video>
        <button class="delete-btn" data-index="${index}">Hapus</button>
      `;
      videosContainer.appendChild(videoCard);
    });

    // Tambahkan event listener untuk tombol hapus
    const deleteBtns = videosContainer.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.getAttribute('data-index');
        videoList.splice(idx, 1);
        localStorage.setItem('videoList', JSON.stringify(videoList));
        renderVideos();
      });
    });
  }

  // ===== Logout =====
  logoutBtn.addEventListener('click', () => {
    loggedIn = false;
    accountWrapper.classList.add('hidden');
    loginBtn.classList.remove('hidden');
    dropdownContent.classList.add('hidden');
    // Video tetap tersimpan di localStorage
  });

  // ===== Klik luar dropdown untuk menutup =====
  document.addEventListener('click', (e) => {
    if (!accountWrapper.contains(e.target) && !dropdownContent.contains(e.target)) {
      dropdownContent.classList.add('hidden');
    }
  });

  // ===== Render video saat pertama load =====
  renderVideos();
});