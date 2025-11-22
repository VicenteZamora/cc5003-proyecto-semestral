import { test, expect } from '@playwright/test';
import { 
    resetDatabase,
    createTestUser,
    createTestGame,
    createTestGuide,
    createTestComment,
    testPosts,
    loginUser
} from './helpers/test-helpers';

test.describe('View Comments Flow', () => {

    test.beforeEach(async ({ page }) => {
        // Resetear la base de datos antes de cada test
        await resetDatabase();
        
        // Crear un usuario de prueba
        const userBody = await createTestUser(testPosts.user.username, testPosts.user.password);
        const gameBody = await createTestGame(testPosts.game.name, testPosts.game.genre, testPosts.game.platform, testPosts.game.description, testPosts.game.image);
        const guideBody = await createTestGuide(userBody.id, gameBody.id, testPosts.guide.tags, testPosts.guide.title, testPosts.guide.content);

        await createTestComment(userBody.id, guideBody.id);

        // Navegar a la página de login
        await page.goto('/login');

        // Iniciar sesion con el usuario
        await loginUser(page, testPosts.user.username, testPosts.user.password);

        // Clickeamos un juego y una guia
        await page.getByRole('link', { name: testPosts.game.name }).first().click();
        await page.getByRole('link', { name: testPosts.guide.title }).first().click();
        await expect(page).toHaveURL(/.*guides/);
    });

    test('debería verse un comentario', async ({ page }) => {
        // Contenido y cantidad
        await expect(page.getByText(testPosts.comment.content)).toBeVisible();
        await expect(page.getByText(testPosts.user.username)).toBeVisible();
        await expect(page.getByText("Comentarios (1)")).toBeVisible();
    });
});

test.describe('Create Comments Flow', () => {

    test.beforeEach(async ({ page }) => {
        // Resetear la base de datos antes de cada test
        await resetDatabase();
        
        // Crear un usuario de prueba
        const userBody = await createTestUser(testPosts.user.username, testPosts.user.password);
        const gameBody = await createTestGame(testPosts.game.name, testPosts.game.genre, testPosts.game.platform, testPosts.game.description, testPosts.game.image);
        const guideBody = await createTestGuide(userBody.id, gameBody.id, testPosts.guide.tags, testPosts.guide.title, testPosts.guide.content);

        // Navegar a la página de login
        await page.goto('/login');

        // Iniciar sesion con el usuario
        await loginUser(page, testPosts.user.username, testPosts.user.password);

        // Clickeamos un juego y una guia
        await page.getByRole('link', { name: testPosts.game.name }).first().click();
        await page.getByRole('link', { name: testPosts.guide.title }).first().click();
        await expect(page).toHaveURL(/.*guides/);
    });

    test('debería poder usarse el formulario de comentario al entrar la guia de un juego', async ({ page }) => {
        // No hay comentarios
        await expect(page.getByText("Añadir comentario")).toBeVisible();
        
        // Se rellena con informacion de prueba
        await page.getByLabel('Tu comentario *').fill("COMENTARIO");
        await expect(page.getByRole('button', { name: 'Publicar Comentario' })).toBeVisible();

        // Se ve el comentario y quien la creo
        await expect(page.getByText("COMENTARIO")).toBeVisible();
        await expect(page.getByText(testPosts.user.username)).toBeVisible();
        await expect(page.getByText("Hace un momento")).toBeVisible();
    });
});