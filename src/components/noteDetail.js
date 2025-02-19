import anime from "animejs/lib/anime.es.js";

class NoteDetail extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.innerHTML = `
      <style>
        .detail-container {
          border: 1px solid #ccc;
          padding: 10px;
          margin-top: 20px;
          border-radius: 8px;
          background-color: #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

          /* Persiapan untuk animasi (nilai default) */
          transform: scale(1);
          opacity: 1;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
      </style>
      <div class="detail-container">
        <h3>Note Detail</h3>
        <p id="detail-body">Belum ada detail yang dipilih.</p>
      </div>
    `;
  }

  set note(noteData) {
    this._noteData = noteData;
    this.render();

    if (noteData) {
      const container = this._shadowRoot.querySelector(".detail-container");
      container.style.transform = "scale(0.9)";
      container.style.opacity = "0";

      anime({
        targets: container,
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 600,
        easing: "easeInOutQuad",
      });
    }
  }

  get note() {
    return this._noteData;
  }

  render() {
    const container = this._shadowRoot.querySelector(".detail-container");

    if (!this._noteData) {
      container.innerHTML = `
        <h3>Note Detail</h3>
        <p>Belum ada detail yang dipilih.</p>
      `;
      return;
    }

    const { title, body, archived, createdAt } = this._noteData;
    container.innerHTML = `
      <h3>Detail: ${title}</h3>
      <p>${body}</p>
      <p><strong>Archived:</strong> ${archived}</p>
      <p><em>Created At:</em> ${createdAt}</p>
    `;
  }
}

customElements.define("note-detail", NoteDetail);
