class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/style.css" />
      <header>
        <h1>📒 Notes App API</h1>
      </header>
    `;
  }
}

customElements.define('app-header', AppHeader);
