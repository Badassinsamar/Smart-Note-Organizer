// app.js (module)
// IMPORTANT: Replace the firebaseConfig object with your own project's config

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

// ---------- CONFIG ----------
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

// ---------- DOM ----------
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

// local cache
let notesCache = {};

// ---------- Create, Read, Update, Delete ----------
async function saveNote(e) {
  e.preventDefault();
  const noteId = noteIdEl.value || push(ref(db, "notes")).key;
  const note = {
    noteId,
    title: titleEl.value.trim(),
    description: descEl.value.trim(),
    keynote: keynoteEl.value.trim(),
    date: dateEl.value || null,
    subject: subjectEl.value.trim() || null,
  };

  await set(ref(db, `notes/${noteId}`), note);
  resetForm();
}

async function deleteNote(noteId) {
  if (!confirm("Delete this note?")) return;
  await remove(ref(db, `notes/${noteId}`));
}

window._notesCache = notesCache;
