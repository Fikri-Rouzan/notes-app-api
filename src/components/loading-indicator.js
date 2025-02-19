class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
        <style>
          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: #333;
            z-index: 9999;
            display: none;
          }
        </style>
        <div class="overlay">Loading...</div>
      `;
  }

  show() {
    this.shadowRoot.querySelector(".overlay").style.display = "flex";
  }

  hide() {
    this.shadowRoot.querySelector(".overlay").style.display = "none";
  }
}

customElements.define("loading-indicator", LoadingIndicator);
