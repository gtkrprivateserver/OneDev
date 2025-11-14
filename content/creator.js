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
  const uploadPopup = document.getElementById("uploadPopup");
  const loginBtn = document.getElementById("loginBtn");
  const openUploadPopup = document.getElementById("openUploadPopup");
  const doLogin = document.getElementById("doLogin");
  const closeLogin = document.getElementById("closePopup");
  const uploadBtn = document.getElementById("uploadBtn");
  const videosContainer = document.getElementById("videosContainer");

  // ============================
  //  VIDEO PLAYER ELEMENTS
  // ============================
  const playerOverlay = document.getElementById("playerOverlay");
  const playerVideo = document.getElementById("playerVideo");
  const playerTitle = document.getElementById("playerTitle");
  const playerViews = document.getElementById("playerViews");
  const playerLikes = document.getElementById("playerLikes");
  const likeBtn = document.getElementById("likeBtn");
  const closePlayer = document.getElementById("closePlayer");
  const commentList = document.getElementById("commentList");
  const commentInput = document.getElementById("commentInput");
  const submitComment = document.getElementById("submitComment");

  let currentVideoData = null;
  let videosData = JSON.parse(localStorage.getItem("videos") || "[]");

  // ============================
  //  LOGIN / LOGOUT
  // ============================
  loginBtn.addEventListener("click", () => {
    if (isLogin) {
      if (confirm("Apakah ingin logout?")) {
        isLogin = false;
        currentUser = null;
        loginBtn.textContent = "Login";
        alert("Logout berhasil!");
      }
    } else {
      loginPopup.classList.remove("hidden");
    }
  });

  doLogin.addEventListener("click", () => {
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value.trim();

    const found = accounts.find(acc => acc.username === user && acc.password === pass);

    if (found) {
      isLogin = true;
      currentUser = found.username;
      loginPopup.classList.add("hidden");
      loginBtn.textContent = `${currentUser} (Logout)`;
      alert(`Login berhasil sebagai ${currentUser}!`);
    } else {
      alert("Username atau password salah!");
    }
  });

  closeLogin.addEventListener("click", () => {
    loginPopup.classList.add("hidden");
  });

  // ============================
  //  OPEN UPLOAD POPUP
  // ============================
  openUploadPopup.addEventListener("click", () => {
    if (!isLogin) {
      alert("Anda harus login terlebih dahulu!");
      return;
    }
    uploadPopup.classList.remove("hidden");
  });

  // ============================
  //  UPLOAD VIDEO
  // ============================
  uploadBtn.addEventListener("click", () => {
    const title = document.getElementById("videoTitle").value.trim();
    const thumbnail = document.getElementById("thumbnailInput").files[0];
    const video = document.getElementById("videoInput").files[0];

    if (!title || !thumbnail || !video) {
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
          uploader: currentUser,
          thumbURL: thumbReader.result,
          videoURL: videoReader.result,
          views: 0,
          likes: 0,
          comments: []
        };

        videosData.unshift(videoData);
        localStorage.setItem("videos", JSON.stringify(videosData));
        renderVideoCard(videoData);

        uploadPopup.classList.add("hidden");
        alert("Video berhasil diupload!");
      };

      videoReader.readAsDataURL(video);
    };

    thumbReader.readAsDataURL(thumbnail);
  });

  // ============================
  //  RENDER VIDEO CARD
  // ============================
  function renderVideoCard(v) {
    const card = document.createElement("div");
    card.classList.add("video-card");
    card.dataset.id = v.id;

    card.innerHTML = `
      <img src="${v.thumbURL}" class="video-thumb">
      <h3>${v.title}</h3>
      <p class="uploaded-by">Uploaded by: ${v.uploader}</p>
      <video controls controlsList="nodownload" oncontextmenu="return false;">
        <source src="${v.videoURL}">
      </video>
    `;

    videosContainer.prepend(card);
  }

  // LOAD EXISTING VIDEOS
  videosData.forEach(renderVideoCard);

  // ============================
  //  VIDEO PLAYER POPUP
  // ============================
  videosContainer.addEventListener("click", e => {
    const card = e.target.closest(".video-card");
    if (!card) return;

    const videoElem = card.querySelector("video");
    const titleElem = card.querySelector("h3");
    const uploaderElem = card.querySelector(".uploaded-by");

    const videoData = videosData.find(v => v.id == card.dataset.id);
    if (!videoData) return;

    currentVideoData = videoData;

    playerVideo.src = videoData.videoURL;
    playerTitle.textContent = videoData.title;
    playerViews.textContent = `Views: ${videoData.views}`;
    playerLikes.textContent = `Likes: ${videoData.likes}`;

    videoData.views++;
    localStorage.setItem("videos", JSON.stringify(videosData));
    playerOverlay.classList.remove("hidden");
    playerVideo.play();

    renderComments(videoData);
  });

  closePlayer.addEventListener("click", () => {
    playerOverlay.classList.add("hidden");
    playerVideo.pause();
  });

  // LIKE VIDEO
  likeBtn.addEventListener("click", () => {
    if (!currentVideoData) return;
    currentVideoData.likes++;
    playerLikes.textContent = `Likes: ${currentVideoData.likes}`;
    localStorage.setItem("videos", JSON.stringify(videosData));
  });

  // COMMENTS
  submitComment.addEventListener("click", () => {
    if (!currentVideoData) return;
    const comment = commentInput.value.trim();
    if (!comment) return;

    currentVideoData.comments.push(comment);
    localStorage.setItem("videos", JSON.stringify(videosData));
    commentInput.value = "";
    renderComments(currentVideoData);
  });

  function renderComments(video) {
    commentList.innerHTML = "";
    video.comments.forEach(c => {
      const p = document.createElement("p");
      p.textContent = c;
      commentList.appendChild(p);
    });
  }

});