import anime from "animejs/lib/anime.es.js";
import Swal from "sweetalert2";
import { createNote } from "../js/api.js";

class NoteForm extends HTMLElement {
  constructor() {
    super();
    this._touchedFields = {
      title: false,
      body: false,
    };

    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    fetch("css/style.css")
      .then((response) => response.text())
      .then((css) => {
        const styleEl = document.createElement("style");
        styleEl.textContent = css;

        this.shadowRoot.innerHTML = `
          <div id="root"></div>
        `;

        const rootDiv = this.shadowRoot.querySelector("#root");
        rootDiv.prepend(styleEl);

        rootDiv.insertAdjacentHTML("beforeend", this._getFormTemplate());

        this._setupForm();
      })
      .catch((err) => {
        console.error("Failed to load CSS:", err);
        this.shadowRoot.innerHTML = this._getFormTemplate();
        this._setupForm();
      });
  }

  _getFormTemplate() {
    return `
      <form>
        <div class="form-group" id="titleGroup">
          <label for="title">Note Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Type your note title"
            required
          />
          <p class="validation" id="titleError">
            Note title must be at least 5 characters.
          </p>
        </div>
        <div class="form-group" id="bodyGroup">
          <label for="body">Note Content:</label>
          <textarea
            id="body"
            name="body"
            placeholder="Type your note content"
            required
          ></textarea>
          <p class="validation" id="bodyError">
            Note content must be at least 10 characters.
          </p>
        </div>
        <button type="submit" id="submitButton" disabled>Create a Note</button>
      </form>
    `;
  }

  _setupForm() {
    const formElement = this.shadowRoot.querySelector("form");
    const titleInput = this.shadowRoot.querySelector("#title");
    const bodyTextarea = this.shadowRoot.querySelector("#body");

    anime({
      targets: formElement,
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 700,
      easing: "easeOutExpo",
    });

    titleInput.addEventListener("input", () => {
      this._touchedFields.title = true;
      this._validateForm();
    });
    bodyTextarea.addEventListener("input", () => {
      this._touchedFields.body = true;
      this._validateForm();
    });

    this._validateForm();

    formElement.addEventListener("submit", this._onSubmit.bind(this));
  }

  disconnectedCallback() {
    const formElement = this.shadowRoot.querySelector("form");
    const titleInput = this.shadowRoot.querySelector("#title");
    const bodyTextarea = this.shadowRoot.querySelector("#body");

    titleInput.removeEventListener("input", this._validateForm);
    bodyTextarea.removeEventListener("input", this._validateForm);
    formElement.removeEventListener("submit", this._onSubmit);
  }

  _validateForm() {
    const title = this.shadowRoot.querySelector("#title").value.trim();
    const body = this.shadowRoot.querySelector("#body").value.trim();

    const titleGroup = this.shadowRoot.querySelector("#titleGroup");
    const bodyGroup = this.shadowRoot.querySelector("#bodyGroup");
    const submitButton = this.shadowRoot.querySelector("#submitButton");

    titleGroup.classList.remove("invalid");
    bodyGroup.classList.remove("invalid");

    let isValid = true;

    if (!this._touchedFields.title || title.length < 5) {
      isValid = false;
      if (this._touchedFields.title) {
        titleGroup.classList.add("invalid");
      }
    }

    if (!this._touchedFields.body || body.length < 10) {
      isValid = false;
      if (this._touchedFields.body) {
        bodyGroup.classList.add("invalid");
      }
    }

    submitButton.disabled = !isValid;
  }

  async _onSubmit(event) {
    event.preventDefault();
    const formElement = this.shadowRoot.querySelector("form");
    const submitButton = this.shadowRoot.querySelector("#submitButton");

    this._validateForm();

    if (submitButton.disabled) {
      formElement.classList.add("shake");
      setTimeout(() => {
        formElement.classList.remove("shake");
      }, 300);
      return;
    }

    const title = this.shadowRoot.querySelector("#title").value.trim();
    const body = this.shadowRoot.querySelector("#body").value.trim();

    try {
      const response = await createNote({ title, body });

      anime({
        targets: formElement,
        scale: [1, 1.05, 1],
        duration: 500,
        easing: "easeInOutQuad",
      });

      Swal.fire({
        icon: "success",
        title: "Created",
        text: response.message,
        timer: 1500,
        showConfirmButton: false,
      });

      formElement.reset();
      this._touchedFields.title = false;
      this._touchedFields.body = false;
      this._validateForm();

      this.dispatchEvent(
        new CustomEvent("note-created", {
          bubbles: true,
          composed: true,
          detail: { note: response.data },
        })
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
      console.error(error);
    }
  }
}

customElements.define("note-form", NoteForm);
