import { CatImage } from '../types';

export const fetchCatImage = async (): Promise<CatImage> => {
  const response = await fetch('https://api.thecatapi.com/v1/images/search');
  if (!response.ok) {
    throw new Error('無法取得貓咪圖片');
  }
  const data = await response.json();
  return data[0] as CatImage;
};

