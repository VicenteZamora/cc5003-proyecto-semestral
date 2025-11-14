import { Page, request } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export async function resetDatabase() {
  const context = await request.newContext();
  await context.post(`${API_URL}/api/testing/reset`);
  await context.dispose();
}

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
  await context.dispose();
  return response;
}

export async function loginUser(page: Page, username: string, password: string) {
  await page.goto('/login');
  await page.getByLabel('Usuario').fill(username);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: 'Ingresar' }).click();
}