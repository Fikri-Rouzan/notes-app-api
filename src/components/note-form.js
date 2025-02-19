import { createNote } from "../api.js";

class NoteForm extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.innerHTML = `
      <style>
        form {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        input, textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 8px;
        }
        button {
          width: 100px;
          cursor: pointer;
        }
      </style>
      <form>
        <input type="text" name="title" placeholder="Title" required />
        <textarea name="body" placeholder="Body" required></textarea>
        <button type="submit">Add Note</button>
      </form>
    `;
  }

  connectedCallback() {
    this._shadowRoot
      .querySelector("form")
      .addEventListener("submit", this._onSubmit.bind(this));
  }

  disconnectedCallback() {
    this._shadowRoot
      .querySelector("form")
      .removeEventListener("submit", this._onSubmit.bind(this));
  }

  async _onSubmit(event) {
    event.preventDefault();
    const title = this._shadowRoot.querySelector('input[name="title"]').value;
    const body = this._shadowRoot.querySelector('textarea[name="body"]').value;

    try {
      const response = await createNote({ title, body });
      alert(response.message);
      this._shadowRoot.querySelector("form").reset();

      this.dispatchEvent(
        new CustomEvent("note-created", {
          bubbles: true,
          composed: true,
          detail: { note: response.data },
        })
      );
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  }
}

customElements.define("note-form", NoteForm);
