// src/utils/api.ts
import wordsData from '../data/words.json';

// Rastgele bir kelime seçme fonksiyonu
export const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * wordsData.words.length);
  return wordsData.words[randomIndex];
};