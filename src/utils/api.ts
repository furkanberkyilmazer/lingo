import words4 from '../data/words4.json';
import words5 from '../data/words5.json';
import words6 from '../data/words6.json';
import words7 from '../data/words7.json';

const wordLists: Record<number, { words: string[] }> = {
  4: words4,
  5: words5,
  6: words6,
  7: words7
};

export const getRandomWord = (length: number = 5): string => {
  const wordList = wordLists[length];
  if (!wordList) {
    throw new Error(`Desteklenmeyen kelime uzunluğu: ${length}`);
  }
  const randomIndex = Math.floor(Math.random() * wordList.words.length);
  return wordList.words[randomIndex];
};