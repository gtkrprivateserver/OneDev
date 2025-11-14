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
  let currentUser = null;

  // ===== Dummy akun =====
  const accounts = [
    { username: 'admin', password: 'admin123' },
    { username: 'user', password: 'user123' }
  ];

  const bannedAccounts = ['bannedUser'];
  const bannedKeywords = ['18+', 'dewasa', 'nsfw'];

  // ===== Video list =====
  // Setiap video: {title, thumbnail, video, owner, views, likes}
  let videoList = JSON.parse(localStorage.getItem('videoList')) || [];

  // ===== Login =====
  loginBtn.addEventListener('click', () => loginPopup.classList.remove('hidden'));

  doLoginBtn.addEventListener('click', () => {
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

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
    currentUser = username;
    loginPopup.classList.add('hidden');
    loginBtn.classList.add('hidden');
    accountWrapper.classList.remove('hidden');

    renderVideos();
  });

  // ===== Account dropdown =====
  accountBtn.addEventListener('click', () => dropdownContent.classList.toggle('hidden'));

  // ===== Open Upload Popup =====
  openUploadBtn.addEventListener('click', () => uploadPopup.classList.remove('hidden'));

  // ===== Close Popup =====
  closePopupBtns.forEach(btn => btn.addEventListener('click', () => btn.closest('.popup').classList.add('hidden')));

  // ===== Upload Video =====
  uploadBtn.addEventListener('click', () => {
    const title = document.getElementById('videoTitle').value;
    const thumbnail = document.getElementById('thumbnailInput').files[0];
    const video = document.getElementById('videoInput').files[0];

    if (!title || !thumbnail || !video) {
      alert('Mohon isi semua field!');
      return;
    }

    // Cek konten terlarang
    const isBanned = bannedKeywords.some(keyword => title.toLowerCase().includes(keyword));
    if (isBanned) {
      alert('Video mengandung konten terlarang (18+)!');
      return;
    }

    videoList.push({ title, thumbnail, video, owner: currentUser, views: 0, likes: 0 });
    localStorage.setItem('videoList', JSON.stringify(videoList));
    renderVideos();

    document.getElementById('videoTitle').value = '';
    document.getElementById('thumbnailInput').value = '';
    document.getElementById('videoInput').value = '';
    uploadPopup.classList.add('hidden');
  });

  // ===== Render Videos =====
  function renderVideos() {
    videosContainer.innerHTML = '';

    videoList.forEach((vid, index) => {
      const videoCard = document.createElement('div');
      videoCard.classList.add('video-card');

      const deleteButton = vid.owner === currentUser ? `<button class="delete-btn" data-index="${index}">Hapus</button>` : '';

      videoCard.innerHTML = `
        <img src="${URL.createObjectURL(vid.thumbnail)}" alt="Thumbnail" class="video-thumb">
        <h3>${vid.title}</h3>
        <video src="${URL.createObjectURL(vid.video)}" controls class="video-player"></video>
        <div class="video-info">
          <span>Views: <span class="view-count">${vid.views}</span></span>
          <span>Likes: <span class="like-count">${vid.likes}</span></span>
        </div>
        <button class="like-btn" data-index="${index}">Like ❤️</button>
        ${deleteButton}
      `;

      videosContainer.appendChild(videoCard);

      // Tambahkan event listener untuk video play → tambah views
      const videoElem = videoCard.querySelector('.video-player');
      videoElem.addEventListener('play', () => {
        vid.views += 1;
        localStorage.setItem('videoList', JSON.stringify(videoList));
        videoCard.querySelector('.view-count').textContent = vid.views;
      });

      // Event listener tombol like
      const likeBtn = videoCard.querySelector('.like-btn');
      likeBtn.addEventListener('click', () => {
        vid.likes += 1;
        localStorage.setItem('videoList', JSON.stringify(videoList));
        videoCard.querySelector('.like-count').textContent = vid.likes;
      });
    });

    // Event listener tombol hapus
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
    currentUser = null;
    accountWrapper.classList.add('hidden');
    loginBtn.classList.remove('hidden');
    dropdownContent.classList.add('hidden');
  });

  // ===== Klik luar dropdown =====
  document.addEventListener('click', (e) => {
    if (!accountWrapper.contains(e.target) && !dropdownContent.contains(e.target)) {
      dropdownContent.classList.add('hidden');
    }
  });

  renderVideos();
});