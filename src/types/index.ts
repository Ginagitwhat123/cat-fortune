export interface Fortune {
  stars: number;
  message: string;
}

export interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

export interface FortuneResult {
  catImage: CatImage;
  fortune: Fortune;
  date: string;
}

