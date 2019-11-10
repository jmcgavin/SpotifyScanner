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
      <h1>${this.tracks[0].id}${this.tracks[0].title}</h1>
      <h1>${this.tracks[1].id}${this.tracks[1].title}</h1>

      <ss-button
        .label=${'File manage button'}
        .icon=${'library_music'}>
      </ss-button>
    `
  }
}

window.customElements.define('ss-file-manage', SSFileManage)
