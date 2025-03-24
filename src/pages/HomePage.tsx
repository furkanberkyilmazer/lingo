import React, { useState } from 'react';
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

const LengthSelector = styled.div`
  margin: 20px 0;
`;

const LengthButton = styled.button<{ selected: boolean }>`
  margin: 5px;
  padding: 10px 15px;
  font-size: 1rem;
  background-color: ${props => props.selected ? '#007bff' : '#e0e0e0'};
  color: ${props => props.selected ? 'white' : '#333'};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.selected ? '#0056b3' : '#d0d0d0'};
  }
`;

const StartButton = styled(Link)`
  padding: 15px 30px;
  font-size: 1.2rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  margin-top: 20px;
  display: inline-block;

  &:hover {
    background-color: #0056b3;
  }
`;

const HomePage: React.FC = () => {
  const [selectedLength, setSelectedLength] = useState<number>(5);

  return (
    <Container>
      <Title>Wordle Türkiye Yarışması</Title>
      <Description>
        Kelimeleri tahmin etmeye hazır mısın? Kelime uzunluğunu seç ve başla!
      </Description>
      
      <LengthSelector>
        <p>Kelime uzunluğu seçin:</p>
        {[4, 5, 6, 7].map(length => (
          <LengthButton
            key={length}
            selected={selectedLength === length}
            onClick={() => setSelectedLength(length)}
          >
            {length} Harfli
          </LengthButton>
        ))}
      </LengthSelector>
      
      <StartButton to={`/competition?length=${selectedLength}`}>
        Yarışmayı Başlat
      </StartButton>
    </Container>
  );
};

export default HomePage;