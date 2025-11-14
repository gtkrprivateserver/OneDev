document.addEventListener("DOMContentLoaded", () => {

  // ============================
  //  ACCOUNT CONFIG
  // ============================
  const accounts = [
    { username: "admin", password: "admin123" },
    { username: "creator", password: "creator123" },
    { username: "user1", password: "pass1" }
  ];

  let isLogin = false;
  let currentUser = null;

  // ============================
  //  POPUP ELEMENTS
  // ============================
  const loginPopup = document.getElementById("loginPopup");
  const logoutPopup = document.getElementById("logoutPopup");
  const uploadPopup = document.getElementById("uploadPopup");
  const playerOverlay = document.getElementById("playerOverlay");

  const loginBtn = document.getElementById("loginBtn");
  const openUploadPopup = document.getElementById("openUploadPopup");
  const doLogin = document.getElementById("doLogin");
  const doLogout = document.getElementById("doLogout");
  const closeButtons = document.querySelectorAll(".closePopup");

  const uploadBtn = document.getElementById("uploadBtn");
  const videosContainer = document.getElementById("videosContainer");

  const playerVideo = document.getElementById("playerVideo");
  const playerTitle = document.getElementById("playerTitle");
  const playerUser = document.getElementById("playerUser");
  const playerStats = document.getElementById("playerStats");

  // ============================
  //  OPEN POPUPS
  // ============================
  loginBtn.addEventListener("click", () => {
    if (isLogin) logoutPopup.classList.remove("hidden");
    else loginPopup.classList.remove("hidden");
  });

  openUploadPopup.addEventListener("click", () => {
    if (!isLogin) { alert("Anda harus login terlebih dahulu!"); return; }
    uploadPopup.classList.remove("hidden");
  });

  closeButtons.forEach(btn => btn.addEventListener("click", () => {
    loginPopup.classList.add("hidden");
    logoutPopup.classList.add("hidden");
    uploadPopup.classList.add("hidden");
    playerOverlay.classList.add("hidden");
  }));

  // ============================
  //  LOGIN / LOGOUT
  // ============================
  doLogin.addEventListener("click", () => {
    const user = document.getElementById("loginUser").value;
    const pass = document.getElementById("loginPass").value;

    const found = accounts.find(acc => acc.username === user && acc.password === pass);

    if (found) {
      isLogin = true;
      currentUser = found.username;
      loginPopup.classList.add("hidden");
      loginBtn.textContent = currentUser + " (Logout)";
      openUploadPopup.classList.remove("hidden");
      alert(`Login berhasil sebagai ${currentUser}!`);
    } else alert("Username atau password salah!");
  });

  doLogout.addEventListener("click", () => {
    isLogin = false;
    currentUser = null;
    logoutPopup.classList.add("hidden");
    loginBtn.textContent = "Login";
    openUploadPopup.classList.add("hidden");
    alert("Anda telah logout.");
  });

  // ============================
  //  UPLOAD VIDEO
  // ============================
  uploadBtn.addEventListener("click", () => {
    const title = document.getElementById("videoTitle").value;
    const thumbnail = document.getElementById("thumbnailInput").files[0];
    const video = document.getElementById("videoInput").files[0];

    if (!title || !thumbnail || !video) { alert("Semua field wajib diisi!"); return; }

    const thumbReader = new FileReader();
    const videoReader = new FileReader();

    thumbReader.onload = () => {
      videoReader.onload = () => {
        const card = document.createElement("div");
        card.classList.add("video-card");
        card.innerHTML = `
          <img src="${thumbReader.result}" class="video-thumb" data-video="${videoReader.result}" data-title="${title}" data-user="${currentUser}">
          <h3>${title}</h3>
          <p class="uploaded-by">Uploaded by: ${currentUser}</p>
          <video controls>
            <source src="${videoReader.result}">
          </video>
        `;
        videosContainer.prepend(card);
        uploadPopup.classList.add("hidden");
        alert("Video berhasil diupload!");
      };
      videoReader.readAsDataURL(video);
    };
    thumbReader.readAsDataURL(thumbnail);
  });

  // ============================
  //  VIDEO PLAYER CLICK
  // ============================
  videosContainer.addEventListener("click", e => {
    if (e.target.classList.contains("video-thumb")) {
      const vSrc = e.target.dataset.video;
      const vTitle = e.target.dataset.title;
      const vUser = e.target.dataset.user;

      playerVideo.src = vSrc;
      playerTitle.textContent = vTitle;
      playerUser.textContent = "Uploaded by: " + vUser;
      playerOverlay.classList.remove("hidden");
    }
  });

});