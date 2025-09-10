export interface Game {
  name: string;
  genre: string;
  platform: string;
  guides: Array<number>;
}

export interface Guide {
  tags: string;
  title: string;
  content: string;
}
