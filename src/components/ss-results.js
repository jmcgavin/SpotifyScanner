import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

import { getPlaylists, getUser } from '../helpers/spotify'
import { dropdownArrow, playlistIcon } from '../components/ss-icons'

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
      spotifyResults: { type: Array },
      playlists: { type: Array },
      opened: { type: Boolean, reflect: true },
      _selectedPlaylist: { type: Object }
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
          grid-template-columns: max-content max-content auto;
          gap: 16px;
          margin-bottom: 20px;
        }
        #buttonCon ss-button {
          align-self: end;
          width: fit-content;
        }
        #fileSelectButton {
          --background-color: var(--app-green);
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
        .wrapper {
          display: grid;
          font-family: Roboto, sans-serif;
          grid-template-columns: max-content auto max-content;
          align-items: center;
          gap: 8px;
          background-color: var(--app-blue);
          padding: 4px 8px;
          height: 36px;
          box-sizing: border-box;
          cursor: pointer;
          outline: none;
          width: 100%;
          border-radius: 3px;
        }
        .wrapper h3 {
          color: var(--app-light-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
          font-weight: normal;
          text-transform: uppercase;
          margin: 0;
        }
        .wrapper svg {
          fill: var(--app-white);
        }
        .wrapper svg:nth-of-type(2) {
          transform: rotate(0deg);
          transition: transform .2s ease;
          will-change: transform;
        }
        ss-dropdown[opened] .wrapper svg:nth-of-type(2) {
          transform: rotate(180deg);
        }
        *[slot="item"] {
          transition: none;
          min-width: 100%;
          width: max-content;
        }
        #createNewPlaylist {
          font-style: italic;
        }
      `
    ]
  }

  get _dropdown () {
    return this.shadowRoot.querySelector('hc-menu')
  }

  constructor () {
    super()
    this.tracks = []
    this.resultInnacuracyThreshold = 0.2
    this.selectedTracks = []
    this.spotifyResults = []
    this.playlists = []
    this._selectedPlaylist = {}
  }

  render () {
    return html`
      <div id="buttonCon">

      <ss-dropdown @opened-changed=${this._openedChanged}>
          <div
            class="wrapper"
            tabindex="0"
            @keydown="${e => e.key === 'Enter' ? this._dropdown.open() : ''}">
            ${playlistIcon}
            <h3>${this._selectedPlaylist.name ? this._selectedPlaylist.name : 'Select a playlist'}</h3>
            ${dropdownArrow}
          </div>

          <button
            id="createNewPlaylist"
            slot="item"
            ?selected="${this._selectedPlaylist.name === '_newPlaylist'}"
            tabindex="${this.opened ? '0' : '-1'}"
            @click="${() => this._onMenuItemClicked()}">
            Create new playlist
          </button>

        ${this.playlists.map(playlist => html`
          <button
            slot="item"
            ?selected="${playlist === this._selectedPlaylist}"
            tabindex="${this.opened ? '0' : '-1'}"
            @click="${() => this._onMenuItemClicked(playlist)}">
            ${playlist.name}
          </button>
        `)}
      </ss-dropdown>
        
        <ss-button
          ?disabled=${!Object.keys(this._selectedPlaylist).length}
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
    this._populatePlaylists()
  }

  async _populatePlaylists () {
    const user = await getUser()
    const playlists = await getPlaylists()
    const filteredPlaylists = playlists
      .filter(playlist => playlist.owner.id === user.id || playlist.collaborative)

    this.playlists = filteredPlaylists
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

  _onMenuItemClicked (playlist) {
    if (!playlist) {
      this._selectedPlaylist = {
        name: '_newPlaylist'
      }
      return
    }
    this._selectedPlaylist = playlist
  }

  _openedChanged (e) {
    this.opened = e.detail
  }
}

window.customElements.define('ss-results', SSResults)
