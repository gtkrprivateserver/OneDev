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
  const currentUserSpan = document.getElementById("currentUser");

  const doLogin = document.getElementById("doLogin");
  const doLogout = document.getElementById("doLogout");
  const openUploadPopup = document.getElementById("openUploadPopup");
  const closeButtons = document.querySelectorAll(".closePopup");

  const uploadBtn = document.getElementById("uploadBtn");
  const videosContainer = document.getElementById("videosContainer");

  // Load videos from localStorage
  function loadVideos() {
    let data = JSON.parse(localStorage.getItem("videos") || "[]");
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

  // Popup close
  closeButtons.forEach(btn => btn.addEventListener("click", () => {
    loginPopup.classList.add("hidden");
    uploadPopup.classList.add("hidden");
  }));

  // Login button
  loginBtn.addEventListener("click", () => {
    if(isLogin){
      accountDropdown.classList.toggle("hidden");
    } else {
      loginPopup.classList.remove("hidden");
    }
  });

  doLogin.addEventListener("click", () => {
    const user = document.getElementById("loginUser").value;
    const pass = document.getElementById("loginPass").value;
    const found = accounts.find(acc => acc.username===user && acc.password===pass);

    if(found){
      isLogin = true;
      currentUser = found.username;
      loginPopup.classList.add("hidden");
      currentUserSpan.textContent = currentUser;
      accountDropdown.classList.remove("hidden");
    } else {
      alert("Username atau password salah!");
    }
  });

  doLogout.addEventListener("click", () => {
    isLogin = false;
    currentUser = null;
    accountDropdown.classList.add("hidden");
  });

  openUploadPopup.addEventListener("click", () => {
    if(!isLogin){
      alert("Login terlebih dahulu!");
      return;
    }
    uploadPopup.classList.remove("hidden");
  });

  uploadBtn.addEventListener("click", () => {
    const title = document.getElementById("videoTitle").value;
    const thumbFile = document.getElementById("thumbnailInput").files[0];
    const videoFile = document.getElementById("videoInput").files[0];

    if(!title || !thumbFile || !videoFile){
      alert("Semua field wajib diisi!");
      return;
    }

    const thumbReader = new FileReader();
    const videoReader = new FileReader();

    thumbReader.onload = () => {
      videoReader.onload = () => {
        let videos = JSON.parse(localStorage.getItem("videos")||"[]");
        videos.push({
          title,
          thumb: thumbReader.result,
          video: videoReader.result,
          user: currentUser
        });
        localStorage.setItem("videos", JSON.stringify(videos));
        loadVideos();
        uploadPopup.classList.add("hidden");
      };
      videoReader.readAsDataURL(videoFile);
    };
    thumbReader.readAsDataURL(thumbFile);
  });
});