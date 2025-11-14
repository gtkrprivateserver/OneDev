document.addEventListener("DOMContentLoaded", () => {
  const accounts = [
    { username: "admin", password: "admin123" },
    { username: "creator", password: "creator123" }
  ];

  let isLogin = false;
  let currentUser = null;

  const accountBtn = document.getElementById("accountBtn");
  const accountMenu = document.getElementById("accountMenu");

  const loginPopup = document.getElementById("loginPopup");
  const uploadPopup = document.getElementById("uploadPopup");

  const doLogin = document.getElementById("doLogin");
  const closeLoginPopup = document.getElementById("closeLoginPopup");
  const uploadBtn = document.getElementById("uploadBtn");

  const videosContainer = document.getElementById("videosContainer");
  const menuUpload = document.getElementById("menuUpload");
  const menuLogout = document.getElementById("menuLogout");

  // Toggle account menu dropdown
  accountBtn.addEventListener("click", () => {
    if(isLogin){
      accountMenu.classList.toggle("hidden");
    } else {
      loginPopup.classList.remove("hidden");
    }
  });

  closeLoginPopup.addEventListener("click", () => {
    loginPopup.classList.add("hidden");
  });

  // Login
  doLogin.addEventListener("click", () => {
    const user = document.getElementById("loginUser").value;
    const pass = document.getElementById("loginPass").value;

    const found = accounts.find(acc => acc.username === user && acc.password === pass);
    if(found){
      isLogin = true;
      currentUser = found.username;
      loginPopup.classList.add("hidden");
      accountBtn.textContent = currentUser;
      alert(`Login berhasil sebagai ${currentUser}`);
    } else {
      alert("Username atau password salah!");
    }
  });

  // Logout
  menuLogout.addEventListener("click", () => {
    isLogin = false;
    currentUser = null;
    accountBtn.textContent = "Login";
    accountMenu.classList.add("hidden");
    alert("Anda telah logout");
  });

  // Upload popup
  menuUpload.addEventListener("click", () => {
    if(!isLogin){
      alert("Login dulu!");
      return;
    }
    uploadPopup.classList.remove("hidden");
    accountMenu.classList.add("hidden");
  });

  document.querySelectorAll(".closePopup").forEach(btn => {
    btn.addEventListener("click", () => {
      uploadPopup.classList.add("hidden");
      loginPopup.classList.add("hidden");
    });
  });

  // Upload video
  uploadBtn.addEventListener("click", () => {
    const title = document.getElementById("videoTitle").value;
    const thumb = document.getElementById("thumbnailInput").files[0];
    const video = document.getElementById("videoInput").files[0];

    if(!title || !thumb || !video){
      alert("Semua field harus diisi!");
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
          <p>Uploaded by: ${currentUser}</p>
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
    thumbReader.readAsDataURL(thumb);
  });

  // Klik di luar dropdown untuk menutup
  document.addEventListener("click", (e) => {
    if(!accountBtn.contains(e.target) && !accountMenu.contains(e.target)){
      accountMenu.classList.add("hidden");
    }
  });
});