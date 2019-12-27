import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

import './ss-button'

export class SSDropdown extends LitElement {
  static get properties () {
    return {
      _label: { type: String },
      _opened: { type: Boolean, reflect: true, attribute: 'opened' }
    }
  }

  static get styles () {
    return [
      GlobalStyles,
      css`
        :host {
          height: var(--app-button-height);
          display: block;
          position: relative;
        }
        label {
          position: absolute;
          transform: translateY(-100%);
          font-size: 12px;
          color: var(--app-light-text);
        }
        #overlay {
          opacity: 0;
          position: absolute;
          top: calc(var(--app-button-height) + 8px);
          left: 0;
          background-color: var(--app-light-background);
          transition: opacity 150ms ease;
          border-radius: 3px;
          padding: 8px 0;
          z-index: -1;
        }
        :host([opened]) #overlay {
          opacity: 1;
          z-index: 1;
        }
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        ul li {
          white-space: nowrap;
          padding: 8px;
          cursor: pointer;
        }
        ul li:hover {
          background-color: var(--app-hover);
        }
        ul li[selected] {
          background-color: var(--app-active);
        }
      `
    ]
  }

  constructor () {
    super()
    this._label = 'Select a playlist'
    this._opened = false
  }

  render () {
    return html`
      <label for="playlistSelector">Playlist</label>
      <ss-button
        id="playlistSelector"
        .label=${this._label}
        .trailingIcon=${'arrow_drop_down'}
        @click=${this._toggleDropdown}>
      </ss-button>
      
      <div id="overlay">
        <ul>
          <li>Item 1 is a very long list item and it will break everything</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 4</li>
          <li>Item 5</li>
        </ul>
      </div>
    `
  }

  _toggleDropdown () {
    this._opened ? this._opened = false : this._opened = true
  }
}

window.customElements.define('ss-dropdown', SSDropdown)
