import { LitElement, html, css } from 'lit';

export class CurrencyReplacer extends LitElement {
  static properties = {
    transformed: { type: String },
    initialValue: { type: String },
  };

  static styles = css`
    ::host {
      width: 100vw;
      height: 100vh;
    }

    .container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      max-width: 100vw;
      margin: 0 auto;
      padding: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }

    .buttons {
      margin-bottom: 1rem;
      display: flex;
      justify-content: flex-start;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 0.5rem;
      color: white;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    .dollar-btn {
      background-color: #278664;
    }

    .dollar-btn:hover {
      background-color: #79a471;
    }

    .euro-btn {
      background-color: #5D7EA7;
    }

    .euro-btn:hover {
      background-color: #9FCDCD;
    }

    textarea {
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-size: 1rem;
      resize: none;
      width: 40ch;
    }

    .areas {
      position: relative;
    }

    .copy {
      position: absolute;
      bottom: 1rem;
      right: .25rem;
      background-color: green;
    }
  `;

  constructor() {
    super();
    this.transformed = '';
    this.initialValue = '';
  }

  handleInput(e) {
    this.initialValue = e.target.value;
    this.requestUpdate();  // Ensures reactive re-rendering
  }

  updateText(symbol) {
    this.transformed = this.initialValue.replace(/у\.е\./g, symbol);
    this.requestUpdate();  // Trigger re-render after change
  }

  copyResult() {
    navigator.clipboard.writeText(this.transformed);
  }

  render() {
    return html`
      <div class="container">
        <div class="buttons">
          <button 
            @click="${() => this.updateText('$')}" 
            class="dollar-btn">
            Доллар
          </button>
          <button 
            @click="${() => this.updateText('€')}" 
            class="euro-btn">
            Евро
          </button>
        </div>
        
        <div class="areas">
        <textarea 
          .value="${this.initialValue}"
          rows="20"
          placeholder="Сюда текст"
          @input="${this.handleInput}" ></textarea>
        <textarea 
          placeholder="Результат"
          rows="20"
          .value="${this.transformed}">
          </textarea>
            <button class="copy" @click="${this.copyResult}">Копировать</button>

        </div>
      </div>
    `;
  }
}

customElements.define('currency-replacer', CurrencyReplacer);
