class AppHeader extends HTMLElement {
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
      <header>
        <h1>📒 Notes App API</h1>
      </header>
    `;
  }
}

customElements.define('app-header', AppHeader);
