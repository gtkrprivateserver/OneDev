document.addEventListener("DOMContentLoaded", () => {

  const accounts = [
    { username: "admin", password: "admin123" },
    { username: "creator", password: "creator123" }
  ];

  let isLogin = false;
  let currentUser = null;

  const loginPopup = document.getElementById("loginPopup");
  const uploadPopup = document.getElementById("uploadPopup");
  const loginBtn = document.getElementById("loginBtn");
  const accountDropdown = document.getElementById("accountDropdown");

  const doLogin = document.getElementById("doLogin");
  const doLogout = document.getElementById("doLogout");
  const openUploadPopup = document.getElementById("openUploadPopup");
  const closeButtons = document.querySelectorAll(".closePopup");

  const uploadBtn = document.getElementById("uploadBtn");
  const videosContainer = document.getElementById("videosContainer");

  // ---------------------------
  // Load videos from localStorage
  // ---------------------------
  function loadVideos() {
    const data = JSON.parse(localStorage.getItem("videos") || "[]");
    data.forEach(v => createVideoCard(v));
  }

  function saveVideo(v) {
    let data = JSON.parse(localStorage.getItem("videos") || "[]");
    data.push(v);
    localStorage.setItem("videos", JSON.stringify(data));
  }

  function createVideoCard(v) {
    const card = document.createElement("div");
    card.classList.add("video-card");
    card.innerHTML = `
      <img src="${v.thumb}" class="video-thumb">
      <h3>${v.title}</h3>
      <p class="uploaded-by">Uploaded by: ${v.user}</p>
      <video controls>
        <source src="${v.video}">
      </video>
    `;
    videosContainer.prepend(card);
  }

  loadVideos();

  // ---------------------------
  // Login Popup
  // ---------------------------
  loginBtn.addEventListener("click", () => {
    if (isLogin) {
      accountDropdown.classList.toggle("show");
    } else {
      loginPopup.classList.remove("hidden");
    }
  });

  doLogin.addEventListener("click", () => {
    const user = document.getElementById("loginUser").value;
    const pass = document.getElementById("loginPass").value;

    const found = accounts.find(a => a.username === user && a.password === pass);
    if (found) {
      isLogin = true;
      currentUser = user;
      loginPopup.classList.add("hidden");
      loginBtn.classList.add("hidden");
      accountDropdown.classList.remove("hidden");
      alert(`Login berhasil sebagai ${currentUser}`);
    } else {
      alert("Username atau password salah!");
    }
  });

  // ---------------------------
  // Logout
  // ---------------------------
  doLogout.addEventListener("click", () => {
    isLogin = false;
    currentUser = null;
    accountDropdown.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    accountDropdown.classList.remove("show");
    alert("Logout berhasil");
  });

  // ---------------------------
  // Open Upload
  // ---------------------------
  openUploadPopup.addEventListener("click", () => {
    if (!isLogin) return alert("Login terlebih dahulu!");
    uploadPopup.classList.remove("hidden");
    accountDropdown.classList.remove("show");
  });

  // ---------------------------
  // Close Popups
  // ---------------------------
  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      loginPopup.classList.add("hidden");
      uploadPopup.classList.add("hidden");
    });
  });

  // ---------------------------
  // Upload Video
  // ---------------------------
  uploadBtn.addEventListener("click", () => {
    const title = document.getElementById("videoTitle").value;
    const thumbFile = document.getElementById("thumbnailInput").files[0];
    const videoFile = document.getElementById("videoInput").files[0];

    if (!title || !thumbFile || !videoFile) return alert("Semua field wajib diisi!");

    const thumbReader = new FileReader();
    const videoReader = new FileReader();

    thumbReader.onload = () => {
      videoReader.onload = () => {
        const videoData = {
          title: title,
          thumb: thumbReader.result,
          video: videoReader.result,
          user: currentUser
        };
        saveVideo(videoData);
        createVideoCard(videoData);
        uploadPopup.classList.add("hidden");
        alert("Video berhasil diupload!");
      };
      videoReader.readAsDataURL(video