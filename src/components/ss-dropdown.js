import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

/**
 * `hc-menu` renders a dropdown menu containing a vertical list of items.
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
          position: relative;
          width: 220px;
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
          top: 40px;
          z-index: 1;
          box-shadow: 0 4px 8px 0 rgba(0,0,0,0.24), 0 0 4px 0 rgba(0, 0, 0, 0.16);
          opacity: 0;
          transition: opacity 200ms ease;
        }
        .menuContent {
          max-height: 300px;
          overflow: auto;
          display: flex;
          flex-direction: column;
          padding: 8px;
          border-radius: 3px;
          background-color: var(--app-light-background);
        }
        .menuContent[hidden] {
          display: none;
        }
        slot[name="item"]::slotted(button) {
          font-size: 14px;
          height: 36px;
          font-family: Roboto, sans-serif;
          color: var(--app-dark-text);
          border: none;
          outline: none;
          background-color: transparent;
          cursor: pointer;
          border-radius: 3px;
          margin: 2px 0;
          padding: 8px;
          display: flex;
          align-items: center;
          transition: background-color 200ms ease;
        }

        slot[name="item"]::slotted(button:not([selected]):hover),
        slot[name="item"]::slotted(button:not([selected]):focus) {
          background-color: var(--app-hover);
        }
        slot[name="item"]::slotted([selected]) {
          background-color: var(--app-blue);
          color: var(--app-light-text);
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
