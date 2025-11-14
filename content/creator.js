document.addEventListener("DOMContentLoaded", () => {

  // ======= ACCOUNTS =======
  const accounts = [
    { username: "admin", password: "admin123" },
    { username: "creator", password: "creator123" }
  ];
  let isLogin = false;
  let currentUser = null;

  // ======= ELEMENTS =======
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

  // ======= LOAD VIDEOS DARI LOCALSTORAGE =======
  function loadVideos() {
    const videos = JSON.parse(localStorage.getItem("videos") || "[]");
    videosContainer.innerHTML = "";
    videos.forEach(v => {
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

  // ======= LOGIN =======
  loginBtn.addEventListener("click", () => {
    if (!isLogin) loginPopup.classList.remove("hidden");
  });

  doLogin.addEventListener("click", () => {
    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value.trim();
    const acc = accounts.find(a => a.username === username && a.password === password);

    if (acc) {
      isLogin = true;
      currentUser = acc.username;
      loginPopup.classList.add("hidden");
      loginBtn.classList.add("hidden");
      accountDropdown.classList.remove("hidden");
      accountBtn.textContent = currentUser + " ▼";
    } else {
      alert("Username atau password salah!");
    }
  });

  // ======= DROPDOWN =======
  accountBtn.addEventListener("click", () => {
    dropdownContent.classList.toggle("hidden");
  });

  // ======= LOGOUT =======
  logoutBtn.addEventListener("click", () => {
    isLogin = false;
    currentUser = null;
    accountDropdown.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    dropdownContent.classList.add("hidden");
  });

  // ======= OPEN UPLOAD POPUP =======
  openUpload.addEventListener("click", () => {
    if (!isLogin) return alert("Anda harus login terlebih dahulu!");
    uploadPopup.classList.remove("hidden");
    dropdownContent.classList.add("hidden");
  });

  // ======= CLOSE POPUPS =======
  closePopups.forEach(btn => {
    btn.addEventListener("click", () => {
      loginPopup.classList.add("hidden");
      uploadPopup.classList.add("hidden");
    });
  });

  // ======= UPLOAD VIDEO SESUAI CREATOR.CSS =======
  uploadVideoBtn.addEventListener("click", () => {
    const titleInput = document.getElementById("videoTitle");
    const thumbInput = document.getElementById("thumbnailInput");
    const videoInput = document.getElementById("videoInput");

    const title = titleInput.value.trim();
    const thumbFile = thumbInput.files[0];
    const videoFile = videoInput.files[0];

    if (!title || !thumbFile || !videoFile) return alert("Semua field wajib diisi!");

    // Gunakan FileReader
    const thumbReader = new FileReader();
    const videoReader = new FileReader();

    thumbReader.onload = () => {
      videoReader.onload = () => {
        const videoData = {
          title,
          thumb: thumbReader.result,
          video: videoReader.result,
          user: currentUser
        };

        // simpan ke localStorage
        const allVideos = JSON.parse(localStorage.getItem("videos") || "[]");
        allVideos.push(videoData);
        localStorage.setItem("videos", JSON.stringify(allVideos));

        // tampilkan card
        const card = document.createElement("div");
        card.classList.add("video-card");
        card.innerHTML = `
          <img src="${videoData.thumb}" class="video-thumb">
          <h3>${videoData.title}</h3>
          <p class="uploaded-by">Uploaded by: ${videoData.user}</p>
          <video controls>
            <source src="${videoData.video}">
          </video>
        `;
        videosContainer.prepend(card);

        uploadPopup.classList.add("hidden");

        // reset input
        titleInput.value = "";
        thumbInput.value = "";
        videoInput.value = "";

        alert("Video berhasil diupload!");
      };
      videoReader.readAsDataURL(videoFile);
    };
    thumbReader.readAsDataURL(thumbFile);
  });

});