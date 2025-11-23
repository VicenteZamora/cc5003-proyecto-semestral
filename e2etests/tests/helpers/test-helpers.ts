// test-helpers.ts
import { Page, request, APIRequestContext } from '@playwright/test';

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
      image: "image_link",
  },
  guide: {
      tags: "beginner, combat, tips",
      title: "Guía para principiantes - Zelda BOTW",
      content: "Contenido de la guia",
  },
  comment: {
    content: "Comentario de la Guia",
  },
};

// Tipo para el contexto autenticado con CSRF
interface AuthContext {
  context: APIRequestContext;
  csrfToken: string;
}

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
}

// ✅ Crear contexto autenticado y capturar CSRF token
export async function createAuthenticatedContext(
  username: string,
  password: string
): Promise<AuthContext> {
  const context = await request.newContext();
  
  // Hacer login para obtener la cookie y el CSRF token
  const response = await context.post(`${API_URL}/api/login`, {
    data: {
      username,
      password,
    },
  });
  
  if (!response.ok()) {
    const body = await response.json();
    await context.dispose();
    throw new Error(`Login failed: ${response.status()} - ${JSON.stringify(body)}`);
  }
  
  // ✅ Capturar el CSRF token del header de respuesta
  const csrfToken = response.headers()['x-csrf-token'];
  
  if (!csrfToken) {
    await context.dispose();
    throw new Error('CSRF token not found in response headers');
  }
    
  return { context, csrfToken };
}

// ✅ Crea guía con contexto autenticado y CSRF token
export async function createTestGuide(
  authContext: AuthContext,  // <-- Recibe el objeto completo
  gameId: string,
  tags: string,
  title: string,
  content: string,
) {
  const response = await authContext.context.post(`${API_URL}/api/guides`, {
    headers: {
      'X-CSRF-Token': authContext.csrfToken,  // ✅ Usar el CSRF token real
    },
    data: {
      tags,
      title,
      content,
      game: gameId,
    },
  });
  
  const body = await response.json();
  
  return body;
}

// Crea comentario con contexto autenticado
export async function createTestComment(
  authContext: AuthContext,
  guideId: string,
) {
  const response = await authContext.context.post(`${API_URL}/api/posts/guide/${guideId}`, {
    headers: {
      'X-CSRF-Token': authContext.csrfToken,
    },
    data: {
      content: testPosts.comment.content,
      guideId: guideId,
    },
  });
  
  const body = await response.json();

  return body;
}

// Actualizar comentario con contexto autenticado
export async function updateTestComment(
  authContext: AuthContext,
  commentId: string,
  content: string,
) {
  const response = await authContext.context.put(`${API_URL}/api/posts/${commentId}`, {
    headers: {
      'X-CSRF-Token': authContext.csrfToken,
    },
    data: {
      content: content,
    },
  });
  
  const body = await response.json();
  
  if (body.error) {
    console.error("Error updating comment:", body.error);
    console.log("Response status:", response.status());
  } else {
    console.log("Comment updated:", JSON.stringify(body, null, 2));
  }

  return body;
}

// Eliminar comentario con contexto autenticado
export async function deleteTestComment(
  authContext: AuthContext,
  commentId: string,
) {
  const response = await authContext.context.delete(`${API_URL}/api/posts/${commentId}`, {
    headers: {
      'X-CSRF-Token': authContext.csrfToken,
    },
  });
  
  console.log("Delete response status:", response.status());
  
  // El DELETE devuelve 204 sin body
  if (response.status() === 204) {
    console.log("Comment deleted successfully");
    return { success: true };
  } else {
    const body = await response.json();
    console.error("Error deleting comment:", body);
    return body;
  }
}

// Loguea al usuario en el navegador (para tests E2E)
export async function loginUser(page: Page, username: string, password: string) {
  await page.goto('/login');
  await page.getByLabel('Usuario').fill(username);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: 'Ingresar' }).click();
}