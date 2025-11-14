document.addEventListener("DOMContentLoaded", () => {
  const accounts = [
    {username:"admin", password:"admin123"},
    {username:"creator", password:"creator123"},
    {username:"user1", password:"pass1"}
  ];
  let isLogin = false;
  let currentUser = null;

  const loginBtn = document.getElementById("loginBtn");
  const accountDropdown = document.getElementById("accountDropdown");
  const dropdownContent = accountDropdown.querySelector(".dropdown-content");
  const loginPopup = document.getElementById("loginPopup");
  const uploadPopup = document.getElementById("uploadPopup");
  const videosContainer = document.getElementById("videosContainer");

  const closeButtons = document.querySelectorAll(".closePopup");
  const doLogin = document.getElementById("doLogin");
  const logoutBtn = document.getElementById("logoutBtn");
  const openUpload = document.getElementById("openUpload");
  const uploadBtn = document.getElementById("uploadBtn");

  // LOAD VIDEO STORAGE
  let videos = JSON.parse(localStorage.getItem("videos") || "[]");
  function renderVideos() {
    videosContainer.innerHTML = "";
    videos.forEach(v=>{
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
      videosContainer.appendChild(card);
    });
  }
  renderVideos();

  // LOGIN BUTTON CLICK
  loginBtn.addEventListener("click", ()=>{
    if(isLogin){
      dropdownContent.classList.toggle("hidden");
    } else {
      loginPopup.classList.remove("hidden");
    }
  });

  // CLOSE POPUP
  closeButtons.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      loginPopup.classList.add("hidden");
      uploadPopup.classList.add("hidden");
    });
  });

  // LOGIN SYSTEM
  doLogin.addEventListener("click", ()=>{
    const user = document.getElementById("loginUser").value;
    const pass = document.getElementById("loginPass").value;
    const found = accounts.find(a=>a.username===user && a.password===pass);
    if(found){
      isLogin=true;
      currentUser = user;
      loginPopup.classList.add("hidden");
      loginBtn.classList.add("hidden");
      accountDropdown.classList.remove("hidden");
      dropdownContent.classList.add("hidden");
      alert("Login berhasil: "+currentUser);
    } else alert("Username/password salah!");
  });

  // LOGOUT
  logoutBtn.addEventListener("click", ()=>{
    isLogin=false;
    currentUser=null;
    accountDropdown.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    alert("Logout berhasil!");
  });

  // OPEN UPLOAD
  openUpload.addEventListener("click", ()=>{
    if(!isLogin){ alert("Login dulu!"); return;}
    uploadPopup.classList.remove("hidden");
  });

  // UPLOAD VIDEO
  uploadBtn.addEventListener("click", ()=>{
    const title = document.getElementById("videoTitle").value;
    const thumbFile = document.getElementById("thumbnailInput").files[0];
    const videoFile = document.getElementById("videoInput").files[0];
    if(!title || !thumbFile || !videoFile){ alert("Semua field wajib!"); return; }

    const readerThumb = new FileReader();
    const readerVideo = new FileReader();

    readerThumb.onload=()=>{
      readerVideo.onload=()=>{
        videos.unshift({
          title:title,
          thumb:readerThumb.result,
          video:readerVideo.result,
          user:currentUser
        });
        localStorage.setItem("videos", JSON.stringify(videos));
        renderVideos();
        uploadPopup.classList.add("hidden");
        alert("Video berhasil diupload!");
      };
      readerVideo.readAsDataURL(videoFile);
    };
    readerThumb.readAsDataURL(thumbFile);
  });
});