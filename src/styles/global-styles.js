import { css } from 'lit-element'

export const GlobalStyles = css`
  :host {
    --app-white: #FFFFFA;
    --app-black: #131515;
    --app-green: #1DB954;
    --app-purple: #202030;
    --app-red: #F2545B;
    --app-blue: #30BCED;

    --app-dark-border: var(--app-black);
    --app-light-border: rgb(224, 224, 224);

    --app-primary: var(--app-green);
    --app-secondary: var(--app-pblue);
    --app-error: var(--app-red);
    
    --app-light-background: var(--app-white);
    --app-dark-background: var(app-black);

    --app-dark-text: var(--app-black);
    --app-light-text: var(--app-white);
  }
`
