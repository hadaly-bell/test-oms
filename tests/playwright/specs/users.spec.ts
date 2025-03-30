import { test, expect } from '../setup';
import { 
  waitForPageLoad, 
  expectToastMessage, 
  waitForLoadingSpinner
} from '../utils/test-helpers';

test.describe('ユーザー管理機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    const accountLink = page.getByTestId('Sidebar_account');
    await accountLink.click();
    await waitForPageLoad(page);
  });

  test('正常系: 新規ユーザーを登録できる', async ({ page }) => {
    const addButton = page.getByTestId('AccountPage_addButton');
    await addButton.click();
    
    await page.getByTestId('UserForm_lastName').fill('テスト');
    await page.getByTestId('UserForm_firstName').fill('ユーザー');
    await page.getByTestId('UserForm_email').fill('test.user@example.com');
    await page.getByTestId('UserForm_password').fill('password123');
    await page.getByTestId('UserForm_roleUser').check();
    
    const submitButton = page.getByTestId('UserForm_submitButton');
    await submitButton.click();
    
    await waitForLoadingSpinner(page);
    
    await expectToastMessage(page, 'success', 'ユーザーを登録しました');
    
    const userRow = page.getByText('テスト ユーザー');
    await expect(userRow).toBeVisible();
  });

  test('正常系: ユーザー権限を変更できる', async ({ page }) => {
    const roleSelect = page.getByTestId('AccountPage_roleSelect').first();
    
    const currentRole = await roleSelect.inputValue();
    
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    await roleSelect.selectOption(newRole);
    
    await waitForLoadingSpinner(page);
    
    await expectToastMessage(page, 'success', '権限を更新しました');
    
    await expect(roleSelect).toHaveValue(newRole);
  });

  test('正常系: ユーザー詳細を表示できる', async ({ page }) => {
    const viewButton = page.getByTestId('AccountPage_viewButton').first();
    await viewButton.click();
    
    const userDetail = page.getByTestId('UserDetail_title');
    await expect(userDetail).toBeVisible();
    
    const resetButton = page.getByTestId('UserDetail_resetPasswordButton');
    await expect(resetButton).toBeVisible();
    
    const closeButton = page.getByTestId('UserDetail_closeButton');
    await closeButton.click();
    
    await expect(userDetail).not.toBeVisible();
  });

  test('正常系: ユーザーを削除できる', async ({ page }) => {
    const beforeCount = await page.getByTestId('AccountPage_userRow').count();
    
    const deleteButton = page.getByTestId('AccountPage_deleteButton').first();
    await deleteButton.click();
    
    page.on('dialog', dialog => dialog.accept());
    
    await waitForLoadingSpinner(page);
    
    await expectToastMessage(page, 'success', 'ユーザーを削除しました');
    
    const afterCount = await page.getByTestId('AccountPage_userRow').count();
    expect(afterCount).toBeLessThan(beforeCount);
  });

  test('正常系: ユーザー検索ができる', async ({ page }) => {
    const searchInput = page.getByTestId('AccountPage_searchInput');
    await searchInput.fill('山田');
    
    const userRows = page.getByTestId('AccountPage_userRow');
    await expect(userRows).toHaveCount(1);
    
    const userName = page.getByText('山田');
    await expect(userName).toBeVisible();
  });

  test('正常系: フィルターを適用できる', async ({ page }) => {
    const filterButton = page.getByTestId('AccountPage_filterButton');
    await filterButton.click();
    
    const roleSelect = page.getByTestId('AccountPage_filterRoleSelect');
    await roleSelect.selectOption('admin');
    
    const adminBadges = page.getByText('管理者');
    const userRows = page.getByTestId('AccountPage_userRow');
    
    expect(await adminBadges.count()).toBe(await userRows.count());
  });

  test('異常系: 必須項目が未入力の場合はエラーになる', async ({ page }) => {
    const addButton = page.getByTestId('AccountPage_addButton');
    await addButton.click();
    
    await page.getByTestId('UserForm_email').fill('test@example.com');
    
    const submitButton = page.getByTestId('UserForm_submitButton');
    await submitButton.click();
    
    const lastNameError = page.getByTestId('UserForm_lastNameError');
    await expect(lastNameError).toBeVisible();
    await expect(lastNameError).toContainText('姓は必須です');
    
    const firstNameError = page.getByTestId('UserForm_firstNameError');
    await expect(firstNameError).toBeVisible();
    await expect(firstNameError).toContainText('名は必須です');
    
    const passwordError = page.getByTestId('UserForm_passwordError');
    await expect(passwordError).toBeVisible();
    await expect(passwordError).toContainText('パスワードは必須です');
  });

  test('異常系: メールアドレスの形式が不正な場合はエラーになる', async ({ page }) => {
    const addButton = page.getByTestId('AccountPage_addButton');
    await addButton.click();
    
    await page.getByTestId('UserForm_lastName').fill('テスト');
    await page.getByTestId('UserForm_firstName').fill('ユーザー');
    await page.getByTestId('UserForm_email').fill('invalid-email');
    await page.getByTestId('UserForm_password').fill('password123');
    
    const submitButton = page.getByTestId('UserForm_submitButton');
    await submitButton.click();
    
    const emailError = page.getByTestId('UserForm_emailError');
    await expect(emailError).toBeVisible();
    await expect(emailError).toContainText('有効なメールアドレスを入力してください');
  });
});
