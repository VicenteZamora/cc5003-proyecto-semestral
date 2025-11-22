import { test, expect } from '@playwright/test';
import { 
    resetDatabase,
    createTestUser,
    createTestGame,
    createTestGuide,
    testPosts,
    loginUser
} from './helpers/test-helpers';

test.describe('View Guides Flow', () => {

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
    });

    test('debería verse un juego', async ({ page }) => {
        await expect(page.getByRole('link', { name: testPosts.game.name }).first()).toBeVisible();
    });

    test('debería verse la informacion de un juego al entrar en su pagina', async ({ page }) => {
        // Clickeamos en la imagen y vemos si la url cambia
        await page.getByRole('link', { name: testPosts.game.name }).first().click();
        await expect(page).toHaveURL(/.*games/);

        // Se busca la informacion del juego
        await expect(page.getByRole('heading', { name: 'The Legend of Zelda: Breath of the Wild', exact: true })).toBeVisible();
        await expect(page.getByText(testPosts.game.description)).toBeVisible();
    });

    test('debería verse el formulario de guia al entrar en la pagina de un juego', async ({ page }) => {
        // Clickeamos en la imagen y vemos si la url cambia
        await page.getByRole('link', { name: testPosts.game.name }).first().click();
        await expect(page).toHaveURL(/.*games/);

        // Se busca el formulario de creacion de guias
        await expect(page.getByText("Crea una guía para " + testPosts.game.name)).toBeVisible();
        await expect(page.getByText("Título de la guía *")).toBeVisible();
        await expect(page.getByText('Etiquetas', { exact: true })).toBeVisible();
        await expect(page.getByText("Contenido de la guía *")).toBeVisible();
        await expect(page.getByRole('button', { name: 'Crear guía' })).toBeVisible();
    });

    test('debería verse la guia creada anteriormente', async ({ page }) => {
        // Clickeamos en la imagen y vemos si la url cambia
        await page.getByRole('link', { name: testPosts.game.name }).first().click();
        await expect(page).toHaveURL(/.*games/);

        // Clickeamos en la guia
        await page
        .getByRole('link')
        .filter({ hasText: testPosts.guide.title })
        .click();

        await expect(page).toHaveURL(/.*guides/);

        // Buscamos la informacion almacenada
        await expect(page.getByText(testPosts.guide.title)).toBeVisible();
        await expect(page.getByText(testPosts.guide.content)).toBeVisible();
        await expect(page.getByText(testPosts.user.username)).toBeVisible();
    });
});

test.describe('Create Guides Flow', () => {

    test.beforeEach(async ({ page }) => {
        // Resetear la base de datos antes de cada test
        await resetDatabase();
        
        // Crear un usuario de prueba
        const userBody = await createTestUser(testPosts.user.username, testPosts.user.password);
        const gameBody = await createTestGame(testPosts.game.name, testPosts.game.genre, testPosts.game.platform, testPosts.game.description, testPosts.game.image);
        
        await createTestGuide(userBody.id, gameBody.id, testPosts.guide.tags, testPosts.guide.title, testPosts.guide.content);

        // Navegar a la página de login
        await page.goto('/login');

        // Iniciar sesion con el usuario
        await loginUser(page, testPosts.user.username, testPosts.user.password);
    });

    test('debería poder usarse el formulario de guia al entrar en la pagina de un juego', async ({ page }) => {
        // Clickeamos en la imagen y vemos si la url cambia
        await page.getByRole('link', { name: testPosts.game.name }).first().click();
        await expect(page).toHaveURL(/.*games/);

        // Se busca el formulario de creacion de guias
        await expect(page.getByText("Crea una guía para " + testPosts.game.name)).toBeVisible();
        await expect(page.getByRole('button', { name: 'Crear guía' })).toBeVisible();

        // Se rellena con informacion de prueba
        await page.getByLabel('Título de la guía *').fill("TITULO");
        await page.getByLabel('Etiquetas').fill("TEST, DE, GUIA");
        await page.getByLabel('Contenido de la guía *').fill("CONTENIDO");
        await page.getByRole('button', { name: 'Crear guía' }).click();

        // Se ve la guia creada
        await expect(page.getByText("TITULO")).toBeVisible();
        await expect(page.getByText("CONTENIDO")).toBeVisible();

        // Las etiquetas se separan
        await expect(page.getByText("TEST")).toBeVisible();
        await expect(page.getByText("DE")).toBeVisible();
        await expect(page.getByText("GUIA")).toBeVisible();
    });
})