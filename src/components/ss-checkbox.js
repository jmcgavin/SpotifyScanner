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
      disabled: { type: Boolean, attribute: 'disabled', reflect: true }
    }
  }

  constructor () {
    super()
    this.disabled = false
    this.label = ''
    this.icon = ''
  }

  static get styles () {
    return [
      GlobalStyles,
      css`
      :host {
        display: block;
      }
      input {
        padding: 0;
        height: initial;
        width: initial;
        margin-bottom: 0;
        display: none;
        cursor: pointer;
      }
      label {
        position: relative;
        cursor: pointer;
      }
      label:before {
        content:'';
        -webkit-appearance: none;
        background-color: transparent;
        border: 2px solid #fff;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05);
        padding: 8px;
        display: inline-block;
        position: relative;
        vertical-align: middle;
        cursor: pointer;
        border-radius: 3px;
      }
      input:checked + label:after {
        content: '';
        display: block;
        position: absolute;
        top: 3px;
        left: 7px;
        width: 4px;
        height: 10px;
        border: solid #fff;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
      `
    ]
  }

  render () {
    return html`
      <input type="checkbox" id="html">
      <label for="html"></label>
    `
  }
}

window.customElements.define('ss-checkbox', SSCheckbox)
