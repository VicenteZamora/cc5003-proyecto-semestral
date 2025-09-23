export interface Game {
  id: number;
  name: string;
  genre: string;
  platform: string;
  description: string;
  guides: Array<number>;
  image: string;
}

export interface Guide {
  tags: string;
  title: string;
  content: string;
  author: string;
}

export interface Comment {
  content: string;
  author: string;
}
