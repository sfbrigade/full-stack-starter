import { Container, Title } from '@mantine/core';
import { useHead } from '@unhead/react';

function Home () {
  useHead({
    title: 'Home',
  });

  return (
    <>
      <Container>
        <Title>Home</Title>
      </Container>
    </>
  );
}

export default Home;
