import { expect, test } from '@playwright/test';

async function signInAsDemo(page, displayName) {
  await page.goto('/login');
  await page.getByRole('button', { name: new RegExp(displayName, 'i') }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('button', { name: 'Open profile menu' })).toBeVisible();
}

test('Journey 1 — hybrid auth and one-click role switching', async ({ page }) => {
  await signInAsDemo(page, 'Sarah Smith');

  const sidebarProfile = page.getByRole('group', { name: 'Sidebar signed-in user' });
  await expect(sidebarProfile).toBeVisible();
  await expect(sidebarProfile.getByText('Sarah Smith')).toBeVisible();
  await page.getByRole('button', { name: 'Open profile menu' }).click();
  await expect(page.getByRole('banner').getByText('manager@example.com')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open profile menu' })).toContainText('SS');
});

test('Journey 2 — live RBAC guards switch from User to Admin', async ({ page }) => {
  await signInAsDemo(page, 'Mohd Sadaf');
  await page.goto('/users/all/list');

  await expect(page.getByText(/Viewing as USER \(Read-Only Mode\)/)).toBeVisible();
  const deleteButton = page.getByRole('button', { name: 'Delete' }).first();
  await expect(deleteButton).toBeDisabled();
  const addUserButton = page.locator('main').getByRole('button', { name: 'Add User' });
  await expect(addUserButton).toBeDisabled();

  await page.getByRole('button', { name: 'Switch to Admin' }).click();
  await expect(addUserButton).toBeEnabled();
  await expect(deleteButton).toBeEnabled();
  await expect(page.getByText(/Viewing as USER/)).toHaveCount(0);
});

test('Journey 3 — Ctrl+K Spotlight finds the Kanban action', async ({ page }) => {
  await signInAsDemo(page, 'John Doe');
  await page.keyboard.press('Control+k');

  const spotlight = page.getByRole('dialog', { name: 'Live Workspace Spotlight' });
  await expect(spotlight).toBeVisible();
  for (const tab of ['All', 'Actions', 'Users', 'Products', 'Orders', 'Pages']) {
    await expect(spotlight.getByRole('tab', { name: tab })).toBeVisible();
  }
  await spotlight.getByPlaceholder('Search workspace, records, and actions...').fill('Kanban');
  await expect(spotlight.getByRole('option', { name: /Orders: Open Kanban Pipeline Board/ })).toBeVisible();
});

test('Journey 4 — Orders ledger, Kanban stages, and invoice preview', async ({ page }) => {
  await signInAsDemo(page, 'Sarah Smith');
  await page.goto('/reports/sales/daily');

  const viewSwitcher = page.getByRole('group', { name: 'Orders view' });
  await expect(viewSwitcher).toBeVisible();
  await viewSwitcher.getByRole('button', { name: 'Ledger Table' }).click();
  await viewSwitcher.getByRole('button', { name: 'Kanban Pipeline' }).click();
  for (const stage of ['Pending', 'Processing', 'Shipped', 'Completed']) {
    await expect(page.getByRole('heading', { name: new RegExp(`^${stage}$`, 'i') })).toBeVisible();
  }

  const invoiceButtons = page.getByRole('button', { name: 'Invoice' });
  if (await invoiceButtons.count()) {
    await expect(invoiceButtons.first()).toBeVisible();
    await invoiceButtons.first().click();
    const invoiceDialog = page.getByRole('dialog');
    await expect(invoiceDialog).toContainText('Tax Invoice');
    await invoiceDialog.getByRole('button', { name: 'Close' }).click();
  }
});

test('Journey 5 — Bulk Import sample rows pass pre-import validation', async ({ page }) => {
  await signInAsDemo(page, 'John Doe');
  await page.goto('/reports/import/data');
  await page.getByRole('button', { name: 'Load Instant Sample Batch (Demo)' }).click();

  await expect(page.getByRole('heading', { name: 'Pre-Import Validation' })).toBeVisible();
  await expect(page.getByText(/5 parsed rows/)).toBeVisible();
  await expect(page.getByText('READY').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Import 5 Valid Rows to Supabase' })).toBeEnabled();
});
