import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

import { style as materialButtonStyles } from '../styles/mdc-button-css'

/**
 * Main description for the component goes here.
 * @extends LitElement
 * @prop {Boolean} _session - Is user connected to Spotify?
 */
export class SSButton extends LitElement {
  static get properties () {
    return {
      disabled: { type: Boolean, attribute: 'disabled', reflect: true },
      label: { type: String, attribute: 'label', reflect: true },
      icon: { type: String, attribute: 'icon', reflect: true }
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
      materialButtonStyles,
      css`
        button {
          --mdc-theme-primary: var(--background-color, var(--app-primary));
          --mdc-theme-on-primary: var(--color, var(--app-light-text));
        }
        .disabled {
          opacity: 0.3;
          pointer-events: none;
        }
      `
    ]
  }

  render () {
    return html`
      <button class="mdc-button mdc-button--raised ${this.disabled ? 'disabled' : ''}">
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
