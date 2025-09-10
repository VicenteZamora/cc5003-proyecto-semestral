export interface Game {
  id: number;
  name: string;
  genre: string;
  platform: string;
  guides: Array<number>;
  image: string;
}

export interface Guide {
  tags: string;
  title: string;
  content: string;
}
