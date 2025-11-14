document.addEventListener("DOMContentLoaded", () => {

  // ===== ACCOUNTS =====
  const accounts = [
    { username:"admin", password:"admin123" },
    { username:"creator", password:"creator123" },
    { username:"user1", password:"pass1" }
  ];
  let isLogin = false;
  let currentUser = null;

  // ===== POPUPS =====
  const loginPopup = document.getElementById("loginPopup");
  const uploadPopup = document.getElementById("uploadPopup");

  const loginBtn = document.getElementById("loginBtn");
  const openUploadPopup = document.getElementById("openUploadPopup");

  const doLogin = document.getElementById("doLogin");
  const closeButtons = document.querySelectorAll(".closePopup");

  const uploadBtn = document.getElementById("uploadBtn");
  const videosContainer = document.getElementById("videosContainer");

  // Open login
  loginBtn.addEventListener("click", () => {
    loginPopup.classList.toggle("hidden");
  });

  // Open upload
  openUploadPopup.addEventListener("click", () => {
    if(!isLogin){
      alert("Login terlebih dahulu!");
      return;
    }
    uploadPopup.classList.remove("hidden");
  });

  // Close all popup
  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      loginPopup.classList.add("hidden");
      uploadPopup.classList.add("hidden");
    });
  });

  // LOGIN
  doLogin.addEventListener("click", () => {
    const user = document.getElementById("loginUser").value;
    const pass = document.getElementById("loginPass").value;
    const found = accounts.find(acc => acc.username === user && acc.password === pass);

    if(found){
      isLogin = true;
      currentUser = found.username;
      loginPopup.classList.add("hidden");
      loginBtn.textContent = currentUser + " (Account)";
      alert(`Login berhasil sebagai ${currentUser}!`);
    } else {
      alert("Username atau password salah!");
    }
  });

  // UPLOAD VIDEO
  uploadBtn.addEventListener("click", () => {
    const title = document.getElementById("videoTitle").value;
    const thumb = document.getElementById("thumbnailInput").files[0];
    const video = document.getElementById("videoInput").files[0];

    if(!title || !thumb || !video){
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
          <div class="play-overlay"></div>
          <div class="video-info">
            <h3>${title}</h3>
            <p>Uploaded by: ${currentUser}</p>
          </div>
          <video class="video-player" controls style="display:none;">
            <source src="${videoReader.result}">
          </video>
        `;

        const overlay = card.querySelector(".play-overlay");
        const videoEl = card.querySelector(".video-player");
        const thumbEl = card.querySelector(".video-thumb");

        overlay.addEventListener("click", () => {
          overlay.style.display = "none";
          thumbEl.style.display = "none";
          videoEl.style.display = "block";
          videoEl.play();
        });

        videosContainer.prepend(card);
        uploadPopup.classList.add("hidden");
        alert("Video berhasil diupload!");
      };
      videoReader.readAsDataURL(video);
    };
    thumbReader.readAsDataURL(thumb);
  });

});