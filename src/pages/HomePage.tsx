import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #007bff;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 30px;
`;

const StartButton = styled(Link)`
  padding: 15px 30px;
  font-size: 1.2rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const HomePage: React.FC = () => {
  return (
    <Container>
      <Title>Wordle Türkiye Yarışması</Title>
      <Description>
        5 harfli kelimeleri tahmin etmeye hazır mısın? Hemen başla ve becerilerini test et!
      </Description>
      <StartButton to="/competition">Yarışmayı Başlat</StartButton>
    </Container>
  );
};

export default HomePage;