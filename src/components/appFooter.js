class AppFooter extends HTMLElement {
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
      <footer>
        <h4>© ${new Date().getFullYear()} Muhammad Fikri Rouzan Ash Shidik</h4>
      </footer>
    `;
  }
}

customElements.define('app-footer', AppFooter);
