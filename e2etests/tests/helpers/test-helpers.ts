import { Page, request } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export const testPosts = {
  user: {
      username: 'testuser',
      password: 'testpassword123'
  },
  game: {
      name: "The Legend of Zelda: Breath of the Wild",
      genre: "Action-Adventure",
      platform: "Nintendo Switch",
      description: "Explora un vasto mundo.",
      guides: [],
      image: "The Legend of Zelda: Breath of the Wild",
  },
  guide: {
      tags: "beginner,combat,tips",
      title: "Guía para principiantes - Zelda BOTW",
      content: "Contenido de la guia",
  },
  comment: {
    content: "¡The Legend of Zelda: Breath of the Wild!",
  },
};

// Resetea la base de datos 
export async function resetDatabase() {
  const context = await request.newContext();
  await context.post(`${API_URL}/api/testing/reset`);
  await context.dispose();
}


// Crea usuario
export async function createTestUser(
  username: string, 
  password: string, 
  email?: string
) {
  const context = await request.newContext();
  const userEmail = email || `${username}@test.com`;
  
  const response = await context.post(`${API_URL}/api/users`, {
    data: {
      username,
      password,
      email: userEmail,
    },
  });
  const body = await response.json();
  await context.dispose();

  return body;
}


// Crea juego
export async function createTestGame(
    name: string,
    genre: string,
    platform: string,
    description: string,
    image: string,
  ) {
  const context = await request.newContext();
  const response = await context.post(`${API_URL}/api/games`, {
    data: {
      name,
      genre,
      platform,
      description,
      image
    },
  });
  const body = await response.json();
  await context.dispose();

  return body;
};


// Crea guia
export async function createTestGuide(
  userId: String,
  gameId: String,
  tags: String,
  title: String,
  content: String,
) {

  const context = await request.newContext();
  const response = await context.post(`${API_URL}/api/guides`, {
    data: {
      tags,
      title,
      content,
      author: userId,
      game: gameId,
    },
  });
  const body = await response.json();
  await context.dispose();

  return body;
}


// Crea comentario
export async function createTestComment(
  userId: String,
  guideId: String,
) {
  const context = await request.newContext();
  const comment = testPosts.comment.content;

  const response = await context.post(`${API_URL}/api/posts/guide/${guideId}`, {
    data: {
      comment,
      userId,
      guideId,
    },
  });
  const body = await response.json();
  await context.dispose();

  return body;
}


// Loguea al usuario
export async function loginUser(page: Page, username: string, password: string) {
  await page.goto('/login');
  await page.getByLabel('Usuario').fill(username);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: 'Ingresar' }).click();
}

