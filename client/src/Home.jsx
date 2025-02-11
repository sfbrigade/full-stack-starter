import { Container, Title } from '@mantine/core';
import { Helmet } from 'react-helmet-async';
import { useStaticContext } from './StaticContext';

function Home () {
  const staticContext = useStaticContext();
  return (
    <>
      <Helmet>
        <title>Home - {staticContext?.env?.VITE_SITE_TITLE ?? ''}</title>
      </Helmet>
      <Container>
        <Title>Home</Title>
      </Container>
    </>
  );
}

export default Home;
