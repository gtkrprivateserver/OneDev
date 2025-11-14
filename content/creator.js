document.addEventListener("DOMContentLoaded", () => {

  const accounts = [
    { username: "admin", password: "admin123" },
    { username: "creator", password: "creator123" }
  ];

  let isLogin = false;
  let currentUser = null;

  // POPUP
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

  // Load videos dari localStorage
  let savedVideos = JSON.parse(localStorage.getItem("videos") || "[]");
  savedVideos.forEach(v => createVideoCard(v));

  // LOGIN BUTTON
  loginBtn.addEventListener("click", () => {
    if (isLogin) {
      accountDropdown.classList.toggle("show");
    } else {
      loginPopup.classList.remove("hidden");
    }
  });

  // CLOSE POPUP
  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      loginPopup.classList.add("hidden");
      uploadPopup.classList.add("hidden");
      accountDropdown.classList.remove("show");
    });
  });

  // DO LOGIN
  doLogin.addEventListener("click", () => {
    const user = document.getElementById("loginUser").value;
    const pass = document.getElementById("loginPass").value;
    const found = accounts.find(acc => acc.username === user && acc.password === pass);
    if (!found) return alert("Username atau password salah!");
    isLogin = true;
    currentUser = found.username;
    loginPopup.classList.add("hidden");
    loginBtn.classList.add("hidden");
    accountDropdown.classList.remove("hidden");
    alert(`Login berhasil sebagai ${currentUser}`);
  });

  // LOGOUT
  doLogout.addEventListener("click", () => {
    isLogin = false;
    currentUser = null;
    accountDropdown.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    alert("Anda telah logout.");
  });

  // OPEN UPLOAD
  openUploadPopup.addEventListener("click", () => {
    uploadPopup.classList.remove("hidden");
  });

  // UPLOAD VIDEO
  uploadBtn.addEventListener("click", () => {
    const title = document.getElementById("videoTitle").value;
    const thumbnail = document.getElementById("thumbnailInput").files[0];
    const video = document.getElementById("videoInput").files[0];
    if (!title || !thumbnail || !video) return alert("Semua field wajib diisi!");

    const thumbReader = new FileReader();
    const videoReader = new FileReader();

    thumbReader.onload = () => {
      videoReader.onload = () => {
        const videoData = { title, thumbnail: thumbReader.result, video: videoReader.result, user: currentUser };
        savedVideos.unshift(videoData);
        localStorage.setItem("videos", JSON.stringify(savedVideos));
        createVideoCard(videoData);
        uploadPopup.classList.add("hidden");
        alert("Video berhasil diupload!");
      };
      videoReader.readAsDataURL(video);
    };
    thumbReader.readAsDataURL(thumbnail);
  });

  function createVideoCard(v) {
    const card = document.createElement("div");
    card.classList.add("video-card");
    card.innerHTML = `
      <img src="${v.thumbnail}" class="video-thumb">
      <h3>${v.title}</h3>
      <p class="uploaded-by">Uploaded by: ${v.user}</p>
      <video controls>
        <source src="${v.video}">
      </video>
    `;
    videosContainer.appendChild(card);
  }

});