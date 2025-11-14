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
  //  POPUP HANDLER
  // ============================
  const loginPopup = document.getElementById("loginPopup");
  const logoutPopup = document.getElementById("logoutPopup");
  const uploadPopup = document.getElementById("uploadPopup");

  const loginBtn = document.getElementById("loginBtn");
  const openUploadPopup = document.getElementById("openUploadPopup");

  const doLogin = document.getElementById("doLogin");
  const doLogout = document.getElementById("doLogout");

  const closeButtons = document.querySelectorAll(".closePopup");


  // OPEN LOGIN POPUP
  loginBtn.addEventListener("click", () => {
    if (isLogin) {
      logoutPopup.classList.remove("hidden");
    } else {
      loginPopup.classList.remove("hidden");
    }
  });

  // OPEN UPLOAD POPUP
  openUploadPopup.addEventListener("click", () => {
    if (!isLogin) {
      alert("Anda harus login terlebih dahulu!");
      return;
    }
    uploadPopup.classList.remove("hidden");
  });

  // CLOSE POPUP
  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      loginPopup.classList.add("hidden");
      logoutPopup.classList.add("hidden");
      uploadPopup.classList.add("hidden");
    });
  });


  // ============================
  //  LOGIN SYSTEM
  // ============================
  doLogin.addEventListener("click", () => {
    const user = document.getElementById("loginUser").value;
    const pass = document.getElementById("loginPass").value;

    const found = accounts.find(acc =>
      acc.username === user && acc.password === pass
    );

    if (found) {
      isLogin = true;
      currentUser = found.username;

      loginPopup.classList.add("hidden");
      loginBtn.textContent = currentUser + " (Logout)";

      alert(`Login berhasil sebagai ${currentUser}!`);
    } else {
      alert("Username atau password salah!");
    }
  });


  // ============================
  //  LOGOUT SYSTEM
  // ============================
  doLogout.addEventListener("click", () => {
    isLogin = false;
    currentUser = null;

    logoutPopup.classList.add("hidden");
    loginBtn.textContent = "Login";

    alert("Anda telah logout.");
  });


  // ============================
  //  UPLOAD VIDEO SYSTEM
  // ============================
  const uploadBtn = document.getElementById("uploadBtn");
  const videosContainer = document.getElementById("videosContainer");

  uploadBtn.addEventListener("click", () => {

    const title = document.getElementById("videoTitle").value;
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

        const card = document.createElement("div");
        card.classList.add("video-card");

        card.innerHTML = `
          <img src="${thumbReader.result}" class="video-thumb">
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

});