// app.js (module) — improved + safer
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// ---------- CONFIG (keep yours) ----------
const firebaseConfig = {
  apiKey: "AIzaSyApvgdc7yr44Lsk11ZiM6PHNMQPxwHM_nc",
  authDomain: "smartnoteorganizer-2025.firebaseapp.com",
  databaseURL: "https://smartnoteorganizer-2025-default-rtdb.firebaseio.com",
  projectId: "smartnoteorganizer-2025",
  storageBucket: "smartnoteorganizer-2025.firebasestorage.app",
  messagingSenderId: "927700094333",
  appId: "1:927700094333:web:9bc21ca431a66e29b15014",
  measurementId: "G-71MJ013XTK",
};

// initialize
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const notesRefRoot = ref(db, "notes");

// ---------- DOM (guard against missing elements) ----------
const noteForm = document.getElementById("noteForm");
const titleEl = document.getElementById("title");
const descEl = document.getElementById("description");
const keynoteEl = document.getElementById("keynote");
const dateEl = document.getElementById("date");
const subjectEl = document.getElementById("subject");
const noteIdEl = document.getElementById("noteId");
const notesList = document.getElementById("notesList");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const searchEl = document.getElementById("search");

if (!noteForm || !titleEl || !descEl || !notesList) {
  console.error(
    'Required DOM elements not found. Make sure app.js is loaded after the HTML elements (e.g. put <script type="module" src="app.js"></script> before </body>).'
  );
}

// local cache
let notesCache = {};

// ---------- Create, Read, Update, Delete ----------

async function saveNote(e) {
  if (e) e.preventDefault();
  try {
    const existingId = noteIdEl?.value?.trim();
    // build note object (use null for empty date/subject)
    const note = {
      noteId: existingId || null,
      title: titleEl?.value?.trim() || "",
      description: descEl?.value?.trim() || "",
      keynote: keynoteEl?.value?.trim() || "",
      date: dateEl?.value || null,
      subject: subjectEl?.value?.trim() || null,
    };

    if (existingId) {
      // updating existing note
      note.noteId = existingId;
      await set(ref(db, `notes/${existingId}`), note);
      console.info("Note updated:", existingId);
    } else {
      // creating new note - use push() returned ref to get a stable key
      const newRef = push(notesRefRoot);
      note.noteId = newRef.key;
      await set(newRef, note);
      console.info("Note created:", newRef.key);
    }

    resetForm();
  } catch (err) {
    console.error("Error saving note:", err);
    alert("Failed to save note. See console for details.");
  }
}

async function deleteNote(noteId) {
  try {
    if (!noteId) return;
    const ok = confirm("Delete this note?");
    if (!ok) return;
    await remove(ref(db, `notes/${noteId}`));
    console.info("Deleted note:", noteId);
  } catch (err) {
    console.error("Error deleting note:", err);
    alert("Failed to delete note. See console for details.");
  }
}

function editNote(note) {
  if (!note) return;
  noteIdEl.value = note.noteId || "";
  titleEl.value = note.title || "";
  descEl.value = note.description || "";
  keynoteEl.value = note.keynote || "";
  dateEl.value = note.date || "";
  subjectEl.value = note.subject || "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function updateNote(noteId, changes) {
  try {
    if (!noteId) throw new Error("Missing noteId for update");
    await update(ref(db, `notes/${noteId}`), changes);
    console.info("Updated note fields:", noteId, changes);
  } catch (err) {
    console.error("Error updating note:", err);
  }
}

function resetForm() {
  if (!noteForm) return;
  noteIdEl.value = "";
  noteForm.reset();
}

// ---------- UI helpers ----------

function makeNoteCard(note) {
  const div = document.createElement("div");
  div.className = "note-card";

  const meta = document.createElement("div");
  meta.className = "note-meta";
  meta.innerHTML = `<div>${note.subject || ""}</div><div>${
    note.date || ""
  }</div>`;

  const title = document.createElement("div");
  title.className = "note-title";
  title.textContent = note.title || "(no title)";

  const keynote = document.createElement("div");
  if (note.keynote) {
    keynote.className = "note-keynote";
    keynote.textContent = note.keynote;
  }

  const desc = document.createElement("div");
  desc.className = "note-desc";
  desc.textContent = note.description || "";

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "small-btn";
  editBtn.textContent = "Edit";
  editBtn.onclick = () => editNote(note);

  const delBtn = document.createElement("button");
  delBtn.className = "small-btn";
  delBtn.textContent = "Delete";
  delBtn.onclick = () => deleteNote(note.noteId);

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  div.appendChild(meta);
  div.appendChild(title);
  if (note.keynote) div.appendChild(keynote);
  div.appendChild(desc);
  div.appendChild(actions);

  return div;
}

function renderNotes(filter = "") {
  if (!notesList) return;
  notesList.innerHTML = "";
  const notesArr = Object.values(notesCache || {})
    .filter(
      (n) =>
        !filter ||
        (n.title && n.title.toLowerCase().includes(filter)) ||
        (n.subject && n.subject.toLowerCase().includes(filter))
    )
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  if (notesArr.length === 0) {
    notesList.innerHTML = '<p style="color:var(--muted)">No notes yet.</p>';
    return;
  }

  for (const n of notesArr) {
    notesList.appendChild(makeNoteCard(n));
  }
}

// ---------- Realtime listener ----------
try {
  onValue(notesRefRoot, (snapshot) => {
    const val = snapshot.val() || {};
    notesCache = val;
    renderNotes(searchEl?.value?.trim().toLowerCase() || "");
  });
} catch (err) {
  console.error("Realtime DB listener error:", err);
}

// ---------- Events ----------
if (noteForm) noteForm.addEventListener("submit", saveNote);
if (cancelBtn) cancelBtn.addEventListener("click", resetForm);
if (searchEl)
  searchEl.addEventListener("input", (e) =>
    renderNotes(e.target.value.trim().toLowerCase())
  );

// optional debug access
window._notesCache = notesCache;
window._saveNote = saveNote;
window._deleteNote = deleteNote;
