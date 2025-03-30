import { test, expect } from '../setup';
import { 
  waitForPageLoad, 
  expectToastMessage, 
  waitForLoadingSpinner
} from '../utils/test-helpers';

test.describe('設定・プロフィール管理機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    const settingsLink = page.getByTestId('Sidebar_settings');
    await settingsLink.click();
    await waitForPageLoad(page);
  });

  test('正常系: プロフィール情報を更新できる', async ({ page }) => {
    const lastNameInput = page.getByTestId('SettingsPage_lastName');
    await lastNameInput.fill('新しい姓');
    
    const firstNameInput = page.getByTestId('SettingsPage_firstName');
    await firstNameInput.fill('新しい名');
    
    const emailInput = page.getByTestId('SettingsPage_email');
    await emailInput.fill('new.email@example.com');
    
    const updateButton = page.getByTestId('SettingsPage_updateProfileButton');
    await updateButton.click();
    
    await waitForLoadingSpinner(page);
    
    await expectToastMessage(page, 'success', 'プロフィールを更新しました');
    
    await expect(lastNameInput).toHaveValue('新しい姓');
    await expect(firstNameInput).toHaveValue('新しい名');
    await expect(emailInput).toHaveValue('new.email@example.com');
  });

  test('正常系: パスワードを変更できる', async ({ page }) => {
    const showPasswordFormButton = page.getByTestId('SettingsPage_showPasswordFormButton');
    await showPasswordFormButton.click();
    
    const currentPasswordInput = page.getByTestId('SettingsPage_currentPassword');
    await currentPasswordInput.fill('current123');
    
    const newPasswordInput = page.getByTestId('SettingsPage_newPassword');
    await newPasswordInput.fill('new123456');
    
    const confirmPasswordInput = page.getByTestId('SettingsPage_confirmPassword');
    await confirmPasswordInput.fill('new123456');
    
    const updatePasswordButton = page.getByTestId('SettingsPage_updatePasswordButton');
    await updatePasswordButton.click();
    
    await waitForLoadingSpinner(page);
    
    await expectToastMessage(page, 'success', 'パスワードを変更しました');
    
    await expect(currentPasswordInput).not.toBeVisible();
  });

  test('正常系: アバター画像をアップロードできる', async ({ page }) => {
    const fileInput = page.getByTestId('SettingsPage_avatarUpload');
    
    await fileInput.setInputFiles({
      name: 'avatar.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image content')
    });
    
    await waitForLoadingSpinner(page);
    
    await expectToastMessage(page, 'success', 'アバター画像をアップロードしました');
    
    const avatarImage = page.getByTestId('SettingsPage_avatarImage');
    await expect(avatarImage).toBeVisible();
  });

  test('異常系: プロフィール更新時に必須項目が未入力の場合はエラーになる', async ({ page }) => {
    const lastNameInput = page.getByTestId('SettingsPage_lastName');
    await lastNameInput.fill('');
    
    const updateButton = page.getByTestId('SettingsPage_updateProfileButton');
    await updateButton.click();
    
    const lastNameError = page.getByTestId('SettingsPage_lastNameError');
    await expect(lastNameError).toBeVisible();
    await expect(lastNameError).toContainText('姓を入力してください');
    
    await expect(updateButton).toBeVisible();
  });

  test('異常系: パスワード変更時に新しいパスワードと確認用パスワードが一致しない場合はエラーになる', async ({ page }) => {
    const showPasswordFormButton = page.getByTestId('SettingsPage_showPasswordFormButton');
    await showPasswordFormButton.click();
    
    const currentPasswordInput = page.getByTestId('SettingsPage_currentPassword');
    await currentPasswordInput.fill('current123');
    
    const newPasswordInput = page.getByTestId('SettingsPage_newPassword');
    await newPasswordInput.fill('new123456');
    
    const confirmPasswordInput = page.getByTestId('SettingsPage_confirmPassword');
    await confirmPasswordInput.fill('different123456'); // 異なるパスワード
    
    const updatePasswordButton = page.getByTestId('SettingsPage_updatePasswordButton');
    await updatePasswordButton.click();
    
    const confirmPasswordError = page.getByTestId('SettingsPage_confirmPasswordError');
    await expect(confirmPasswordError).toBeVisible();
    await expect(confirmPasswordError).toContainText('パスワードが一致しません');
    
    await expect(updatePasswordButton).toBeVisible();
  });

  test('異常系: パスワード変更時に現在のパスワードが正しくない場合はエラーになる', async ({ page }) => {
    const showPasswordFormButton = page.getByTestId('SettingsPage_showPasswordFormButton');
    await showPasswordFormButton.click();
    
    const currentPasswordInput = page.getByTestId('SettingsPage_currentPassword');
    await currentPasswordInput.fill('wrong123'); // 誤ったパスワード
    
    const newPasswordInput = page.getByTestId('SettingsPage_newPassword');
    await newPasswordInput.fill('new123456');
    
    const confirmPasswordInput = page.getByTestId('SettingsPage_confirmPassword');
    await confirmPasswordInput.fill('new123456');
    
    const updatePasswordButton = page.getByTestId('SettingsPage_updatePasswordButton');
    await updatePasswordButton.click();
    
    await waitForLoadingSpinner(page);
    
    await expectToastMessage(page, 'error', '現在のパスワードが正しくありません');
    
    await expect(updatePasswordButton).toBeVisible();
  });
});
