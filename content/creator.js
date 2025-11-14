document.addEventListener("DOMContentLoaded", () => {

  // ============================
  // ACCOUNTS
  // ============================
  const accounts = [
    { username: "admin", password: "admin123" },
    { username: "creator", password: "creator123" }
  ];

  let isLogin = false;
  let currentUser = null;

  // ============================
  // ELEMENTS
  // ============================
  const loginBtn = document.getElementById("loginBtn");
  const accountDropdown = document.getElementById("accountDropdown");
  const accountBtn = document.getElementById("accountBtn");
  const dropdownContent = document.getElementById("dropdownContent");

  const loginPopup = document.getElementById("loginPopup");
  const uploadPopup = document.getElementById("uploadPopup");

  const doLogin = document.getElementById("doLogin");
  const logoutBtn = document.getElementById("logoutBtn");
  const openUpload = document.getElementById("openUpload");
  const uploadVideoBtn = document.getElementById("uploadBtn");
  const closePopups = document.querySelectorAll(".closePopup");

  const videosContainer = document.getElementById("videosContainer");

  // ============================
  // LOAD VIDEOS FROM STORAGE
  // ============================
  function loadVideos() {
    const data = JSON.parse(localStorage.getItem("videos") || "[]");
    videosContainer.innerHTML = "";
    data.forEach(v => {
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
    });
  }

  loadVideos();

  // ============================
  // LOGIN POPUP
  // ============================
  loginBtn.addEventListener("click", () => {
    if (!isLogin) loginPopup.classList.remove("hidden");
  });

  doLogin.addEventListener("click", () => {
    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value.trim();

    const account = accounts.find(acc => acc.username === username && acc.password === password);

    if (account) {
      isLogin = true;
      currentUser = account.username;
      loginPopup.classList.add("hidden");

      loginBtn.classList.add("hidden");
      accountDropdown.classList.remove("hidden");
      accountBtn.textContent = currentUser + " ▼";
    } else {
      alert("Username atau password salah!");
    }
  });

  // ============================
  // DROPDOWN TOGGLE
  // ============================
  accountBtn.addEventListener("click", () => {
    dropdownContent.classList.toggle("hidden");
  });

  // ============================
  // LOGOUT
  // ============================
  logoutBtn.addEventListener("click", () => {
    isLogin = false;
    currentUser = null;
    accountDropdown.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    dropdownContent.classList.add("hidden");
  });

  // ============================
  // OPEN UPLOAD POPUP
  // ============================
  openUpload.addEventListener("click", () => {
    if (!isLogin) return alert("Anda harus login terlebih dahulu!");
    uploadPopup.classList.remove("hidden");
    dropdownContent.classList.add("hidden");
  });

  // ============================
  // CLOSE POPUPS
  // ============================
  closePopups.forEach(btn => {
    btn.addEventListener("click", () => {
      loginPopup.classList.add("hidden");
      uploadPopup.classList.add("hidden");
    });
  });

  // ============================
  // UPLOAD VIDEO
  // ============================
  uploadVideoBtn.addEventListener("click", () => {
    const title = document.getElementById("videoTitle").value.trim();
    const thumbFile = document.getElementById("thumbnailInput").files[0];
    const videoFile = document.getElementById("videoInput").files[0];

    if (!title || !thumbFile || !videoFile) return alert("Semua field wajib diisi!");

    const readerThumb = new FileReader();
    const readerVideo = new FileReader();

    readerThumb.onload = () => {
      readerVideo.onload = () => {
        const videoData = {
          title,
          thumb: readerThumb.result,
          video: readerVideo.result,
          user: currentUser
        };

        const allVideos = JSON.parse(localStorage.getItem("videos") || "[]");
        allVideos.push(videoData);
        localStorage.setItem("videos", JSON.stringify(allVideos));

        loadVideos();

        uploadPopup.classList.add("hidden");

        document.getElementById("videoTitle").value = "";
        document.getElementById("thumbnailInput").value = "";
        document.getElementById("videoInput").value = "";

        alert("Video berhasil diupload!");
      };
      readerVideo.readAsDataURL(videoFile);
    };
    readerThumb.readAsDataURL(thumbFile);
  });

  // ============================
  // CLOSE DROPDOWN WHEN CLICK OUTSIDE
  // ============================
  document.addEventListener("click", e => {
    if (!accountDropdown.contains(e.target)) dropdownContent.classList.add("hidden");
  });

});