import { NoSsr } from '@material-ui/core';
import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import { createStore } from 'redux'
import CssBaseline from '@material-ui/core/CssBaseline';
import {createGenerateClassName, MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

import JssProvider from 'react-jss/lib/JssProvider';
import Theme from '../src/getPageContext';
import ReactGA from 'react-ga';

import { appWithTranslation } from '../i18n'

import { Provider } from 'react-redux';
import rootReducer from '../src/lib/reducers/'
const store = createStore(rootReducer)

const GlobalStyle = createGlobalStyle`
  body {
    background: white !important;
    font-family: Sarabun, Roboto, sans-serif;
    max-width: 800px;
    margin: auto !important;
    position: relative;
  }
`;

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: 'b',
});

class MyApp extends App {xw
  constructor(props) {
    super(props);
    this.theme = Theme();
  }


  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
    ReactGA.initialize('UA-146283827-1');
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <NoSsr>
          <JssProvider 
            registry={this.theme.sheetsRegistry}
            generateClassName={generateClassName} 
            insertionPoint={'jss-insertion-point'}
          >
            <MuiThemeProvider
              theme={this.theme.theme}
              sheetsManager={this.theme.sheetsManager}
            >
            
              <ThemeProvider theme={this.theme.theme}>
            <>
            <CssBaseline />
            <GlobalStyle whiteColor />
            <Component pageContext={this.theme} {...pageProps}/>
            </>
          </ThemeProvider>
          </MuiThemeProvider>
          </JssProvider>
        </NoSsr>
      </Container>
    );
  }
}

export default appWithTranslation(MyApp)
