import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

/**
 * `ss-dropdown` renders a dropdown menu containing a vertical list of items.
 *
 * @memberOf components
 * @extends LitElement
 * @property {String} title The selected menu item
 * @property {Boolean} opened Whether or not the menu is opened
 */
class SSDropdown extends LitElement {
  static get properties () {
    return {
      title: { type: String },
      opened: { type: Boolean, reflect: true }
    }
  }

  static get styles () {
    return [
      GlobalStyles,
      css`
        :host {
          user-select: none;
        }
        :host([opened]) .trigger {
          pointer-events: none;
        }
        :host([opened]) .overlay {
          opacity: 1;
        }
        .overlay {
          position: absolute;
          min-width: 100%;
          max-width: fit-content;
          top: 0;
          z-index: 1;
          box-shadow: none;
          opacity: 0;
          transition: opacity .2s ease;
        }
        .menuContent {
          display: flex;
          flex-direction: column;
          padding: 14px 16px;
          border-radius: 3px;
          background-color: green;
        }
        .menuContent[hidden] {
          display: none;
        }
        .menuContent::after {
          width: 16px;
          height: 16px;
          display: block;
          transform: rotate(45deg);
          box-shadow: none;
          background-color: blue;
          content: '';
          position: absolute;
          top: -8px;
          left: 24px;
          z-index: -1;
        }
        slot[name="item"]::slotted(button) {
          font-size: 14px;
          font-weight: bold;
          height: 40px;
          font-family: Roboto, sans-serif;
          color: pink;
          border: none;
          outline: none;
          background-color: transparent;
          cursor: pointer;
          border-radius: 3px;
          margin: 2px 0;
          padding: 8px;
          display: flex;
          align-items: center;
          transition: background-color .2s ease;
        }

        slot[name="item"]::slotted(button:not([selected]):hover),
        slot[name="item"]::slotted(button:not([selected]):focus) {
          background-color: orange;
        }
        slot[name="item"]::slotted([selected]) {
          background-color: var(--app-primary-color);
          color: tomato;
        }
        slot[name="item"]::slotted([selected]:focus) {
          background-color: salmon;
        }
      `
    ]
  }

  createRenderRoot () {
    return this.attachShadow({ mode: 'open', delegatesFocus: true })
  }

  get _overlayElement () {
    return this.shadowRoot.querySelector('.overlay')
  }

  get _triggerElement () {
    return this.shadowRoot.querySelector('.trigger')
  }

  get _overlayContentElement () {
    return this.shadowRoot.querySelector('.overlay div')
  }

  constructor () {
    super()
    this._boundCaptureBodyClick = this._captureBodyClick.bind(this)
    this._boundKeyDown = this._onKeyDown.bind(this)
  }

  render () {
    return html`
      <div class="trigger" @click="${this.open}">
        <slot></slot>
      </div>
      <div class="overlay" @click="${e => e.target.blur()}">
        <div class="menuContent" ?hidden="${!this.opened}">
          <slot name="item"></slot>
        </div>
      </div>
    `
  }

  shouldUpdate (changedProperties) {
    if (changedProperties.has('opened')) {
      this.dispatchEvent(new CustomEvent(
        'opened-changed',
        {
          detail: this.opened
        }
      ))
    }
    return super.shouldUpdate(changedProperties)
  }

  firstUpdated () {
    // Close the overlay when the icon button is focused
    this.addEventListener('focus', this.close)
    this.addEventListener('blur', this._onBlur, true)
    this._overlayElement.addEventListener('keydown', this._boundKeyDown)
    this._overlayElement.addEventListener('click', this._boundClick)
  }

  updated (changedProperties) {
    if (changedProperties.has('opened') && this.opened) {
      this.querySelector('button, [href], [tabindex]:not([tabindex="-1"])').focus()
    }
  }

  open () {
    this.opened = true
    document.documentElement.addEventListener('click', this._boundCaptureBodyClick, true)
  }

  close () {
    document.documentElement.removeEventListener('click', this._boundCaptureBodyClick, true)
    this.opened = false
  }

  _onBlur (e) {
    if (e.composedPath && e.composedPath().indexOf(document.body) === -1) return
    this.close()
  }

  /**
   * @param {Event} e
   * @private
   */
  _captureBodyClick (e) {
    if (e.composedPath && e.composedPath().indexOf(this._overlayElement) !== -1) return
    this.close()
  }

  /**
   * On keydown of the overlay
   * @param {Event} e
   * @private
   */
  _onKeyDown (e) {
    let focusTarget = null
    const tabItems = Array.from(
      e.target.parentElement
        .querySelectorAll('button[slot="item"], [href][slot="item"], [tabindex]:not([tabindex="-1"])[slot="item"]')
    )
    const index = tabItems.findIndex(node => node === e.target)
    switch (e.key) {
      case 'Tab':
      case 'Escape':
        this.close()
        break
      case 'ArrowUp':
        if (tabItems[index - 1]) {
          // previous item
          focusTarget = tabItems[index - 1]
        } else {
          // last item
          focusTarget = tabItems[tabItems.length - 1]
        }
        break
      case 'ArrowDown':
        if (tabItems[index + 1]) {
          // next item
          focusTarget = tabItems[index + 1]
        } else {
          // first item
          focusTarget = tabItems[0]
        }
        break
      case 'Enter':
        // Prevent default instead it will do Enter on the next node
        e.preventDefault()
        e.target.click()
        break
    }
    if (focusTarget) {
      focusTarget.focus()
    }
  }
}
window.customElements.define('ss-dropdown', SSDropdown)
