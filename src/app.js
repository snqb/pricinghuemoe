import { LitElement, html, css } from 'lit';

const API = "AIzaSyA-holUHRbiWchK4hLyPRhv1chHbzgLFqg";
const CX = "03702172d88be4769"



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
    if (hotels) {
      console.log(hotels)
      await Promise.all(hotels.map(hotel => searchHotelOnBooking(hotel))).then(results => {
        results.forEach((result, index) => {
          if (result) {
            const hotelName = hotels[index];
            const hotelLink = result;
            this.transformed = this.transformed.replace(hotelName, `${hotelName}\n${hotelLink}`);
          }
        });
        this.requestUpdate();
      });
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
          placeholder="Сюда текст"
          @input="${this.handleInput}" ></textarea>
        <textarea 
          placeholder="Результат"
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
            <button class="copy" @click="${this.copyResult}">Копировать</button>

        </div>
      </div>
    `;
  }
}

customElements.define('currency-replacer', CurrencyReplacer);

async function searchHotelOnBooking(hotelName) {
  const query = encodeURIComponent(hotelName);
  const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${API}&cx=${CX}&q=${query}`;

  try {
    const response = await fetch(searchUrl);
    const data = await response.json();

    // Find the first result that includes Booking.com in the link
    const bookingResult = data.items.find(item => item.link.includes('booking.com'));

    if (bookingResult) {
      console.log('Booking.com Link:', bookingResult.link);
      return bookingResult.link;  // Return the Booking.com link
    } else {
      console.log('No Booking.com result found.');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function findLineWithEmoji(text, emoji) {
  // Split the text into lines
  const lines = text.split('\n');

  // Find the line that contains the emoji
  const lineWithEmoji = lines.filter(line => line.includes(emoji));

  // Return the line if found, otherwise return null
  return lineWithEmoji ? lineWithEmoji.map(it => it.trim()) : null;
}