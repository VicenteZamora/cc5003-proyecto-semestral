import { test, expect } from '@playwright/test';
import { 
    resetDatabase,
    createTestUser,
    createTestGame,
    createTestGuide,
    createTestComment,
    createAuthenticatedContext,
    testPosts,
    loginUser
} from './helpers/test-helpers';

test.describe('View Comments Flow', () => {

    test.beforeEach(async ({ page }) => {
        await resetDatabase();
        
        const userBody = await createTestUser(testPosts.user.username, testPosts.user.password);
        const gameBody = await createTestGame(testPosts.game.name, testPosts.game.genre, testPosts.game.platform, testPosts.game.description, testPosts.game.image);
        
        const authContext = await createAuthenticatedContext(testPosts.user.username, testPosts.user.password);
        
        const guideBody = await createTestGuide(
            authContext,
            gameBody.id, 
            testPosts.guide.tags, 
            testPosts.guide.title, 
            testPosts.guide.content
        );

        await createTestComment(authContext, guideBody.id);
        
        await authContext.context.dispose();

        await page.goto('/login');
        await loginUser(page, testPosts.user.username, testPosts.user.password);

        await page.getByRole('link', { name: testPosts.game.name }).first().click();
        await page.getByRole('link', { name: testPosts.guide.title }).first().click();
        await expect(page).toHaveURL(/.*guides/);
    });

    test('debería verse un comentario', async ({ page }) => {
        await expect(page.getByText(testPosts.comment.content)).toBeVisible();
        await expect(page.getByText('testuser').nth(1)).toBeVisible();
        await expect(page.getByText("Comentarios (1)")).toBeVisible();
    });

    test('debería verse los botones de editar y eliminar en comentarios propios', async ({ page }) => {
        await expect(page.getByRole('button', { name: /editar/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /eliminar/i })).toBeVisible();
    });

});


test.describe('Create Comments Flow', () => {

    test.beforeEach(async ({ page }) => {
        await resetDatabase();
        
        const userBody = await createTestUser(testPosts.user.username, testPosts.user.password);
        const gameBody = await createTestGame(testPosts.game.name, testPosts.game.genre, testPosts.game.platform, testPosts.game.description, testPosts.game.image);
        
        const authContext = await createAuthenticatedContext(testPosts.user.username, testPosts.user.password);
        
        const guideBody = await createTestGuide(
            authContext,
            gameBody.id, 
            testPosts.guide.tags, 
            testPosts.guide.title, 
            testPosts.guide.content
        );
        
        await authContext.context.dispose();

        await page.goto('/login');
        await loginUser(page, testPosts.user.username, testPosts.user.password);

        await page.getByRole('link', { name: testPosts.game.name }).first().click();
        await page.getByRole('link', { name: testPosts.guide.title }).first().click();
        await expect(page).toHaveURL(/.*guides/);
    });

    test('debería poder usarse el formulario de comentario al entrar la guia de un juego', async ({ page }) => {
        await expect(page.getByText("Añadir comentario")).toBeVisible();
        
        await page.getByLabel('Tu comentario *').fill("BUENA GUIA");
        await page.getByRole('button', { name: 'Publicar Comentario' }).click();

        await expect(page.getByText("BUENA GUIA")).toBeVisible();
        await expect(page.getByText('testuser').nth(1)).toBeVisible();
        await expect(page.getByText('Hace un momento').first()).toBeVisible();
    });
});


test.describe('Edit Comments Flow', () => {

    test.beforeEach(async ({ page }) => {
        await resetDatabase();
        
        const userBody = await createTestUser(testPosts.user.username, testPosts.user.password);
        const gameBody = await createTestGame(testPosts.game.name, testPosts.game.genre, testPosts.game.platform, testPosts.game.description, testPosts.game.image);
        
        const authContext = await createAuthenticatedContext(testPosts.user.username, testPosts.user.password);
        
        const guideBody = await createTestGuide(
            authContext,
            gameBody.id, 
            testPosts.guide.tags, 
            testPosts.guide.title, 
            testPosts.guide.content
        );

        await createTestComment(authContext, guideBody.id);
        
        await authContext.context.dispose();

        await page.goto('/login');
        await loginUser(page, testPosts.user.username, testPosts.user.password);

        await page.getByRole('link', { name: testPosts.game.name }).first().click();
        await page.getByRole('link', { name: testPosts.guide.title }).first().click();
        await expect(page).toHaveURL(/.*guides/);
    });

    test('debería poder editar un comentario propio desde la UI', async ({ page }) => {
        const commentsSection = page.locator('div.bg-gray-800.rounded-xl').filter({ hasText: 'Comentarios (1)' });
        const commentCard = commentsSection.locator('div.bg-gray-900.rounded-lg').first();
        
        const commentParagraph = commentCard.locator('p.text-gray-200');
        await expect(commentParagraph).toHaveText(testPosts.comment.content);
        
        await commentCard.getByRole('button', { name: /editar/i }).click();
        
        const editTextarea = commentCard.locator('textarea');
        await expect(editTextarea).toBeVisible();
        await expect(editTextarea).toHaveValue(testPosts.comment.content);
        
        await editTextarea.clear();
        await editTextarea.fill("COMENTARIO EDITADO");
        
        await commentCard.getByRole('button', { name: /guardar/i }).click();
        
        await expect(editTextarea).not.toBeVisible();
        
        await expect(commentParagraph).toHaveText("COMENTARIO EDITADO");
        
        await expect(commentCard.getByRole('button', { name: /editar/i })).toBeVisible();
    });

    test('debería poder cancelar la edición de un comentario', async ({ page }) => {
        const commentsSection = page.locator('div.bg-gray-800.rounded-xl').filter({ hasText: 'Comentarios (1)' });
        const commentCard = commentsSection.locator('div.bg-gray-900.rounded-lg').first();
        const commentParagraph = commentCard.locator('p.text-gray-200');
        
        await expect(commentParagraph).toHaveText(testPosts.comment.content);
        
        await commentCard.getByRole('button', { name: /editar/i }).click();
        
        const editTextarea = commentCard.locator('textarea');
        await editTextarea.clear();
        await editTextarea.fill("ESTE CAMBIO NO SE GUARDARÁ");
        
        await commentCard.getByRole('button', { name: /cancelar/i }).click();
        
        await expect(editTextarea).not.toBeVisible();
        
        await expect(commentParagraph).toHaveText(testPosts.comment.content);
        
        await expect(commentCard.getByRole('button', { name: /editar/i })).toBeVisible();
    });

    test('no debería poder editar un comentario si está vacío', async ({ page }) => {
        let dialogAppeared = false;
        page.on('dialog', async dialog => {
            dialogAppeared = true;
            expect(dialog.message()).toContain('vacío');
            await dialog.accept();
        });

        const commentsSection = page.locator('div.bg-gray-800.rounded-xl').filter({ hasText: 'Comentarios (1)' });
        const commentCard = commentsSection.locator('div.bg-gray-900.rounded-lg').first();

        await commentCard.getByRole('button', { name: /editar/i }).click();
        
        const editTextarea = commentCard.locator('textarea');
        await editTextarea.clear();
        
        await commentCard.getByRole('button', { name: /guardar/i }).click();
        
        await page.waitForTimeout(500);
        
        expect(dialogAppeared).toBe(true);
        
        await expect(editTextarea).toBeVisible();
        
        const commentParagraph = commentCard.locator('p.text-gray-200');
        await expect(commentParagraph).not.toBeVisible();
    });
});


test.describe('Delete Comments Flow', () => {

    test.beforeEach(async ({ page }) => {
        await resetDatabase();
        
        const userBody = await createTestUser(testPosts.user.username, testPosts.user.password);
        const gameBody = await createTestGame(testPosts.game.name, testPosts.game.genre, testPosts.game.platform, testPosts.game.description, testPosts.game.image);
        
        const authContext = await createAuthenticatedContext(testPosts.user.username, testPosts.user.password);
        
        const guideBody = await createTestGuide(
            authContext,
            gameBody.id, 
            testPosts.guide.tags, 
            testPosts.guide.title, 
            testPosts.guide.content
        );

        await createTestComment(authContext, guideBody.id);
        
        await authContext.context.dispose();

        await page.goto('/login');
        await loginUser(page, testPosts.user.username, testPosts.user.password);

        await page.getByRole('link', { name: testPosts.game.name }).first().click();
        await page.getByRole('link', { name: testPosts.guide.title }).first().click();
        await expect(page).toHaveURL(/.*guides/);
    });

    test('debería poder eliminar un comentario propio desde la UI', async ({ page }) => {
        await expect(page.getByText(testPosts.comment.content)).toBeVisible();
        await expect(page.getByText("Comentarios (1)")).toBeVisible();
        
        // Hacer clic en el botón "Eliminar" (el primero que aparece)
        await page.getByRole('button', { name: /eliminar/i }).first().click();
        
        // Esperar a que aparezca el mensaje de confirmación
        await expect(page.getByText(/estás seguro/i)).toBeVisible();
        
        // ✅ Hacer clic en el botón "Eliminar" que está DENTRO del overlay
        // Buscamos el overlay y luego el botón dentro de él
        const deleteOverlay = page.locator('div.absolute.inset-0.bg-gray-900');
        await deleteOverlay.getByRole('button', { name: 'Eliminar', exact: true }).click();
        
        await expect(page.getByText(testPosts.comment.content)).not.toBeVisible();
        await expect(page.getByText("Comentarios (1)")).not.toBeVisible();
    });

    test('debería poder cancelar la eliminación de un comentario', async ({ page }) => {
        await expect(page.getByText(testPosts.comment.content)).toBeVisible();
        
        await page.getByRole('button', { name: /eliminar/i }).first().click();
        
        await expect(page.getByText(/estás seguro/i)).toBeVisible();
        
        // ✅ Hacer clic en "Cancelar" que está dentro del overlay
        const deleteOverlay = page.locator('div.absolute.inset-0.bg-gray-900');
        await deleteOverlay.getByRole('button', { name: 'Cancelar' }).click();
        
        await expect(page.getByText(testPosts.comment.content)).toBeVisible();
        await expect(page.getByText("Comentarios (1)")).toBeVisible();
    });
});


test.describe('Comments Authorization - Unauthenticated Users', () => {

    test.beforeEach(async ({ page }) => {
        await resetDatabase();
        
        const userBody = await createTestUser(testPosts.user.username, testPosts.user.password);
        const gameBody = await createTestGame(testPosts.game.name, testPosts.game.genre, testPosts.game.platform, testPosts.game.description, testPosts.game.image);
        
        const authContext = await createAuthenticatedContext(testPosts.user.username, testPosts.user.password);
        
        const guideBody = await createTestGuide(
            authContext,
            gameBody.id, 
            testPosts.guide.tags, 
            testPosts.guide.title, 
            testPosts.guide.content
        );

        await createTestComment(authContext, guideBody.id);
        
        await authContext.context.dispose();

        await page.goto('/');
        
        await page.getByRole('link', { name: testPosts.game.name }).first().click();
        await page.getByRole('link', { name: testPosts.guide.title }).first().click();
        await expect(page).toHaveURL(/.*guides/);
    });

    test('no debería ver el formulario de comentarios sin estar autenticado', async ({ page }) => {
        await expect(page.getByText("Añadir comentario")).toBeVisible();
        await expect(page.getByLabel('Tu comentario *')).not.toBeVisible();
        await expect(page.getByRole('button', { name: 'Publicar Comentario' })).not.toBeVisible();
        
        await expect(page.getByText("Debes iniciar sesión para comentar")).toBeVisible();
        await expect(page.getByRole('button', { name: 'Iniciar sesión' })).toBeVisible();
    });

    test('debería poder ver los comentarios existentes sin estar autenticado', async ({ page }) => {
        await expect(page.getByText(testPosts.comment.content)).toBeVisible();
        await expect(page.getByText("Comentarios (1)")).toBeVisible();
        // ✅ Especificar que queremos el segundo "testuser" (el del comentario, no el de la guía)
        await expect(page.locator('section').getByText(testPosts.user.username).nth(1)).toBeVisible();
    });

    test('no debería ver botones de editar/eliminar sin estar autenticado', async ({ page }) => {
        await expect(page.getByRole('button', { name: /editar/i })).not.toBeVisible();
        await expect(page.getByRole('button', { name: /eliminar/i })).not.toBeVisible();
    });
});