import { FortuneResult } from '../types';

const STORAGE_KEY = 'cat-fortune-result';
const DATE_KEY = 'cat-fortune-date';

export const getStoredFortune = (): FortuneResult | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const storedDate = localStorage.getItem(DATE_KEY);
  
  if (!stored || !storedDate) {
    return null;
  }

  const today = new Date().toDateString();
  if (storedDate !== today) {
    // 清除過期的資料
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DATE_KEY);
    return null;
  }

  return JSON.parse(stored) as FortuneResult;
};

export const saveFortune = (result: FortuneResult): void => {
  const today = new Date().toDateString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  localStorage.setItem(DATE_KEY, today);
};

export const hasDrawnToday = (): boolean => {
  return getStoredFortune() !== null;
};

