document.addEventListener("DOMContentLoaded", () => {

  const accounts = [
    { username:"admin", password:"admin123" },
    { username:"creator", password:"creator123" },
    { username:"user1", password:"pass1" }
  ];
  let isLogin = false;
  let currentUser = null;

  const loginPopup = document.getElementById("loginPopup");
  const uploadPopup = document.getElementById("uploadPopup");
  const loginBtn = document.getElementById("loginBtn");
  const userDropdown = document.getElementById("userDropdown");
  const doLogout = document.getElementById("doLogout");
  const openUploadPopup = document.getElementById("openUploadPopup");
  const closeButtons = document.querySelectorAll(".closePopup");
  const videosContainer = document.getElementById("videosContainer");

  // =========================
  // LOAD VIDEO DARI LOCALSTORAGE
  // =========================
  function loadVideos(){
    const data = JSON.parse(localStorage.getItem("videos") || "[]");
    videosContainer.innerHTML = "";
    data.forEach(video => addVideoCard(video));
  }

  function addVideoCard(video){
    const card = document.createElement("div");
    card.classList.add("video-card");
    card.innerHTML = `
      <img src="${video.thumb}" class="video-thumb">
      <h3>${video.title}</h3>
      <p class="uploaded-by">Uploaded by: ${video.uploader}</p>
      <video controls>
        <source src="${video.video}">
      </video>
    `;
    videosContainer.prepend(card);
  }

  // =========================
  // POPUP HANDLER
  // =========================
  loginBtn.addEventListener("click", () => {
    if(!isLogin) loginPopup.classList.remove("hidden");
    else userDropdown.classList.toggle("show");
  });

  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      loginPopup.classList.add("hidden");
      uploadPopup.classList.add("hidden");
    });
  });

  // =========================
  // LOGIN SYSTEM
  // =========================
  document.getElementById("doLogin").addEventListener("click", () => {
    const username = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPass").value;
    const found = accounts.find(acc => acc.username===username && acc.password===password);

    if(found){
      isLogin = true;
      currentUser = username;
      loginPopup.classList.add("hidden");
      loginBtn.textContent = `${currentUser} ▼`;
      userDropdown.classList.remove("hidden");
      alert(`Login berhasil sebagai ${currentUser}`);
    } else alert("Username/password salah!");
  });

  // =========================
  // LOGOUT
  // =========================
  doLogout.addEventListener("click", () => {
    isLogin = false;
    currentUser = null;
    userDropdown.classList.add("hidden");
    loginBtn.textContent = "Login";
    alert("Anda telah logout.");
  });

  // =========================
  // OPEN UPLOAD
  // =========================
  openUploadPopup.addEventListener("click", () => {
    if(!isLogin){ alert("Anda harus login dahulu!"); return; }
    uploadPopup.classList.remove("hidden");
  });

  // =========================
  // UPLOAD VIDEO
  // =========================
  const uploadBtn = document.getElementById("uploadBtn");
  uploadBtn.addEventListener("click", () => {
    const title = document.getElementById("videoTitle").value;
    const thumbnail = document.getElementById("thumbnailInput").files[0];
    const video = document.getElementById("videoInput").files[0];

    if(!title || !thumbnail || !video){ alert("Semua field wajib diisi!"); return; }

    const thumbReader = new FileReader();
    const videoReader = new FileReader();

    thumbReader.onload = () => {
      videoReader.onload = () => {
        const videoData = {
          title:title,
          thumb:thumbReader.result,
          video:videoReader.result,
          uploader:currentUser
        };

        // Simpan ke localStorage
        let data = JSON.parse(localStorage.getItem("videos") || "[]");
        data.push(videoData);
        localStorage.setItem("videos", JSON.stringify(data));

        addVideoCard(videoData);
        uploadPopup.classList.add("hidden");
        alert("Video berhasil diupload!");
      };
      videoReader.readAsDataURL(video);
    };
    thumbReader.readAsDataURL(thumbnail);
  });

  // Load video saat halaman dibuka
  loadVideos();
});