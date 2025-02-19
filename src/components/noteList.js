import anime from "animejs/lib/anime.es.js";
import Swal from "sweetalert2";
import {
  deleteNote,
  getNoteDetail,
  archiveNote,
  unarchiveNote,
} from "../js/api.js";

class NoteList extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.innerHTML = `
      <style>
        .notes-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }
        .note-item {
          border: 1px solid #ccc;
          padding: 10px;
          opacity: 0;
          transform: translateY(50px);
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: normal;
        }
        button {
          margin-right: 4px;
          cursor: pointer;
          background-color: #5a67d8;
          color: #fff;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #434190;
        }
      </style>
      <div class="notes-container"></div>
    `;
    this._notes = [];
  }

  set notes(value) {
    this._notes = value || [];
    this.render();
  }

  get notes() {
    return this._notes;
  }

  render() {
    const container = this._shadowRoot.querySelector(".notes-container");
    container.innerHTML = "";

    if (!this._notes || this._notes.length === 0) {
      container.innerHTML = "<p>Tidak ada catatan.</p>";
      return;
    }

    this._notes.forEach((note) => {
      const item = document.createElement("div");
      item.classList.add("note-item");
      item.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.body}</p>
        <p><strong>Archived:</strong> ${note.archived}</p>
        <button data-action="detail" data-id="${note.id}">Detail</button>
        <button data-action="delete" data-id="${note.id}">Delete</button>
        ${
          note.archived
            ? `<button data-action="unarchive" data-id="${note.id}">Unarchive</button>`
            : `<button data-action="archive" data-id="${note.id}">Archive</button>`
        }
      `;
      item.addEventListener("click", (event) => {
        const action = event.target.dataset.action;
        const id = event.target.dataset.id;
        if (!action || !id) return;

        switch (action) {
          case "delete":
            this._handleDelete(id);
            break;
          case "detail":
            this._handleDetail(id);
            break;
          case "archive":
            this._handleArchive(id);
            break;
          case "unarchive":
            this._handleUnarchive(id);
            break;
        }
      });
      container.appendChild(item);
    });

    anime({
      targets: this._shadowRoot.querySelectorAll(".note-item"),
      translateY: [50, 0],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 800,
      delay: anime.stagger(100),
    });
  }

  async _handleDelete(noteId) {
    try {
      const result = await deleteNote(noteId);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: result.message,
        timer: 1500,
        showConfirmButton: false,
      });
      this.dispatchEvent(
        new CustomEvent("note-deleted", {
          bubbles: true,
          composed: true,
          detail: { noteId },
        })
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  }

  async _handleDetail(noteId) {
    try {
      const result = await getNoteDetail(noteId);
      const note = result.data;

      Swal.fire({
        title: note.title,
        html: `
          <p>${note.body}</p>
          <p><strong>Archived:</strong> ${note.archived}</p>
          <p><strong>Created At:</strong> ${note.createdAt}</p>
        `,
        icon: "info",
        confirmButtonText: "Close",
      });

      this.dispatchEvent(
        new CustomEvent("note-detail", {
          bubbles: true,
          composed: true,
          detail: { note },
        })
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  }

  async _handleArchive(noteId) {
    try {
      const result = await archiveNote(noteId);
      Swal.fire({
        icon: "success",
        title: "Archived!",
        text: result.message,
        timer: 1500,
        showConfirmButton: false,
      });
      this.dispatchEvent(
        new CustomEvent("note-archived", {
          bubbles: true,
          composed: true,
          detail: { noteId },
        })
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  }

  async _handleUnarchive(noteId) {
    try {
      const result = await unarchiveNote(noteId);
      Swal.fire({
        icon: "success",
        title: "Unarchived!",
        text: result.message,
        timer: 1500,
        showConfirmButton: false,
      });
      this.dispatchEvent(
        new CustomEvent("note-unarchived", {
          bubbles: true,
          composed: true,
          detail: { noteId },
        })
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  }
}

customElements.define("note-list", NoteList);
