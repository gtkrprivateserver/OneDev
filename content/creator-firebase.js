// creator-firebase.js (type="module")
import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore, collection, addDoc, serverTimestamp,
  onSnapshot, doc, updateDoc, increment, runTransaction, query, orderBy, limit
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import {
  getStorage, ref as sref, uploadBytesResumable, getDownloadURL
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';

// init firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const openUploadBtn = document.getElementById("openUploadBtn");
const loginOverlay = document.getElementById("loginOverlay");
const uploadOverlay = document.getElementById("uploadOverlay");
const submitLogin = document.getElementById("submitLogin");
const closeLoginPopup = document.getElementById("closeLoginPopup");
const closeUploadPopup = document.getElementById("closeUploadPopup");
const uploadForm = document.getElementById("uploadForm");
const videoList = document.getElementById("videoList");

// player elements
const playerOverlay = document.getElementById("playerOverlay");
const playerVideo = document.getElementById("playerVideo");
const playerTitle = document.getElementById("playerTitle");
const playerClose = document.getElementById("playerClose");
const likeBtn = document.getElementById("likeBtn");
const likeCountEl = document.getElementById("likeCount");
const viewCountEl = document.getElementById("viewCount");
const commentsList = document.getElementById("commentsList");
const commentForm = document.getElementById("commentForm");
const commentAuthor = document.getElementById("commentAuthor");
const commentText = document.getElementById("commentText");

let currentUser = null; // display name used for uploads & comments
let currentVideoDocId = null;
let hasIncrementedViewThisSession = {}; // track per video per session

// simple login (no backend): store display name in localStorage
loginBtn.onclick = () => loginOverlay.style.display = "flex";
closeLoginPopup.onclick = () => loginOverlay.style.display = "none";
submitLogin.onclick = () => {
  const user = document.getElementById("username").value.trim();
  if (!user) { alert("Masukkan nama tampil."); return; }
  currentUser = user;
  localStorage.setItem("oneDev_creatorName", user);
  loginOverlay.style.display = "none";
  loginBtn.style.display = "none";
  logoutBtn.style.display = "inline-block";
  openUploadBtn.style.display = "inline-block";
};

// logout
logoutBtn.onclick = () => {
  currentUser = null;
  localStorage.removeItem("oneDev_creatorName");
  loginBtn.style.display = "inline-block";
  logoutBtn.style.display = "none";
  openUploadBtn.style.display = "none";
};

// upload popup
openUploadBtn.onclick = () => uploadOverlay.style.display = "flex";
closeUploadPopup.onclick = () => uploadOverlay.style.display = "none";

// initialize from localStorage if present
const saved = localStorage.getItem("oneDev_creatorName");
if (saved) {
  currentUser = saved;
  loginBtn.style.display = "none";
  logoutBtn.style.display = "inline-block";
  openUploadBtn.style.display = "inline-block";
}

// upload handler
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) { alert("Silakan login terlebih dulu."); return; }

  const title = document.getElementById("videoTitle").value.trim();
  const thumbFile = document.getElementById("videoThumbnail").files[0];
  const videoFile = document.getElementById("videoFile").files[0];

  if (!title || !thumbFile || !videoFile) { alert("Lengkapi semua input."); return; }

  // simple UI feedback
  const uploadBtn = uploadForm.querySelector("button[type='submit']");
  uploadBtn.disabled = true;
  uploadBtn.textContent = "Uploading...";

  try {
    // 1) upload thumbnail
    const thumbRef = sref(storage, `thumbnails/${Date.now()}_${thumbFile.name}`);
    await uploadBytesResumable(thumbRef, thumbFile);
    const thumbURL = await getDownloadURL(thumbRef);

    // 2) upload video (put as resumable)
    const vidRef = sref(storage, `videos/${Date.now()}_${videoFile.name}`);
    await uploadBytesResumable(vidRef, videoFile);
    const vidURL = await getDownloadURL(vidRef);

    // 3) add metadata to Firestore
    const docRef = await addDoc(collection(db, "videos"), {
      title,
      thumbnailURL: thumbURL,
      videoURL: vidURL,
      uploader: currentUser,
      likes: 0,
      views: 0,
      createdAt: serverTimestamp()
    });

    uploadForm.reset();
    uploadOverlay.style.display = "none";
    alert("Upload sukses — video akan tampil publik.");
  } catch (err) {
    console.error(err);
    alert("Upload gagal: " + err.message);
  } finally {
    uploadBtn.disabled = false;
    uploadBtn.textContent = "Upload";
  }
});

// realtime listener: render videos (ordered by createdAt desc)
const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
  videoList.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const id = docSnap.id;

    // create card
    const card = document.createElement("div");
    card.className = "creator-video-box";
    card.innerHTML = `
      <img class="creator-thumb" src="${data.thumbnailURL}" data-id="${id}" alt="${data.title}">
      <h3>${data.title}</h3>
      <div class="stats">
        <div>By: ${data.uploader || "Unknown"}</div>
        <div>💙 <span class="likes">${data.likes || 0}</span> • 👁️ <span class="views">${data.views || 0}</span></div>
      </div>
    `;
    videoList.appendChild(card);

    // click thumbnail to open player
    card.querySelector('.creator-thumb').addEventListener('click', () => openPlayer(id, data));
  });
});

// open player: set video src, title, load comments, set like/view
async function openPlayer(docId, data) {
  currentVideoDocId = docId;
  playerVideo.src = data.videoURL;
  playerTitle.textContent = data.title;
  likeCountEl.textContent = data.likes || 0;
  viewCountEl.textContent = data.views || 0;
  commentsList.innerHTML = "";

  playerOverlay.style.display = "flex";

  // increment view once per session for this video
  if (!hasIncrementedViewThisSession[docId]) {
    try {
      const videoRef = doc(db, "videos", docId);
      await runTransaction(db, async (tx) => {
        const vd = await tx.get(videoRef);
        if (!vd.exists()) return;
        const current = vd.data().views || 0;
        tx.update(videoRef, { views: current + 1 });
      });
      hasIncrementedViewThisSession[docId] = true;
    } catch (err) {
      console.error("View increment error:", err);
    }
  }

  // get live likes & views (listener)
  const videoDocRef = doc(db, "videos", docId);
  // small onSnapshot to update counts
  const unsub = onSnapshot(videoDocRef, snap => {
    if (!snap.exists()) return;
    const d = snap.data();
    likeCountEl.textContent = d.likes || 0;
    viewCountEl.textContent = d.views || 0;
  });

  // Comments: realtime listener on subcollection "comments"
  const commentsCol = collection(db, "videos", docId, "comments");
  const qComments = query(commentsCol, orderBy("createdAt", "asc"));
  const unsubComments = onSnapshot(qComments, snap => {
    commentsList.innerHTML = "";
    snap.forEach(c => {
      const cd = c.data();
      const el = document.createElement("div");
      el.style.padding = "6px 0";
      el.innerHTML = `<strong style="color:#00b4d8;">${cd.author}</strong> <span style="color:#bfc8cc; font-size:13px;">${cd.message}</span>`;
      commentsList.appendChild(el);
    });
  });

  // when player closed we should unsubscribe these listeners
  playerOverlay.dataset.unsub = JSON.stringify({}); // placeholder — we'll handle unsub on close
  playerOverlay._unsubListeners = [unsub, unsubComments];
}

// like button
likeBtn.addEventListener("click", async () => {
  if (!currentVideoDocId) return;
  const videoRef = doc(db, "videos", currentVideoDocId);
  try {
    await runTransaction(db, async (tx) => {
      const vd = await tx.get(videoRef);
      if (!vd.exists()) throw "Video not found";
      const cur = vd.data().likes || 0;
      tx.update(videoRef, { likes: cur + 1 });
    });
  } catch (err) {
    console.error("like error", err);
  }
});

// comments submit
commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentVideoDocId) return;
  const author = commentAuthor.value.trim() || currentUser || "Anon";
  const message = commentText.value.trim();
  if (!message) return;
  try {
    await addDoc(collection(db, "videos", currentVideoDocId, "comments"), {
      author,
      message,
      createdAt: serverTimestamp()
    });
    commentText.value = "";
  } catch (err) {
    console.error("comment error", err);
  }
});

// close player
document.getElementById("playerClose").addEventListener("click", () => {
  playerOverlay.style.display = "none";
  playerVideo.pause();
  playerVideo.src = "";
  // unsubscribe listeners if any
  const listeners = playerOverlay._unsubListeners || [];
  listeners.forEach(fn => {
    try { fn(); } catch(e) {}
  });
  playerOverlay._unsubListeners = [];
});

// small helper: addDoc import used above, ensure it's present
import { addDoc, collection as collectionRef, serverTimestamp as serverTs } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

// make sure comment form inputs exist (some browsers)
if (!commentAuthor || !commentText) {
  // create fallback in DOM if missing
  console.warn("comment inputs not found");
}