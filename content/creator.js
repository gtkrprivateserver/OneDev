/* ======================================================
                LOGIN SYSTEM
======================================================*/
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginOverlay = document.getElementById("loginOverlay");
const submitLogin = document.getElementById("submitLogin");
const closeLoginPopup = document.getElementById("closeLoginPopup");

const dashboard = document.getElementById("dashboard");
const openUploadBtn = document.getElementById("openUploadBtn");

loginBtn.onclick = () => loginOverlay.style.display = "flex";
closeLoginPopup.onclick = () => loginOverlay.style.display = "none";

submitLogin.onclick = () => {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (user && pass) {
        loginOverlay.style.display = "none";
        dashboard.style.display = "block";
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
        openUploadBtn.style.display = "inline-block";
        localStorage.setItem("creator_login", "true");
    } else {
        alert("Isi semua field!");
    }
};

logoutBtn.onclick = () => {
    localStorage.removeItem("creator_login");
    dashboard.style.display = "none";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    openUploadBtn.style.display = "none";
};

/* Auto-login restore */
if (localStorage.getItem("creator_login") === "true") {
    dashboard.style.display = "block";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    openUploadBtn.style.display = "inline-block";
}

/* ======================================================
                UPLOAD VIDEO SYSTEM
======================================================*/
const uploadOverlay = document.getElementById("uploadOverlay");
const uploadForm = document.getElementById("uploadForm");
const videoList = document.getElementById("videoList");
const closeUploadPopup = document.getElementById("closeUploadPopup");

openUploadBtn.onclick = () => uploadOverlay.style.display = "flex";
closeUploadPopup.onclick = () => uploadOverlay.style.display = "none";

uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("videoTitle").value.trim();
    const thumbFile = document.getElementById("thumbFile").files[0];
    const videoFile = document.getElementById("videoFile").files[0];

    if (!title || !thumbFile || !videoFile) {
        alert("Harap isi semua field");
        return;
    }

    const readerThumb = new FileReader();
    const readerVideo = new FileReader();

    readerThumb.onload = (e1) => {
        const thumbURL = e1.target.result;

        readerVideo.onload = (e2) => {
            const videoURL = e2.target.result;

            const videoData = {
                id: Date.now(),
                title,
                thumbURL,
                videoURL,
                views: 0,
                likes: 0,
                comments: []
            };

            saveVideo(videoData);
            showVideo(videoData);

            uploadOverlay.style.display = "none";
            uploadForm.reset();
        };

        readerVideo.readAsDataURL(videoFile);
    };

    readerThumb.readAsDataURL(thumbFile);
});

/* ======================================================
               STORAGE SYSTEM
======================================================*/
function saveVideo(obj) {
    let data = JSON.parse(localStorage.getItem("videos") || "[]");
    data.push(obj);
    localStorage.setItem("videos", JSON.stringify(data));
}

function loadVideos() {
    let data = JSON.parse(localStorage.getItem("videos") || "[]");
    videoList.innerHTML = "";
    data.forEach(showVideo);
}

loadVideos();

/* ======================================================
               VIDEO LIST
======================================================*/
function showVideo(v) {
    const box = document.createElement("div");
    box.className = "creator-video-box";

    box.innerHTML = `
        <img src="${v.thumbURL}" class="creator-thumb" onclick="openPlayer(${v.id})">
        <h3>${v.title}</h3>
        <div class="stats">
            <span>${v.views}x ditonton</span>
            <span>${v.likes} like</span>
        </div>
    `;

    videoList.appendChild(box);
}

/* ======================================================
               VIDEO PLAYER
======================================================*/
const playerOverlay = document.getElementById("playerOverlay");
const playerVideo = document.getElementById("playerVideo");
const playerTitle = document.getElementById("playerTitle");
const playerStats = document.getElementById("playerStats");
const likeBtn = document.getElementById("likeBtn");
const closePlayer = document.getElementById("closePlayer");
const commentList = document.getElementById("commentList");
const commentInput = document.getElementById("commentInput");
const submitComment = document.getElementById("submitComment");

let currentVideo = null;

function openPlayer(id) {
    let videos = JSON.parse(localStorage.getItem("videos") || "[]");
    let v = videos.find(x => x.id === id);
    if (!v) return;

    currentVideo = v;
    v.views++;

    localStorage.setItem("videos", JSON.stringify(videos));

    playerVideo.src = v.videoURL;
    playerTitle.innerText = v.title;
    playerStats.innerHTML = `${v.views} views • ${v.likes} likes`;

    loadComments(v);
    playerOverlay.style.display = "flex";
}

closePlayer.onclick = () => {
    playerOverlay.style.display = "none";
    playerVideo.pause();
};

/* LIKE */
likeBtn.onclick = () => {
    let videos = JSON.parse(localStorage.getItem("videos") || "[]");
    let v = videos.find(x => x.id === currentVideo.id);
    if (!v) return;

    v.likes++;
    localStorage.setItem("videos", JSON.stringify(videos));

    playerStats.innerHTML = `${v.views} views • ${v.likes} likes`;
    loadVideos();
};

/* COMMENT */
submitComment.onclick = () => {
    const msg = commentInput.value.trim();
    if (!msg) return;

    let videos = JSON.parse(localStorage.getItem("videos") || "[]");
    let v = videos.find(x => x.id === currentVideo.id);

    v.comments.push(msg);
    localStorage.setItem("videos", JSON.stringify(videos));

    commentInput.value = "";
    loadComments(v);
};

function loadComments(v) {
    commentList.innerHTML = "";
    v.comments.forEach(c => {
        const p = document.createElement("p");
        p.innerText = c;
        commentList.appendChild(p);
    });
}