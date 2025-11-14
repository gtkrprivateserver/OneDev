document.addEventListener("DOMContentLoaded", () => {

  // ============================
  //  ACCOUNT LIST
  // ============================
  const accounts = [
    { username: "admin", password: "admin123" },
    { username: "creator", password: "creator123" },
    { username: "user1", password: "pass1" }
  ];

  let isLogin = false;
  let currentUser = null;


  // ============================
  //  ELEMENTS
  // ============================
  const loginPopup = document.getElementById("loginPopup");
  const logoutPopup = document.getElementById("logoutPopup");
  const uploadPopup = document.getElementById("uploadPopup");

  const loginBtn = document.getElementById("loginBtn");
  const openUploadPopup = document.getElementById("openUploadPopup");

  const doLogin = document.getElementById("doLogin");
  const doLogout = document.getElementById("doLogout");

  const closeButtons = document.querySelectorAll(".closePopup");

  const uploadBtn = document.getElementById("uploadBtn");
  const videosContainer = document.getElementById("videosContainer");


  // ============================
  //  LOGIN BUTTON HANDLER
  // ============================
  loginBtn.addEventListener("click", () => {
    if (isLogin) logoutPopup.classList.remove("hidden");
    else loginPopup.classList.remove("hidden");
  });


  // ============================
  //  OPEN UPLOAD POPUP
  // ============================
  openUploadPopup.addEventListener("click", () => {
    if (!isLogin) return alert("Anda harus login terlebih dahulu!");
    uploadPopup.classList.remove("hidden");
  });


  // ============================
  //  CLOSE POPUP (ALL)
  // ============================
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

    const found = accounts.find(acc => acc.username === user && acc.password === pass);

    if (!found) return alert("Username atau password salah!");

    isLogin = true;
    currentUser = found.username;

    loginBtn.textContent = `${currentUser} (Logout)`;
    loginPopup.classList.add("hidden");

    alert(`Login berhasil sebagai ${currentUser}!`);
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
  uploadBtn.addEventListener("click", () => {

    const title = document.getElementById("videoTitle").value;
    const thumbnail = document.getElementById("thumbnailInput").files[0];
    const video = document.getElementById("videoInput").files[0];

    if (!title || !thumbnail || !video)
      return alert("Semua field wajib diisi!");

    const thumbReader = new FileReader();
    const videoReader = new FileReader();

    thumbReader.onload = () => {

      videoReader.onload = () => {

        // CREATE VIDEO CARD
        const card = document.createElement("div");
        card.classList.add("video-card");

        card.innerHTML = `
          <img src="${thumbReader.result}" class="video-thumb">
          <h3>${title}</h3>
          <p class="uploaded-by">Uploaded by: ${currentUser}</p>

          <video controls controlsList="nodownload" oncontextmenu="return false;">
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