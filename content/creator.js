document.addEventListener('DOMContentLoaded', () => {
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

  const accounts = [
    { username: 'admin', password: 'admin123' },
    { username: 'user', password: 'user123' }
  ];
  const bannedAccounts = ['bannedUser'];
  const bannedKeywords = ['18+', 'dewasa', 'nsfw'];

  let videoList = JSON.parse(localStorage.getItem('videoList')) || [];

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

  uploadBtn.addEventListener('click', () => {
    const title = document.getElementById('videoTitle').value;
    const thumbnail = document.getElementById('thumbnailInput').files[0];
    const video = document.getElementById('videoInput').files[0];

    if (!title || !thumbnail || !video) { alert('Mohon isi semua field!'); return; }

    const isBanned = bannedKeywords.some(k => title.toLowerCase().includes(k));
    if (isBanned) { alert('Video mengandung konten terlarang (18+)!'); return; }

    const readerThumb = new FileReader();
    readerThumb.onload = () => {
      const thumbData = readerThumb.result;
      const readerVideo = new FileReader();
      readerVideo.onload = () => {
        const videoData = readerVideo.result;
        videoList.push({ title, thumbnail: thumbData, video: videoData, owner: currentUser, views: 0, likes: 0 });
        localStorage.setItem('videoList', JSON.stringify(videoList));
        renderVideos();

        document.getElementById('videoTitle').value = '';
        document.getElementById('thumbnailInput').value = '';
        document.getElementById('videoInput').value = '';
        uploadPopup.classList.add('hidden');
      };
      readerVideo.readAsDataURL(video);
    };
    readerThumb.readAsDataURL(thumbnail);
  });

  function renderVideos() {
    videosContainer.innerHTML = '';
    videoList.forEach((vid, index) => {
      const videoCard = document.createElement('div');
      videoCard.classList.add('video-card');

      const deleteBtnHtml = vid.owner === currentUser ? `<button class="delete-btn" data-index="${index}">Hapus</button>` : '';

      videoCard.innerHTML = `
        <img src="${vid.thumbnail}" class="video-thumb">
        <h3>${vid.title}</h3>
        <video src="${vid.video}" controls class="video-player"></video>
        <div class="video-info">
          <span>Views: <span class="view-count">${vid.views}</span></span>
          <span>Likes: <span class="like-count">${vid.likes}</span></span>
        </div>
        <button class="like-btn" data-index="${index}">Like ❤️</button>
        ${deleteBtnHtml}
      `;

      videosContainer.appendChild(videoCard);

      const videoElem = videoCard.querySelector('.video-player');
      videoElem.addEventListener('play', () => {
        vid.views += 1;
        localStorage.setItem('videoList', JSON.stringify(videoList));
        videoCard.querySelector('.view-count').textContent = vid.views;
      });

      const likeBtn = videoCard.querySelector('.like-btn');
      likeBtn.addEventListener('click', () => {
        vid.likes += 1;
        localStorage.setItem('videoList', JSON.stringify(videoList));
        videoCard.querySelector('.like-count').textContent = vid.likes;
      });
    });

    const deleteBtns = videosContainer.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-index');
      videoList.splice(idx, 1);
      localStorage.setItem('videoList', JSON.stringify(videoList));
      renderVideos();
    }));
  }

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