document.addEventListener("DOMContentLoaded", () => {

  // ===== ACCOUNT =====
  const accounts = [
    {username:"admin", password:"admin123"},
    {username:"creator", password:"creator123"},
    {username:"user1", password:"pass1"}
  ];
  let isLogin = false;
  let currentUser = null;

  // ===== ELEMENTS =====
  const loginPopup = document.getElementById("loginPopup");
  const uploadPopup = document.getElementById("uploadPopup");
  const loginBtn = document.getElementById("loginBtn");
  const userDropdown = document.getElementById("userDropdown");
  const dropdownBtn = document.getElementById("dropdownBtn");
  const dropdownContent = userDropdown.querySelector(".dropdown-content");
  const doLogin = document.getElementById("doLogin");
  const doLogout = document.getElementById("doLogout");
  const openUploadPopup = document.getElementById("openUploadPopup");
  const closeButtons = document.querySelectorAll(".closePopup");
  const uploadBtn = document.getElementById("uploadBtn");
  const videosContainer = document.getElementById("videosContainer");

  // ===== POPUP HANDLER =====
  loginBtn.addEventListener("click", () => loginPopup.classList.remove("hidden"));
  openUploadPopup?.addEventListener("click", () => uploadPopup.classList.remove("hidden"));

  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      loginPopup.classList.add("hidden");
      uploadPopup.classList.add("hidden");
    });
  });

  // ===== LOGIN =====
  doLogin.addEventListener("click", () => {
    const user = document.getElementById("loginUser").value;
    const pass = document.getElementById("loginPass").value;
    const found = accounts.find(acc => acc.username===user && acc.password===pass);
    if(found){
      isLogin=true;
      currentUser=found.username;
      loginPopup.classList.add("hidden");
      loginBtn.classList.add("hidden");
      userDropdown.classList.remove("hidden");
      dropdownBtn.textContent = currentUser + " ▼";
      alert(`Login berhasil sebagai ${currentUser}`);
    } else alert("Username / Password salah!");
  });

  // ===== DROPDOWN =====
  dropdownBtn.addEventListener("click", () => {
    dropdownContent.classList.toggle("hidden");
  });

  // ===== LOGOUT =====
  doLogout.addEventListener("click", () => {
    isLogin=false;
    currentUser=null;
    userDropdown.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    dropdownContent.classList.add("hidden");
    alert("Anda telah logout");
  });

  // ===== UPLOAD VIDEO =====
  uploadBtn.addEventListener("click", () => {
    const title = document.getElementById("videoTitle").value;
    const thumbnail = document.getElementById("thumbnailInput").files[0];
    const video = document.getElementById("videoInput").files[0];

    if(!title || !thumbnail || !video){ alert("Semua field wajib diisi!"); return; }

    const thumbReader = new FileReader();
    const videoReader = new FileReader();

    thumbReader.onload = () => {
      videoReader.onload = () => {

        const card = document.createElement("div");
        card.classList.add("video-card");
        card.innerHTML = `
          <img src="${thumbReader.result}" class="video-thumb">
          <div class="play-overlay">▶</div>
          <video class="video-player" controls>
            <source src="${videoReader.result}">
          </video>
          <div class="video-info">
            <h3>${title}</h3>
            <p>Uploaded by: ${currentUser}</p>
          </div>
        `;

        videosContainer.prepend(card);

        // Play overlay
        const overlay = card.querySelector(".play-overlay");
        const videoEl = card.querySelector(".video-player");
        const thumbEl = card.querySelector(".video-thumb");

        overlay.addEventListener("click", () => {
          overlay.style.display = "none";
          thumbEl.style.display = "none";
          videoEl.style.display = "block";
          videoEl.play();
        });

        uploadPopup.classList.add("hidden");
        alert("Video berhasil diupload!");
      };
      videoReader.readAsDataURL(video);
    };
    thumbReader.readAsDataURL(thumbnail);
  });

});