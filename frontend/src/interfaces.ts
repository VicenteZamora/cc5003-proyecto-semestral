export interface Game {
  id: string;
  name: string;
  genre: string;
  platform: string;
  description: string;
  guides?: Guide[];
  image: string;
}

export interface Guide {
  id: string;
  title: string;
  content: string;
  tags: string;
  game: string | { id: string; name: string };
  author?: {
    username: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string | Date;
  author?: {
    id?: string;
    _id?: string;
    username: string;
  };
  guide?: string | {
    id: string;
    title: string;
    game?: {
      id: string;
      name: string;
    };
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  posts: Array<string>;
}

export interface UserProfile {
  id: string;
  username: string;
  guides: Guide[];
  posts: Comment[];
  stats: {
    totalGuides: number;
    totalPosts: number;
  };
}

