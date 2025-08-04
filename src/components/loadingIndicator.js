class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/style.css" />
      <div class="overlay">Loading...</div>
    `;
  }

  show() {
    this.shadowRoot.querySelector('.overlay').style.display = 'flex';
  }

  hide() {
    this.shadowRoot.querySelector('.overlay').style.display = 'none';
  }
}

customElements.define('loading-indicator', LoadingIndicator);
