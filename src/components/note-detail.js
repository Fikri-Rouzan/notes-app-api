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
