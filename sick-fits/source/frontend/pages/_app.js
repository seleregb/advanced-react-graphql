import App, { Container } from 'next/app';
import Page from '../components/Page';

class MyApp extends App {
  render() {
    const { Component } = this.props;

    return (
      <Container>
        <Page>
          <p>Hey I'm on Every page</p>
          <Component />
        </Page>
      </Container>
    );
  }
}

export default MyApp;