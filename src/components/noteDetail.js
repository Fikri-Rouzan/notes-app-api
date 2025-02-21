import anime from 'animejs/lib/anime.es.js';

class NoteDetail extends HTMLElement {
  constructor() {
    super();
    this._noteData = null;
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    fetch('css/style.css')
      .then((response) => response.text())
      .then((css) => {
        const styleEl = document.createElement('style');
        styleEl.textContent = css;

        this.shadowRoot.innerHTML = `<div id="root"></div>`;
        const rootDiv = this.shadowRoot.querySelector('#root');

        rootDiv.prepend(styleEl);

        rootDiv.insertAdjacentHTML('beforeend', this._getTemplate());
      });
  }

  _getTemplate() {
    return `
      <div class="detail-container">
        <h3>Note Detail</h3>
        <p id="detail-body">No note has been selected yet</p>
      </div>
    `;
  }

  set note(noteData) {
    this._noteData = noteData;
    this.render();

    const container = this.shadowRoot.querySelector('.detail-container');
    container.style.transform = 'scale(0.9)';
    container.style.opacity = '0';

    anime({
      targets: container,
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: 600,
      easing: 'easeInOutQuad',
    });
  }

  get note() {
    return this._noteData;
  }

  render() {
    const container = this.shadowRoot.querySelector('.detail-container');

    if (!this._noteData) {
      container.innerHTML = `
        <h3>Note Detail</h3>
        <p id="detail-body">No note has been selected yet</p>
      `;
      return;
    }

    const { title, body, archived, createdAt } = this._noteData;

    const dateObj = new Date(createdAt);

    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);

    container.innerHTML = `
      <h3>${title}</h3>
      <p>${body}</p>
      <p><strong>${archived ? 'Archived Note' : 'Unarchived Note'}</strong> </p>
      <p><em>${formattedDate}</em></p>
    `;
  }
}

customElements.define('note-detail', NoteDetail);
