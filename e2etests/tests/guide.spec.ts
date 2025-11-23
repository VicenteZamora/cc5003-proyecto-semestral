import { test, expect } from '@playwright/test';
import { 
    resetDatabase,
    createTestUser,
    createTestGame,
    createTestGuide,
    createAuthenticatedContext,
    testPosts,
    loginUser
} from './helpers/test-helpers';

test.describe('View Guides Flow', () => {

    test.beforeEach(async ({ page }) => {
        await resetDatabase();
        
        const userBody = await createTestUser(testPosts.user.username, testPosts.user.password);
        const gameBody = await createTestGame(testPosts.game.name, testPosts.game.genre, testPosts.game.platform, testPosts.game.description, testPosts.game.image);
        
        // Crear contexto autenticado con CSRF
        const authContext = await createAuthenticatedContext(testPosts.user.username, testPosts.user.password);
        
        // Crear guía
        const guideBody = await createTestGuide(
            authContext,
            gameBody.id, 
            testPosts.guide.tags, 
            testPosts.guide.title, 
            testPosts.guide.content
        );
        
        // Cerrar el contexto
        await authContext.context.dispose();
        
        await page.goto('/login');
        await loginUser(page, testPosts.user.username, testPosts.user.password);
    });

    test('debería verse un juego', async ({ page }) => {
        await expect(page.getByRole('link', { name: testPosts.game.name }).first()).toBeVisible();
    });

    test('debería verse la informacion de un juego al entrar en su pagina', async ({ page }) => {
        await page.getByRole('link', { name: testPosts.game.name }).first().click();
        await expect(page).toHaveURL(/.*games/);

        await expect(page.getByRole('heading', { name: 'The Legend of Zelda: Breath of the Wild', exact: true })).toBeVisible();
        await expect(page.getByText(testPosts.game.description)).toBeVisible();
    });

    test('debería verse el formulario de guia al entrar en la pagina de un juego', async ({ page }) => {
        await page.getByRole('link', { name: testPosts.game.name }).first().click();
        await expect(page).toHaveURL(/.*games/);

        await expect(page.getByText("Crea una guía para " + testPosts.game.name)).toBeVisible();
        await expect(page.getByText("Título de la guía *")).toBeVisible();
        await expect(page.getByText('Etiquetas', { exact: true })).toBeVisible();
        await expect(page.getByText("Contenido de la guía *")).toBeVisible();
        await expect(page.getByRole('button', { name: 'Crear guía' })).toBeVisible();
    });

    test('debería verse la guia creada anteriormente', async ({ page }) => {
        await page.getByRole('link', { name: testPosts.game.name }).first().click();
        await expect(page).toHaveURL(/.*games/);

        await page
        .getByRole('link')
        .filter({ hasText: testPosts.guide.title })
        .click();

        await expect(page).toHaveURL(/.*guides/);

        await expect(page.getByText(testPosts.guide.title)).toBeVisible();
        await expect(page.getByText(testPosts.guide.content)).toBeVisible();
        await expect(page.locator('section').getByText('testuser')).toBeVisible();
    });
});

test.describe('Create Guides Flow', () => {

    test.beforeEach(async ({ page }) => {
        await resetDatabase();
        
        const userBody = await createTestUser(testPosts.user.username, testPosts.user.password);
        const gameBody = await createTestGame(testPosts.game.name, testPosts.game.genre, testPosts.game.platform, testPosts.game.description, testPosts.game.image);
        
        const authContext = await createAuthenticatedContext(testPosts.user.username, testPosts.user.password);
        
        await createTestGuide(
            authContext,
            gameBody.id, 
            testPosts.guide.tags, 
            testPosts.guide.title, 
            testPosts.guide.content
        );
        
        await authContext.context.dispose();

        await page.goto('/login');
        await loginUser(page, testPosts.user.username, testPosts.user.password);
    });

    test('debería poder usarse el formulario de guia al entrar en la pagina de un juego', async ({ page }) => {
        await page.getByRole('link', { name: testPosts.game.name }).first().click();
        await expect(page).toHaveURL(/.*games/);

        await expect(page.getByText("Crea una guía para " + testPosts.game.name)).toBeVisible();
        await expect(page.getByRole('button', { name: 'Crear guía' })).toBeVisible();

        await page.getByLabel('Título de la guía *').fill("TITULO");
        await page.getByLabel('Etiquetas').fill("GUERRA, PELEA, OTROS");
        await page.getByLabel('Contenido de la guía *').fill("CONTENIDO");
        await page.getByRole('button', { name: 'Crear guía' }).click();

        await expect(page.getByText("TITULO")).toBeVisible();
        await expect(page.getByText("GUERRA")).toBeVisible();
        await expect(page.getByText("PELEA")).toBeVisible();
        await expect(page.getByText("OTROS")).toBeVisible();
    });
});

test.describe('Guides Authorization - Unauthenticated Users', () => {

    test.beforeEach(async ({ page }) => {
        await resetDatabase();
        
        const userBody = await createTestUser(testPosts.user.username, testPosts.user.password);
        const gameBody = await createTestGame(testPosts.game.name, testPosts.game.genre, testPosts.game.platform, testPosts.game.description, testPosts.game.image);
        
        const authContext = await createAuthenticatedContext(testPosts.user.username, testPosts.user.password);
        
        await createTestGuide(
            authContext,
            gameBody.id, 
            testPosts.guide.tags, 
            testPosts.guide.title, 
            testPosts.guide.content
        );
        
        await authContext.context.dispose();

        await page.goto('/');
    });

    test('no debería ver el formulario de crear guía sin estar autenticado', async ({ page }) => {
        // Navegar a la página del juego
        await page.getByRole('link', { name: testPosts.game.name }).first().click();
        await expect(page).toHaveURL(/.*games/);

        // Verificar que NO está el formulario de crear guías
        await expect(page.getByText("Crea una guía para " + testPosts.game.name)).toBeVisible();
        await expect(page.getByRole('button', { name: 'Crear guía' })).not.toBeVisible();
        
        // Verificar que hay un mensaje para iniciar sesión
        await expect(page.getByText("Debes iniciar sesión para crear una guía")).toBeVisible();
        await expect(page.getByRole('button', { name: 'Iniciar sesión' })).toBeVisible();
    });

    test('debería poder ver las guías existentes sin estar autenticado', async ({ page }) => {
        // Navegar a la página del juego
        await page.getByRole('link', { name: testPosts.game.name }).first().click();
        await expect(page).toHaveURL(/.*games/);

        // Verificar que SÍ puede ver las guías existentes
        await expect(page.getByRole('link').filter({ hasText: testPosts.guide.title })).toBeVisible();
        
        // Hacer clic en la guía
        await page.getByRole('link').filter({ hasText: testPosts.guide.title }).click();
        await expect(page).toHaveURL(/.*guides/);

        // Verificar que puede ver el contenido de la guía
        await expect(page.getByText(testPosts.guide.title)).toBeVisible();
        await expect(page.getByText(testPosts.guide.content)).toBeVisible();
    });
});