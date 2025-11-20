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
  id: string | number;
  content: string;
  createdAt: string | Date;
  author?: {
    username: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  posts: Array<string>;
}
