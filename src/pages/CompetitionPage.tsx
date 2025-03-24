import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRandomWord } from '../utils/api';
import styled from 'styled-components';
import Confetti from 'react-confetti';


const MAX_ATTEMPTS =5 ; //5 tahmin hakkı

const Container = styled.div`
  text-align: center;
  
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #007bff;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  margin-right: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;
  color:black;
  background-color: white;

  &:focus {
    border-color: #007bff;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const Row = styled.div`
  display: flex;
  gap: 5px;
  justify-content: center;
`;

const Cell = styled.div<{ filled: boolean; color?: string }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ccc;
  border-radius: 5px;
  background-color: ${(props) => (props.filled ? props.color : 'transparent')};
  color: white;
  font-weight: bold;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  z-index: 1000;
  color: black;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
`;

const CheckboxInput = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #007bff;
  border-radius: 5px;
  cursor: pointer;
  position: relative;

  &:checked {
    background-color: #007bff;
  }

  &:checked::after {
    content: '✔';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
  }
`;

const CompetitionPage: React.FC = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const wordLength = parseInt(queryParams.get('length') || '5', 10);


  const [word, setWord] = useState<string>('');
  const [guess, setGuess] = useState<string>('');
  const [attempts, setAttempts] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isWinner, setIsWinner] = useState<boolean>(false);


  // Checkbox ve rastgele harf için state'ler
  const [showRandomLetter, setShowRandomLetter] = useState<boolean>(() => {
    // localStorage'dan checkbox durumunu oku
    const savedSetting = localStorage.getItem('showRandomLetter');
    return savedSetting === 'true';
  });
  const [revealedLetterIndex, setRevealedLetterIndex] = useState<number | null>(null);

  
  useEffect(() => {
    const randomWord = getRandomWord(wordLength);
    setWord(randomWord);
    // Eğer checkbox açıksa, rastgele bir harfi aç
    if (showRandomLetter) {
      const randomIndex = Math.floor(Math.random() * wordLength); 
      setRevealedLetterIndex(randomIndex);
    } else {
      setRevealedLetterIndex(null); // Harfi gizle
    }

    // Checkbox durumunu localStorage'a kaydet
    localStorage.setItem('showRandomLetter', showRandomLetter.toString());
  }, [showRandomLetter]);

  const handleGuess = () => {
    if (guess.length === wordLength) {
      const newAttempts = [...attempts, guess];
      setAttempts(newAttempts);

      if (guess === word) {
        setTimeout(() => {
          setIsWinner(true);
          setShowModal(true);
        }, 1000);
      } else if (newAttempts.length >= MAX_ATTEMPTS) {
        setTimeout(() => {
          setShowModal(true);
        }, 1000);
      }

      setGuess('');
    } else {
      alert(`Lütfen ${wordLength} harfli bir kelime girin.`);
    }
  };

  const handleContinue = () => {
    const newWord = getRandomWord();
    setWord(newWord);
    setAttempts([]);
    setIsWinner(false);
    setShowModal(false);
  };

  const renderGrid = () => {
    const grid = [];
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const attempt = attempts[i] || '';
      grid.push(
        <Row key={i}>
          {Array.from({ length: wordLength }).map((_, j) => {
            const letter = attempt[j] || '';
            let color = '#ccc';
            let displayLetter = '';
            
            // Açık harf sadece ilk satırda ve doğru pozisyondaysa gösterilsin
            if (i === 0 && revealedLetterIndex !== null && j === revealedLetterIndex) {
              displayLetter = word[j];
              color = 'green';
               // Eğer bu pozisyonda tahmin yapıldıysa ve harf doğru değilse kırmızı yap
            if (letter && letter !== displayLetter) {
              color = '#ff4444'; // Kırmızı (yanlış harf)
            }
            }

        // Tahmin edilen harfleri kontrol et (sadece açık harf pozisyonu değilse)
        if (letter && !(i === 0 && j === revealedLetterIndex)) {
          if (word[j] === letter) {
            color = 'green';
          } else if (word.includes(letter)) {
            const letterCountInWord = word.split('').filter((char) => char === letter).length;
            const letterCountInAttempt = attempt.split('').filter((char) => char === letter).length;
            if (letterCountInAttempt <= letterCountInWord) {
              color = 'yellow';
            }
          }
        }

            return (
              <Cell key={j} filled={!!letter || !!displayLetter} color={color}>
                {letter || displayLetter}
              </Cell>
            );
          })}
        </Row>
      );
    }
    return grid;
  };


  return (
    <Container>
     <Title>Wordle Türkiye Yarışması - {wordLength} Harfli Kelime</Title>

      {/* Checkbox */}
      <CheckboxContainer>
        <CheckboxLabel>
          <CheckboxInput
            type="checkbox"
            checked={showRandomLetter}
            onChange={() => setShowRandomLetter(!showRandomLetter)}
          />
          Rastgele Bir Harf Açık Başla
        </CheckboxLabel>
      </CheckboxContainer>

    
      <Input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value.toUpperCase())}
        maxLength={wordLength}
      />
      <Button onClick={handleGuess}>Tahmin Et</Button>
      <GridContainer>
        {renderGrid()}
      </GridContainer>

     
      {isWinner && <Confetti />}
      {showModal && (
        <>
          <Overlay />
          <Modal>
            {isWinner ? (
              <>
                <h2>Tebrikler! 🎉</h2>
                <p>Kelimeyi doğru tahmin ettiniz: <strong>{word}</strong></p>
              </>
            ) : (
              <>
                <h2>Kaybettiniz! 😢</h2>
                <p>Bilemediğiniz kelime: <strong>{word}</strong></p>
              </>
            )}
            <ModalButton onClick={handleContinue}>Devam Et</ModalButton>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default CompetitionPage;