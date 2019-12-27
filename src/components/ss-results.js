import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

import './ss-result-card'
import './ss-dropdown'

/**
 * Handles the file selection portion of the application.
 * @extends LitElement
 * @prop {Boolean} _session - Is user connected to Spotify?
 */
export class SSResults extends LitElement {
  static get properties () {
    return {
      localTracks: { type: Array },
      selectedTracks: { type: Array },
      spotifyResults: { type: Array }
    }
  }

  static get styles () {
    return [
      GlobalStyles,
      css`
        :host {
          display: block;
          width: 100%;
        }
        #buttonCon {
          display: grid;
          grid-template-columns: max-content auto;
          margin-bottom: 20px;
        }
        #buttonCon ss-button {
          align-self: end;
          width: fit-content;
        }
        #fileSelectButton {
          --background-color: var(--app-blue);
          margin-right: 16px;
        }
        #buttonCon h2 {
          font-family: Roboto, sans-serif;
          font-size: 14px;
          font-weight: normal;
          align-self: end;
          margin: 0;
          justify-self: end;
          color: var(--app-light-text);
          padding-right: 8px;
        }
      `
    ]
  }

  constructor () {
    super()
    this.tracks = []
    this.resultInnacuracyThreshold = 0.2
    this.selectedTracks = []
    this.spotifyResults = []
  }

  render () {
    return html`
      <div id="buttonCon">
        <ss-dropdown></ss-dropdown>
        <ss-button
          .label=${'Add to Spotify'}
          .icon=${'library_add'}
          @click=${this._handleFileSelect}
          id="fileSelectButton">
        </ss-button>
        <h2>${this.selectedTracks.length} of ${this.spotifyResults.length}</h2>
      </div>
      ${this.spotifyResults.map((result, index) => html`
        <ss-result-card
          .localTrack=${this.localTracks[index]}
          .spotifyResult=${result.track}
          ?warning=${result.averagedDifference > this.resultInnacuracyThreshold}
          ?error=${!result.track}
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
    console.log(this.spotifyResults)
    this._updateSelected()
  }

  _toggleSelection (index) {
    this.spotifyResults[index].selected
      ? this.spotifyResults[index].selected = false
      : this.spotifyResults[index].selected = true
    this._updateSelected()
  }

  _updateSelected () {
    const selected = this.spotifyResults.filter(result => result.selected === true)
    this.selectedTracks = selected
  }
}

window.customElements.define('ss-results', SSResults)
