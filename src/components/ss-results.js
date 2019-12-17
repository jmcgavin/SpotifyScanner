import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

import './ss-result-card'

/**
 * Handles the file selection portion of the application.
 * @extends LitElement
 * @prop {Boolean} _session - Is user connected to Spotify?
 */
export class SSResults extends LitElement {
  static get properties () {
    return {
      localTracks: { type: Array },
      spotifyResults: { type: Array }
    }
  }

  static get styles () {
    return [
      GlobalStyles,
      css`
        :host {
          display: grid;
          width: 100%;
          grid-template-columns: max-content;
          gap: 16px;
          justify-self: center;
        }
      `
    ]
  }

  constructor () {
    super()
    this.tracks = []
    this.resultInnacuracyThreshold = 0.2
    this.spotifyResults = []
  }

  render () {
    return html`
      ${this.spotifyResults.map((result, index) => html`
        <ss-result-card
          .localTrack=${this.localTracks[index]}
          .spotifyResult=${result.track}
          .warning=${result.averagedDifference > this.resultInnacuracyThreshold || false}
          .error=${Object.keys(result).length === 0 || false}
          @toggle-selection=${() => this._toggleSelection(index)}>
        </ss-result-card>
      `)}
    `
  }

  firstUpdated () {
    this._selectTracks()
  }

  _selectTracks () {
    for (let i = 0; i < this.spotifyResults.length; i++) {
      if (this.spotifyResults[i].averagedDifference < this.resultInnacuracyThreshold) {
        this.spotifyResults[i] = {
          ...this.spotifyResults[i],
          selected: true
        }
      } else {
        this.spotifyResults[i] = {
          ...this.spotifyResults[i],
          selected: false
        }
      }
    }
  }

  _toggleSelection (index) {
    this.spotifyResults[index].selected
      ? this.spotifyResults[index].selected = false
      : this.spotifyResults[index].selected = true
  }
}

window.customElements.define('ss-results', SSResults)
