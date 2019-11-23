import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

/**
 * Main description for the component goes here.
 * @extends LitElement
 * @prop {Boolean} _session - Is user connected to Spotify?
 */
export class SSSpinner extends LitElement {
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
      css`
        .spinner {
          width: 60px;
          height: 60px;
          position: relative;
          margin: 100px auto;
        }
        
        .double-bounce1, .double-bounce2 {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          opacity: 0.6;
          position: absolute;
          top: 0;
          left: 0;
          -webkit-animation: sk-bounce 1.8s infinite ease-in-out;
          animation: sk-bounce 1.8s infinite ease-in-out;
        }

        .double-bounce1 {
          background-color: var(--app-green);
        }
        
        .double-bounce2 {
          background-color: var(--app-green);
          -webkit-animation-delay: -0.9s;
          animation-delay: -0.9s;
        }
        
        @-webkit-keyframes sk-bounce {
          0%, 100% { -webkit-transform: scale(0.0) }
          50% { -webkit-transform: scale(1.0) }
        }
        
        @keyframes sk-bounce {
          0%, 100% { 
            transform: scale(0.0);
            -webkit-transform: scale(0.0);
          } 50% { 
            transform: scale(1.0);
            -webkit-transform: scale(1.0);
          }
        }
      `
    ]
  }

  render () {
    return html`
      <div class="spinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
      </div>
    `
  }
}

window.customElements.define('ss-spinner', SSSpinner)
