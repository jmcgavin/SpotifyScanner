import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

import './ss-file-read'
import '@material/mwc-button'
import { style as materialButtonStyles } from '../styles/mdc-button-css'

/**
 * Main description for the component goes here.
 * @extends LitElement
 * @prop {Boolean} _session - Is user connected to Spotify?
 */
export class SSButton extends LitElement {
  static get properties () {
    return {
      label: { type: String, attribute: 'label', reflect: true },
      icon: { type: String, attribute: 'icon', reflect: true }
    }
  }

  constructor () {
    super()
    this.label = ''
    this.icon = ''
  }

  static get styles () {
    return [
      GlobalStyles,
      materialButtonStyles,
      css`
        button {
          --mdc-theme-primary: var(--background-color, var(--spotify-green));
          --mdc-theme-on-primary: var(--color, var(--app-light-text-color));
        }
      `
    ]
  }

  render () {
    return html`
      <button class="mdc-button mdc-button--raised">
        ${this.icon.length ? html`
          <i class="material-icons mdc-button__icon" aria-hidden="true">
            ${this.icon}
          </i>
        ` : ''}
        <span class="mdc-button__label">${this.label}</span>
      </button>
    `
  }
}

window.customElements.define('ss-button', SSButton)
