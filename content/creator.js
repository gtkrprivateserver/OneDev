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
  // Setiap video: {title, thumbnailData, videoData, owner}
  let videoList = JSON.parse(localStorage.getItem('videoList')) || [];

  // ===== Login =====
  loginBtn.addEventListener('click', () => loginPopup.classList.remove('hidden'));
  accountBtn.addEventListener('click', () => dropdownContent.classList.toggle('hidden'));
  openUploadBtn.addEventListener('click', () => uploadPopup.classList.remove('hidden'));
  closePopupBtns.forEach(btn => btn.addEventListener('click', () => btn.closest('.popup').classList.add('hidden')));

  doLoginBtn.addEventListener('click', () => {
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    if (bannedAccounts.includes(username)) { alert('Akun ini dibanned!'); return; }
    const account = accounts.find(acc => acc.username === username && acc.password === password);
    if (!account) { alert('Username atau password salah!'); return; }

    loggedIn = true;
    currentUser = username;
    loginPopup.classList.add('hidden');
    loginBtn.classList.add('hidden');
    accountWrapper.classList.remove('hidden');

    renderVideos();
  });

  // ===== Upload Video =====
  uploadBtn.addEventListener('click', () => {
    const title = document.getElementById('videoTitle').value;
    const thumbnail = document.getElementById('thumbnailInput').files[0];
    const video = document.getElementById('videoInput').files[0];

    if (!title || !thumbnail || !video) { alert('Mohon isi semua field!'); return; }

    // Cek kata/unsur 18+
    const isBanned = bannedKeywords.some(keyword => title.toLowerCase().includes(keyword));
    if (isBanned) { alert('Video mengandung konten terlarang (18+)!'); return; }

    // Convert file menjadi Data URL supaya bisa disimpan di localStorage
    const readerThumb = new FileReader();
    readerThumb.onload = () => {
      const thumbData = readerThumb.result;
      const readerVideo = new FileReader();
      readerVideo.onload = () => {
        const videoData = readerVideo.result;

        videoList.push({
          title,
          thumbnailData: thumbData,
          videoData: videoData,
          owner: currentUser
        });

        localStorage.setItem('videoList', JSON.stringify(videoList));
        renderVideos();

        // Reset form
        document.getElementById('videoTitle').value = '';
        document.getElementById('thumbnailInput').value = '';
        document.getElementById('videoInput').value = '';
        uploadPopup.classList.add('hidden');
      };
      readerVideo.readAsDataURL(video);
    };
    readerThumb.readAsDataURL(thumbnail);
  });

  // ===== Render Videos =====
  function renderVideos() {
    videosContainer.innerHTML = '';

    videoList.forEach((vid, index) => {
      const videoCard = document.createElement('div');
      videoCard.classList.add('video-card');

      const deleteButton = vid.owner === currentUser
        ? `<button class="delete-btn" data-index="${index}">Hapus</button>`
        : '';

      videoCard.innerHTML = `
        <img src="${vid.thumbnailData}" class="video-thumb">
        <h3>${vid.title}</h3>
        <video src="${vid.videoData}" controls class="video-player"></video>
        ${deleteButton}
      `;

      videosContainer.appendChild(videoCard);
    });

    // Hapus tombol
    const deleteBtns = videosContainer.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-index');
      videoList.splice(idx, 1);
      localStorage.setItem('videoList', JSON.stringify(videoList));
      renderVideos();
    }));
  }

  // ===== Logout =====
  logoutBtn.addEventListener('click', () => {
    loggedIn = false;
    currentUser = null;
    accountWrapper.classList.add('hidden');
    loginBtn.classList.remove('hidden');
    dropdownContent.classList.add('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!accountWrapper.contains(e.target) && !dropdownContent.contains(e.target)) dropdownContent.classList.add('hidden');
  });

  renderVideos();
});