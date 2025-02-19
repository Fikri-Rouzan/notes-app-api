import "../components/appHeader.js";
import "../components/noteForm.js";
import "../components/noteList.js";
import "../components/noteDetail.js";
import "../components/loadingIndicator.js";
import "../components/appFooter.js";
import { fetchNotes, fetchArchivedNotes } from "./api.js";
import "../css/style.css";

document.addEventListener("DOMContentLoaded", () => {
  const showUnarchivedBtn = document.getElementById("showUnarchivedBtn");
  const showArchivedBtn = document.getElementById("showArchivedBtn");

  const noteForm = document.querySelector("note-form");
  const noteList = document.querySelector("note-list");
  const noteDetail = document.querySelector("note-detail");
  const loadingIndicator = document.querySelector("loading-indicator");

  loadUnarchivedNotes();

  showUnarchivedBtn.addEventListener("click", loadUnarchivedNotes);

  showArchivedBtn.addEventListener("click", loadArchivedNotes);

  noteForm.addEventListener("note-created", loadUnarchivedNotes);

  noteList.addEventListener("note-deleted", loadUnarchivedNotes);

  noteList.addEventListener("note-detail", (event) => {
    noteDetail.note = event.detail.note;
  });

  noteList.addEventListener("note-archived", loadUnarchivedNotes);

  noteList.addEventListener("note-unarchived", loadArchivedNotes);

  function loadUnarchivedNotes() {
    loadingIndicator.show();
    fetchNotes()
      .then((notes) => {
        noteList.notes = notes;
        noteDetail.note = null;
      })
      .catch((err) => console.error(err))
      .finally(() => loadingIndicator.hide());
  }

  function loadArchivedNotes() {
    loadingIndicator.show();
    fetchArchivedNotes()
      .then((notes) => {
        noteList.notes = notes;
        noteDetail.note = null;
      })
      .catch((err) => console.error(err))
      .finally(() => loadingIndicator.hide());
  }
});
