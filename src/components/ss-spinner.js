import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

/**
 * A CSS spinner.
 * @extends LitElement
 * @prop {Boolean} _session - Is user connected to Spotify?
 */
export class SSSpinner extends LitElement {
  static get styles () {
    return [
      GlobalStyles,
      css`
      .loading {
        height: 0;
        width: 0;
        padding: 15px;
        border: 3px solid var(--app-blue);
        border-right-color: rgba(48, 188, 237, 0.2);
        border-radius: 22px;
        -webkit-animation: rotate 1s infinite linear;
        position: absolute;
        left: 50%;
        top: 50%;
      }
      
      @-webkit-keyframes rotate {
        /* 100% keyframe for clockwise. 0% for anticlockwise */
        100% {
          -webkit-transform: rotate(360deg);
        }
      }}      
      `
    ]
  }

  render () {
    return html`
      <div class="loading"></div>
    `
  }
}

window.customElements.define('ss-spinner', SSSpinner)
