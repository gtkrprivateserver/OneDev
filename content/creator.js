document.addEventListener("DOMContentLoaded", () => {
  // === Account Config ===
  const accounts = [
    { username: "admin", password: "admin123" },
    { username: "creator", password: "creator123" }
  ];

  let isLogin = false;
  let currentUser = null;

  // === DOM Elements ===
  const loginBtn = document.getElementById("loginBtn");
  const accountDropdown = document.getElementById("accountDropdown");
  const dropdownBtn = accountDropdown.querySelector("button");
  const dropdownContent = accountDropdown.querySelector(".dropdown-content");

  const loginPopup = document.getElementById("loginPopup");
  const uploadPopup = document.getElementById("uploadPopup");

  const doLogin = document.getElementById("doLogin");
  const logoutBtn = document.getElementById("logoutBtn");
  const openUpload = document.getElementById("openUpload");
  const doUpload = document.getElementById("doUpload");

  const closeButtons = document.querySelectorAll(".closePopup");
  const videoGrid = document.getElementById("videoGrid");

  // === Popup Handlers ===
  loginBtn.addEventListener("click", () => loginPopup.classList.remove("hidden"));

  dropdownBtn.addEventListener("click", () => {
    dropdownContent.classList.toggle("hidden");
  });

  openUpload.addEventListener("click", () => uploadPopup.classList.remove("hidden"));

  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      loginPopup.classList.add("hidden");
      uploadPopup.classList.add("hidden");
      dropdownContent.classList.add("hidden");
    });
  });

  // === Login System ===
  doLogin.addEventListener("click", () => {
    const user = document.getElementById("loginUser").value;
    const pass = document.getElementById("loginPass").value;

    const account = accounts.find(a => a.username === user && a.password === pass);
    if(account){
      isLogin = true;
      currentUser = user;
      loginPopup.classList.add("hidden");
      loginBtn.classList.add("hidden");
      accountDropdown.classList.remove("hidden");
      localStorage.setItem("creator_login", "true");
      localStorage.setItem("creator_user", currentUser);
      loadVideos();
      alert(`Login berhasil sebagai ${currentUser}`);
    } else alert("Username / Password salah!");
  });

  // === Logout System ===
  logoutBtn.addEventListener("click", () => {
    isLogin = false;
    currentUser = null;
    accountDropdown.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    localStorage.removeItem("creator_login");
    localStorage.removeItem("creator_user");
    alert("Anda telah logout");
  });

  // === Upload Video ===
  doUpload.addEventListener("click", () => {
    const title = document.getElementById("videoTitle").value;
    const thumbFile = document.getElementById("videoThumb").files[0];
    const videoFile = document.getElementById("videoFile").files[0];

    if(!title || !thumbFile || !videoFile){
      alert("Semua field wajib diisi!");
      return;
    }

    const thumbReader = new FileReader();
    const videoReader = new FileReader();

    thumbReader.onload = () => {
      videoReader.onload = () => {
        const videoData = {
          id: Date.now(),
          title,
          thumb: thumbReader.result,
          src: videoReader.result,
          uploader: currentUser
        };
        saveVideo(videoData);
        renderVideo(videoData);
        uploadPopup.classList.add("hidden");
      };
      videoReader.readAsDataURL(videoFile);
    };
    thumbReader.readAsDataURL(thumbFile);
  });

  // === Video Storage ===
  function saveVideo(data){
    const videos = JSON.parse(localStorage.getItem("creator_videos")||"[]");
    videos.push(data);
    localStorage.setItem("creator_videos", JSON.stringify(videos));
  }

  function loadVideos(){
    videoGrid.innerHTML = "";
    const videos = JSON.parse(localStorage.getItem("creator_videos")||"[]");
    videos.forEach(v => renderVideo(v));
  }

  function renderVideo(v){
    const card = document.createElement("div");
    card.classList.add("video-card");
    card.innerHTML = `
      <img src="${v.thumb}" class="video-thumb">
      <h3>${v.title}</h3>
      <p class="uploader">Uploaded by: ${v.uploader}</p>
      <video controls>
        <source src="${v.src}">
      </video>
    `;
    videoGrid.prepend(card);
  }

  // === Restore Login on Reload ===
  if(localStorage.getItem("creator_login") === "true"){
    isLogin = true;
    currentUser = localStorage.getItem("creator_user");
    loginBtn.classList.add("hidden");
    accountDropdown.classList.remove("hidden");
    loadVideos();
  }
});