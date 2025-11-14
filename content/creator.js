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

  let loggedIn = false;

  // ===== Login =====
  loginBtn.addEventListener('click', () => {
    loginPopup.classList.remove('hidden');
  });

  doLoginBtn.addEventListener('click', () => {
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    if (!username || !password) {
      alert('Isi username dan password!');
      return;
    }

    // Contoh sederhana login
    loggedIn = true;
    loginPopup.classList.add('hidden');
    loginBtn.classList.add('hidden');
    accountWrapper.classList.remove('hidden');
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

    // Buat card video baru
    const videoCard = document.createElement('div');
    videoCard.classList.add('video-card');
    videoCard.innerHTML = `
      <img src="${URL.createObjectURL(thumbnail)}" alt="Thumbnail" class="video-thumb">
      <h3>${title}</h3>
      <video src="${URL.createObjectURL(video)}" controls class="video-player"></video>
    `;
    videosContainer.appendChild(videoCard);

    // Reset form dan tutup popup
    document.getElementById('videoTitle').value = '';
    document.getElementById('thumbnailInput').value = '';
    document.getElementById('videoInput').value = '';
    uploadPopup.classList.add('hidden');
  });

  // ===== Logout =====
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', () => {
    loggedIn = false;
    accountWrapper.classList.add('hidden');
    loginBtn.classList.remove('hidden');
    dropdownContent.classList.add('hidden');
  });
});