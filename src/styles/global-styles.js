import { css } from 'lit-element'

export const GlobalStyles = css`
  :host {
    /* Official colours */
    --app-white: #FFFFFA;
    --app-black: #131515;
    --app-green: #1DB954;
    --app-purple: #202030;
    --app-red: #F2545B;
    --app-blue: #30BCED;

    /* Other colours */
    --app-success: var(--app-green);
    --app-warning: #F9CB40;
    --app-error: var(--app-red);

    /* Borders */
    --app-dark-border: var(--app-black);
    --app-light-border: #E0E0E0;

    /* Backgrounds */
    --app-light-background: var(--app-white);
    --app-dark-background: var(app-purple);

    /* Text */
    --app-light-text: var(--app-white);
    --app-medium-text: #757575;
    --app-dark-text: var(--app-black);
  }
`
