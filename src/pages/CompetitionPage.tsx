import React, { useState, useEffect } from 'react';
import { getRandomWord } from '../utils/api';
import styled from 'styled-components';
import Confetti from 'react-confetti';

const MAX_ATTEMPTS = 5; // Maksimum tahmin hakkı

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

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  margin-right: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;

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
    const randomWord = getRandomWord();
    setWord(randomWord);

    // Eğer checkbox açıksa, rastgele bir harfi aç
    if (showRandomLetter) {
      const randomIndex = Math.floor(Math.random() * 5); // 0 ile 4 arasında rastgele bir indeks
      setRevealedLetterIndex(randomIndex);
    } else {
      setRevealedLetterIndex(null); // Harfi gizle
    }

    // Checkbox durumunu localStorage'a kaydet
    localStorage.setItem('showRandomLetter', showRandomLetter.toString());
  }, [showRandomLetter]);

  const handleGuess = () => {
    if (guess.length === 5) {
      const newAttempts = [...attempts, guess]; // Yeni tahmini ekle
      setAttempts(newAttempts);

      if (guess === word) {
        // Kelime doğru bilindiğinde
        setTimeout(() => {
          setIsWinner(true);
          setShowModal(true);
        }, 1000); // 1 saniye sonra popup'ı göster
      } else if (newAttempts.length >= MAX_ATTEMPTS) {
        // Tahmin hakkı bittiğinde
        setTimeout(() => {
          setShowModal(true);
        }, 1000); // 1 saniye sonra popup'ı göster
      }

      setGuess('');
    } else {
      alert('Lütfen 5 harfli bir kelime girin.');
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
          {Array.from({ length: 5 }).map((_, j) => {
            const letter = attempt[j] || '';
            let color = '#ccc'; // Varsayılan renk (gri)

            // Harf doğru pozisyondaysa yeşil yap
            if (word[j] === letter) {
              color = 'green';
            } else if (word.includes(letter)) {
              // Harf kelimede varsa ama yanlış pozisyondaysa sarı yap
              const letterCountInWord = word.split('').filter((char) => char === letter).length;
              const letterCountInAttempt = attempt.split('').filter((char) => char === letter).length;

              // Eğer tahmin edilen kelimede bu harf daha fazla kullanılmışsa, sarı yapma
              if (letterCountInAttempt <= letterCountInWord) {
                color = 'yellow';
              }
            }

            // Checkbox açıksa ve bu harf rastgele açılan harfse, yeşil yap
            let displayLetter = '';
            if (i === 0 && revealedLetterIndex !== null && j === revealedLetterIndex) {
              displayLetter = word[j];
              color = 'green'; // Doğru harf olduğu için yeşil
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
      <Title>Lingo Yarışması</Title>

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

      {/* Diğer bileşenler */}
      <p>Tahmin etmeniz gereken kelime: {word}</p>
      <Input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value.toUpperCase())}
        maxLength={5}
      />
      <Button onClick={handleGuess}>Tahmin Et</Button>
      <GridContainer>
        {renderGrid()}
      </GridContainer>

      {/* Popup ve diğer bileşenler */}
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