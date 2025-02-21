import faCSS from '!!raw-loader!@fortawesome/fontawesome-free/css/all.min.css';
import anime from 'animejs/lib/anime.es.js';
import Swal from 'sweetalert2';
import {
  deleteNote,
  getNoteDetail,
  archiveNote,
  unarchiveNote,
} from '../js/api.js';

class NoteList extends HTMLElement {
  constructor() {
    super();
    this._notes = [];
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    fetch('css/style.css')
      .then((response) => response.text())
      .then((css) => {
        const styleEl = document.createElement('style');
        styleEl.textContent = css;

        const faStyleEl = document.createElement('style');
        faStyleEl.textContent = faCSS;

        this.shadowRoot.innerHTML = `<div id="root"></div>`;
        const rootDiv = this.shadowRoot.querySelector('#root');

        rootDiv.prepend(styleEl);
        rootDiv.prepend(faStyleEl);

        rootDiv.insertAdjacentHTML('beforeend', this._getTemplate());
      });
  }

  _getTemplate() {
    return `<div class="notes-container"></div>`;
  }

  set notes(value) {
    this._notes = value || [];
    this.render();
  }

  get notes() {
    return this._notes;
  }

  render() {
    const container = this.shadowRoot.querySelector('.notes-container');
    container.innerHTML = '';

    if (!this._notes || this._notes.length === 0) {
      anime({
        targets: container,
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 800,
        easing: 'easeOutExpo',
      });
      return;
    }

    const pastelColors = [
      '#f8d5d3',
      '#d3e0f8',
      '#d3f8e2',
      '#f8f4d3',
      '#e8d3f8',
    ];

    this._notes.forEach((note) => {
      const item = document.createElement('div');
      item.classList.add('note-item');

      const randomColor =
        pastelColors[Math.floor(Math.random() * pastelColors.length)];
      item.style.backgroundColor = randomColor;

      item.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.body}</p>
        <div class="bottom-row">
          <h4><strong>${note.archived ? 'Archived Note' : 'Unarchived Note'}</strong></h4>
          <button data-action="delete" data-id="${note.id}" class="delete-btn" title="Delete">
            <i class="fa-solid fa-trash"></i>
          </button>
          ${
            note.archived
              ? `
            <button data-action="unarchive" data-id="${note.id}" class="unarchive-btn" title="Unarchive">
              <i class="fa-solid fa-box-open"></i>
            </button>
          `
              : `
            <button data-action="archive" data-id="${note.id}" class="archive-btn" title="Archive">
              <i class="fa-solid fa-box-archive"></i>
            </button>
          `
          }
          <button data-action="detail" data-id="${note.id}" class="detail-btn" title="Detail">
            <i class="fa-solid fa-eye"></i>
          </button>
        </div>
      `;

      item.addEventListener('click', (event) => {
        const action = event.target.dataset.action;
        const id = event.target.dataset.id;
        if (!action || !id) return;
        switch (action) {
          case 'delete':
            this._handleDelete(id);
            break;
          case 'detail':
            this._handleDetail(id);
            break;
          case 'archive':
            this._handleArchive(id);
            break;
          case 'unarchive':
            this._handleUnarchive(id);
            break;
        }
      });
      container.appendChild(item);
    });

    anime({
      targets: container,
      opacity: [0, 1],
      translateY: [-20, 0],
      duration: 800,
      easing: 'easeOutExpo',
    });

    anime({
      targets: this.shadowRoot.querySelectorAll('.note-item'),
      translateY: [50, 0],
      opacity: [0, 1],
      easing: 'easeOutExpo',
      duration: 800,
      delay: anime.stagger(100),
    });
  }

  async _handleDelete(noteId) {
    try {
      const result = await deleteNote(noteId);
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: result.message,
        timer: 1500,
        showConfirmButton: false,
      });
      this.dispatchEvent(
        new CustomEvent('note-deleted', {
          bubbles: true,
          composed: true,
          detail: { noteId },
        })
      );
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      });
    }
  }

  async _handleDetail(noteId) {
    try {
      const result = await getNoteDetail(noteId);
      const note = result.data;

      const dateObj = new Date(note.createdAt);
      const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      const formattedDate = dateObj.toLocaleDateString('en-US', options);

      Swal.fire({
        title: note.title,
        html: `
          <p style="margin-top: 0.5rem;">${note.body}</p>
          <p style="margin-top: 0.5rem;"><strong>Status:</strong> ${note.archived ? 'Archived' : 'Unarchived'}</p>
          <p style="margin-top: 0.5rem;"><em>${formattedDate}</em></p>
        `,
        icon: 'info',
        confirmButtonText: 'Close',
      });
      this.dispatchEvent(
        new CustomEvent('note-detail', {
          bubbles: true,
          composed: true,
          detail: { note },
        })
      );
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  }

  async _handleArchive(noteId) {
    try {
      const result = await archiveNote(noteId);
      Swal.fire({
        icon: 'success',
        title: 'Archived!',
        text: result.message,
        timer: 1500,
        showConfirmButton: false,
      });
      this.dispatchEvent(
        new CustomEvent('note-archived', {
          bubbles: true,
          composed: true,
          detail: { noteId },
        })
      );
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  }

  async _handleUnarchive(noteId) {
    try {
      const result = await unarchiveNote(noteId);
      Swal.fire({
        icon: 'success',
        title: 'Unarchived!',
        text: result.message,
        timer: 1500,
        showConfirmButton: false,
      });
      this.dispatchEvent(
        new CustomEvent('note-unarchived', {
          bubbles: true,
          composed: true,
          detail: { noteId },
        })
      );
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  }
}

customElements.define('note-list', NoteList);
