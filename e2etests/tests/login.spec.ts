import { test, expect } from '@playwright/test';
import { resetDatabase, createTestUser, loginUser } from './helpers/test-helpers';

test.describe('Login Flow', () => {
  const testUser = {
    username: 'testuser',
    password: 'testpassword123'
  };

  test.beforeEach(async ({ page }) => {
    // Resetear la base de datos antes de cada test
    await resetDatabase();
    
    // Crear un usuario de prueba
    await createTestUser(testUser.username, testUser.password);
    
    // Navegar a la página de login
    await page.goto('/login');
  });

  test('debería mostrar el formulario de login', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible();
    await expect(page.getByLabel('Usuario')).toBeVisible();
    await expect(page.getByLabel('Contraseña')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Crear cuenta' })).toBeVisible();
  });

  test('debería mostrar error con credenciales incorrectas', async ({ page }) => {
    await page.getByLabel('Usuario').fill('usuarioincorrecto');
    await page.getByLabel('Contraseña').fill('passwordincorrecto');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    
    // Esperar a que aparezca el mensaje de error
    await expect(page.getByText('Invalid username or password')).toBeVisible();
    
    // Verificar que sigue en la página de login
    await expect(page).toHaveURL(/.*login/);
    
    // Verificar que el mensaje desaparece después de 5 segundos
    await expect(page.getByText('Invalid username or password')).toBeHidden({ timeout: 6000 });
  });

  test('debería hacer login exitosamente con credenciales correctas', async ({ page }) => {
    await page.getByLabel('Usuario').fill(testUser.username);
    await page.getByLabel('Contraseña').fill(testUser.password);
    await page.getByRole('button', { name: 'Ingresar' }).click();
    
    // Esperar a que se redirija a la página principal
    await expect(page).toHaveURL('/');
    
    // Verificar que el nombre de usuario aparezca en el navbar
    await expect(page.getByText(testUser.username)).toBeVisible();
    
    // Verificar que el botón de cerrar sesión esté visible
    await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible();
    
    // Verificar que NO aparezca el botón de iniciar sesión
    await expect(page.getByRole('link', { name: 'Iniciar sesión' })).not.toBeVisible();
  });

  test('debería navegar a la página de registro', async ({ page }) => {
    await page.getByRole('button', { name: 'Crear cuenta' }).click();
    await expect(page).toHaveURL(/.*register/);
  });

  test('no debería permitir enviar el formulario con campos vacíos', async ({ page }) => {
    const ingresarButton = page.getByRole('button', { name: 'Ingresar' });
    
    // Intentar hacer click sin llenar campos
    await ingresarButton.click();
    
    // Verificar que sigue en la página de login (HTML5 validation previene el submit)
    await expect(page).toHaveURL(/.*login/);
  });

  test('debería limpiar el formulario después de un error', async ({ page }) => {
    const usuarioInput = page.getByLabel('Usuario');
    const passwordInput = page.getByLabel('Contraseña');
    
    // Intentar login con credenciales incorrectas
    await usuarioInput.fill('usuarioincorrecto');
    await passwordInput.fill('passwordincorrecto');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    
    // Esperar el mensaje de error
    await expect(page.getByText('Invalid username or password')).toBeVisible();
    
    // Los campos deberían seguir con los valores (para que el usuario pueda corregir)
    await expect(usuarioInput).toHaveValue('usuarioincorrecto');
    await expect(passwordInput).toHaveValue('passwordincorrecto');
  });
});

test.describe('Logout Flow', () => {
  const testUser = {
    username: 'logoutuser',
    password: 'logoutpass123'
  };

  test.beforeEach(async () => {
    await resetDatabase();
    await createTestUser(testUser.username, testUser.password);
  });

  test('debería cerrar sesión correctamente', async ({ page }) => {
    // Hacer login usando el helper
    await loginUser(page, testUser.username, testUser.password);
    
    // Verificar que está logueado
    await expect(page).toHaveURL('/');
    await expect(page.getByText(testUser.username)).toBeVisible();
    
    // Hacer click en cerrar sesión
    await page.getByRole('button', { name: 'Cerrar sesión' }).click();
    
    // Verificar que vuelva a la página principal
    await expect(page).toHaveURL('/');
    
    // Verificar que aparezca el botón de iniciar sesión
    await expect(page.getByRole('link', { name: 'Iniciar sesión' })).toBeVisible();
    
    // Verificar que no aparezca el nombre de usuario
    await expect(page.getByText(testUser.username)).not.toBeVisible();
    
    // Verificar que no aparezca el botón de cerrar sesión
    await expect(page.getByRole('button', { name: 'Cerrar sesión' })).not.toBeVisible();
  });
});

test.describe('Session Persistence', () => {
  const testUser = {
    username: 'persistuser',
    password: 'persistpass123'
  };

  test.beforeEach(async () => {
    await resetDatabase();
    await createTestUser(testUser.username, testUser.password);
  });

  test('debería mantener la sesión después de recargar la página', async ({ page }) => {
    await loginUser(page, testUser.username, testUser.password);
    
    await expect(page).toHaveURL('/');
    await expect(page.getByText(testUser.username)).toBeVisible();
    
    // Recargar la página
    await page.reload();
    
    // Verificar que la sesión se mantiene
    await expect(page.getByText(testUser.username)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible();
  });

  test('debería mantener la sesión al navegar entre páginas', async ({ page }) => {
    await loginUser(page, testUser.username, testUser.password);
    
    await expect(page).toHaveURL('/');
    
    // Navegar a otra página (ajusta según tus rutas)
    await page.getByRole('link', { name: 'Juegos' }).click();
    
    // Verificar que sigue logueado
    await expect(page.getByText(testUser.username)).toBeVisible();
    
    // Navegar al perfil
    await page.getByRole('link', { name: 'persistuser' }).click(); 
    
    // Verificar que sigue logueado
    await expect(page.getByText(testUser.username)).toBeVisible();
  });

  test('no debería tener sesión en una nueva pestaña sin localStorage', async ({ context }) => {
    // Crear una nueva página sin datos previos
    const page = await context.newPage();
    await page.goto('/');
    
    // Verificar que NO está logueado
    await expect(page.getByRole('link', { name: 'Iniciar sesión' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cerrar sesión' })).not.toBeVisible();
  });
});