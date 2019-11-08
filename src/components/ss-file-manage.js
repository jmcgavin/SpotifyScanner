import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

import './ss-button'

/**
 * Main description for the component goes here.
 * @extends LitElement
 * @prop {Boolean} _session - Is user connected to Spotify?
 */
export class SSFileManage extends LitElement {
  static get properties () {
    return {
      selectedFiles: { type: Object },
      tracks: { type: Array }
    }
  }

  static get styles () {
    return [
      GlobalStyles,
      css`
      
      `
    ]
  }

  constructor () {
    super()
    this.tracks = []
  }

  render () {
    return html`
      <ss-button
        .label=${'File manage button'}
        .icon=${'library_music'}>
      </ss-button>
    `
  }
}

window.customElements.define('ss-file-manage', SSFileManage)
