import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

/**
 * A CSS spinner.
 * @extends LitElement
 * @prop {Boolean} _session - Is user connected to Spotify?
 */
export class SSCheckbox extends LitElement {
  static get properties () {
    return {
      checked: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true }
    }
  }

  get _checkboxInput () {
    return this.renderRoot.querySelector('input')
  }

  constructor () {
    super()
    this.disabled = false
    this.checked = false
  }

  static get styles () {
    return [
      GlobalStyles,
      css`
        :host {
          width: 20px;
          height: 20px;
        }
        :host([disabled]) {
          opacity: 0.3;
          pointer-events: none;
        }
        :host([disabled]) .checkmark {
          background-color: rgba(255,255,255,0.4);
        }
        /* Customize the label (the container) */
        /* The container */
        .container {
          display: block;
          position: relative;
          margin-bottom: 12px;
          cursor: pointer;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Hide the browser's default checkbox */
        .container input {
          display: none;
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        /* Create a custom checkbox */
        .checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 20px;
          width: 20px;
          background-color: rgba(255,255,255,0.3);
          border: solid 2px white;
          border-radius: 3px;
          box-sizing: border-box;
          transition: background-color 150ms ease;
        }

        /* On mouse-over, add a grey background color */
        .container:hover input ~ .checkmark {
          background-color: rgba(255,255,255,0.4);
        }

        /* When the checkbox is checked, add a blue background */
        .container input:checked ~ .checkmark {
          background-color: var(--app-white);
        }

        /* Create the checkmark/indicator (hidden when not checked) */
        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        /* Show the checkmark when checked */
        .container input:checked ~ .checkmark:after {
          display: block;
        }

        /* Style the checkmark/indicator */
        .container .checkmark:after {
          left: 5px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid var(--app-green);
          border-width: 0 2px 2px 0;
          -webkit-transform: rotate(45deg);
          -ms-transform: rotate(45deg);
          transform: rotate(45deg);
        }
      `
    ]
  }

  render () {
    return html`
      <label class="container">
        <input
          type="checkbox"
          ?checked="${this.checked}"
          ?disabled="${this.disabled}"
          @change="${this._onChange}">
        <span class="checkmark"></span>
      </label>
    `
  }

  _onChange (e) {
    this.checked ? this.checked = false : this.checked = true
    this.dispatchEvent(new CustomEvent('change'))
  }
}

window.customElements.define('ss-checkbox', SSCheckbox)
