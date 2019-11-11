import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

import './ss-button'

/**
 * Main description for the component goes here.
 * @extends LitElement
 * @prop {Boolean} _session - Is user connected to Spotify?
 */
export class SSTable extends LitElement {
  static get properties () {
    return {
      tracksAreSelected: { type: Boolean, reflect: true, attribute: 'tracks-selected' },
      tracks: { type: Array }
    }
  }

  static get styles () {
    return [
      GlobalStyles,
      css`
        table {
          width: 100%;
          font-family: Roboto, sans-serif;
          font-size: 14px;
          text-align: left;
          color: var(--app-dark-text);
          border-collapse: collapse;
        }

        #noTracksSelected {
          height: 50vh;
        }

        /* Row height */
        tr {
          height: 56px;
          box-sizing: border-box;
        }

        /* First & last column padding */
        tr td:first-child {
          padding-left: 8px;
          text-align: center;
        }

        tr td:last-child {
          padding-right: 8px;
        }

        /* Cell padding */
        td, th {
          padding: 8px;
        }

        /* Table bakground color */
        table tr:first-child {
          background-color: var(--app-green);
          color: var(--app-light-text);
        }
        table tr:nth-child(even) {
          background-color: rgba(255,255,255,0.96);
        }
        table tr:nth-child(n+3):nth-child(odd) {
          background-color: rgba(255,255,255,0.91);
        }

        /* Table hover effect */
        table tr:nth-child(even):hover,
        table tr:nth-child(n+3):nth-child(odd):hover {
          
        }

        /* Table border radius */
        table tr:last-child td:first-child {
          border-bottom-left-radius: 4px;
        }
        table tr:last-child td:last-child {
          border-bottom-right-radius: 4px;
        }

        table tr:first-child th:first-child {
          border-top-left-radius: 4px;
        }
        table tr:first-child th:last-child {
          border-top-right-radius: 4px;
        }
      `
    ]
  }

  constructor () {
    super()
    this.tracksAreSelected = false
    this.tracks = []
  }

  render () {
    return html`
      <table>
        <tr> <!-- table row -->
          <th></th> <!-- table header cell -->
          <th>Title</th>
          <th>Artist</th>
          <th>Album</th>
          <th>Year</th>
        </tr>

        ${!this.tracksAreSelected ? html`
          <tr>
            <td id="noTracksSelected" colspan="5">No tracks selected</td>
          </tr>
        ` : ''}
        
        ${this.tracks.map(track => html`
          <tr>
            <td>${track.id}</td>
            <td>${track.title}</td>
            <td>${track.artist}</td>
            <td>${track.album}</td>
            <td>${track.year}</td>
          </tr>
        `)}
      </table>
    `
  }
}

window.customElements.define('ss-table', SSTable)
