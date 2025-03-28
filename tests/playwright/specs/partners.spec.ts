import { test, expect } from '../setup';
import { 
  waitForPageLoad, 
  fillPartnerForm, 
  expectToastMessage, 
  waitForLoadingSpinner,
  expectTableToContainText,
  expectTableNotToContainText
} from '../utils/test-helpers';

test.describe('取引先管理機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    await page.getByTestId('Sidebar_partners').click();
    await waitForPageLoad(page);
  });

  test('正常系: 新規取引先を登録できる', async ({ page }) => {
    await page.getByTestId('PartnerList_addButton').click();
    
    const newPartner = {
      name: 'テスト株式会社',
      representativeLastName: '山田',
      representativeFirstName: '太郎',
      email: 'test@example.com',
      phone: '03-1234-5678',
      address: '東京都渋谷区テスト町1-2-3',
      type: 'supplier' as const
    };
    
    await fillPartnerForm(page, newPartner);
    
    await page.getByTestId('PartnerForm_submitButton').click();
    
    await waitForLoadingSpinner(page);
    
    await expectToastMessage(page, 'success', '新規取引先を登録しました');
    
    await expectTableToContainText(page, 'PartnerList_table', newPartner.name);
    await expectTableToContainText(page, 'PartnerList_table', newPartner.representativeLastName);
  });

  test('正常系: 取引先情報を編集できる', async ({ page }) => {
    await page.getByTestId('PartnerList_editButton').first().click();
    
    const updatedName = 'アップデート株式会社';
    await page.getByTestId('PartnerForm_name').fill(updatedName);
    
    await page.getByTestId('PartnerForm_submitButton').click();
    
    await waitForLoadingSpinner(page);
    
    await expectToastMessage(page, 'success', '取引先情報を更新しました');
    
    await expectTableToContainText(page, 'PartnerList_table', updatedName);
  });

  test('正常系: 取引先を削除できる', async ({ page }) => {
    const partnerName = await page.getByTestId('PartnerList_name').first().textContent();
    
    await page.getByTestId('PartnerList_deleteButton').first().click();
    
    page.on('dialog', dialog => dialog.accept());
    
    await waitForLoadingSpinner(page);
    
    await expectToastMessage(page, 'success', '取引先を削除しました');
    
    if (partnerName) {
      await expectTableNotToContainText(page, 'PartnerList_table', partnerName);
    }
  });

  test('異常系: 必須項目が未入力の場合はエラーになる', async ({ page }) => {
    await page.getByTestId('PartnerList_addButton').click();
    
    const incompletePartner = {
      name: '', // 空にする
      representativeLastName: '山田',
      representativeFirstName: '太郎',
      email: 'test@example.com',
      phone: '03-1234-5678',
      address: '東京都渋谷区テスト町1-2-3',
      type: 'supplier' as const
    };
    
    await fillPartnerForm(page, incompletePartner);
    
    await page.getByTestId('PartnerForm_submitButton').click();
    
    const errorMessage = page.getByTestId('PartnerForm_nameError');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('会社名は必須です');
    
    await expect(page.getByTestId('PartnerForm_submitButton')).toBeVisible();
  });

  test('異常系: メールアドレスの形式が不正な場合はエラーになる', async ({ page }) => {
    await page.getByTestId('PartnerList_addButton').click();
    
    const partnerWithInvalidEmail = {
      name: 'テスト株式会社',
      representativeLastName: '山田',
      representativeFirstName: '太郎',
      email: 'invalid-email', // 不正な形式
      phone: '03-1234-5678',
      address: '東京都渋谷区テスト町1-2-3',
      type: 'supplier' as const
    };
    
    await fillPartnerForm(page, partnerWithInvalidEmail);
    
    await page.getByTestId('PartnerForm_submitButton').click();
    
    const errorMessage = page.getByTestId('PartnerForm_emailError');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('有効なメールアドレスを入力してください');
    
    await expect(page.getByTestId('PartnerForm_submitButton')).toBeVisible();
  });
});
