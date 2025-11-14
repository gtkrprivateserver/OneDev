document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginPopup = document.getElementById("loginPopup");
  const closePopup = document.getElementById("closePopup");
  const doLogin = document.getElementById("doLogin");

  let isLogin = false;

  // OPEN LOGIN POPUP
  loginBtn.addEventListener("click", () => {
    loginPopup.classList.remove("hidden");
  });

  // CLOSE POPUP
  closePopup.addEventListener("click", () => {
    loginPopup.classList.add("hidden");
  });

  // LOGIN
  doLogin.addEventListener("click", () => {
    const user = document.getElementById("loginUser").value;
    const pass = document.getElementById("loginPass").value;

    if (user === "admin" && pass === "admin123") {
      isLogin = true;
      loginPopup.classList.add("hidden");
      loginBtn.classList.add("hidden");
      logoutBtn.classList.remove("hidden");
      alert("Login berhasil!");
    } else {
      alert("Username atau password salah!");
    }
  });

  // LOGOUT
  logoutBtn.addEventListener("click", () => {
    isLogin = false;
    logoutBtn.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    alert("Berhasil logout!");
  });

  // UPLOAD VIDEO
  const uploadBtn = document.getElementById("uploadBtn");
  const thumbnailInput = document.getElementById("thumbnailInput");
  const videoInput = document.getElementById("videoInput");
  const videosContainer = document.getElementById("videosContainer");

  uploadBtn.addEventListener("click", () => {
    if (!isLogin) {
      alert("Anda harus login dulu!");
      return;
    }

    const title = document.getElementById("videoTitle").value;
    const thumbnail = thumbnailInput.files[0];
    const video = videoInput.files[0];

    if (!title || !thumbnail || !video) {
      alert("Lengkapi semua field!");
      return;
    }

    const readerThumb = new FileReader();
    const readerVideo = new FileReader();

    readerThumb.onload = () => {
      readerVideo.onload = () => {
        const videoCard = document.createElement("div");
        videoCard.classList.add("video-card");

        videoCard.innerHTML = `
          <img src="${readerThumb.result}" class="video-thumb">

          <h3>${title}</h3>

          <video controls>
            <source src="${readerVideo.result}">
          </video>
        `;

        videosContainer.prepend(videoCard);
      };
      readerVideo.readAsDataURL(video);
    };

    readerThumb.readAsDataURL(thumbnail);

    alert("Video berhasil diupload!");
  });
});