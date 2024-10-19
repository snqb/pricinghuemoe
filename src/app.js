import { LitElement, html, css } from 'lit';

export class CurrencyReplacer extends LitElement {
  static properties = {
    transformed: { type: String },
    initialValue: { type: String },
  };

  static styles = css`
    :host {
      width: 100%;
      // height: 100vh;
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
      display: flex;
      justify-content: flex-start;


      position: absolute;
      left: .5rem;
      bottom: 1rem;
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
      flex: 1;
    }

    .areas {
      position: relative;
      display: flex;
      gap: 5;
    }

    .copy {
      position: absolute;
      bottom: 1rem;
      right: .25rem;
      background-color: green;
      
      }
    
      .copy::after {
        content: "ть 📝";
      }

    .copy:focus {
        background-color: teal;
      }

    .copy:focus::after {
      content: "но ✅";
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

  async updateText(symbol) {
    this.transformed = this.initialValue.replace(/у\.е\./g, symbol);
    const hotels = findLineWithEmoji(this.transformed, '⭐️');
    if (hotels?.length) {
      const links = await find(hotels);
      hotels.forEach((hotel, index) => {
        const hotelLink = links[index];
        if (hotelLink) {
          console.log(hotelLink);
          this.transformed = this.transformed.replace(hotel, `${hotel}\n${hotelLink}`);
        }
      });
      this.requestUpdate();
    }

    this.requestUpdate();  // Trigger re-render after change
  }

  copyResult() {
    navigator.clipboard.writeText(this.transformed);
  }

  render() {
    return html`
      <div class="container">      
        <div class="areas">
        <textarea 
          .value="${this.initialValue}"
          rows="40"
          placeholder="Сюда подборку"
          @input="${this.handleInput}" ></textarea>
        <textarea 
          placeholder="И тут будет результат"
          rows="40"
          .value="${this.transformed}">
          </textarea>
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
            <button class="copy" @click="${this.copyResult}">Скопирова</button>

        </div>
      </div>
    `;
  }
}

customElements.define('currency-replacer', CurrencyReplacer);

const find = async (queries) => {
  var myHeaders = new Headers();
  myHeaders.append("X-API-KEY", "223984764572c70e9c16ca35e99d432fdce963a0");
  myHeaders.append("Content-Type", "application/json");

  const qs = queries.map(q => ({ q }));
  const raw = JSON.stringify(qs);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const res = await fetch("https://google.serper.dev/search", requestOptions);
  const data = await res.json();

  return data.map(it => it.organic.find(it => it.link.includes('booking.com'))?.link ?? "");
}

function findLineWithEmoji(text, emoji) {
  // Split the text into lines
  const lines = text.split('\n');

  // Find the line that contains the emoji
  const lineWithEmoji = lines.filter(line => line.includes(emoji));

  // Return the line if found, otherwise return null
  return lineWithEmoji ? lineWithEmoji.map(it => it.trim()) : null;
}