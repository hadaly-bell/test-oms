import { test, expect } from '../setup';
import { 
  waitForPageLoad, 
  fillOrderForm, 
  expectToastMessage, 
  waitForLoadingSpinner,
  expectTableToContainText,
  expectTableNotToContainText
} from '../utils/test-helpers';

test.describe('仕入管理機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    const purchasesLink = page.getByTestId('Sidebar_purchases');
    await purchasesLink.click();
    await waitForPageLoad(page);
  });

  test('正常系: 新規仕入注文を登録できる', async ({ page }) => {
    const addButton = page.getByTestId('OrderList_addButton');
    await addButton.click();
    
    const newOrder = {
      partnerId: '1', // 仕入先ID (supplier)
      amount: '30000',
      orderDate: new Date().toISOString().split('T')[0], // 今日の日付
      deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10日後
      notes: 'テスト仕入注文です'
    };
    
    await fillOrderForm(page, newOrder);
    
    const submitButton = page.getByTestId('OrderForm_submitButton');
    await submitButton.click();
    
    await waitForLoadingSpinner(page);
    
    await expectToastMessage(page, 'success', '仕入注文を登録しました');
    
    await expectTableToContainText(page, 'OrderTable_table', newOrder.amount);
  });

  test('正常系: 仕入注文を編集できる', async ({ page }) => {
    const firstOrderRow = page.getByTestId('OrderTable_row').first();
    await firstOrderRow.click();
    
    const amountInput = page.getByTestId('OrderForm_amount');
    await amountInput.fill('45000');
    
    const notesInput = page.getByTestId('OrderForm_notes');
    await notesInput.fill('金額を更新しました');
    
    const submitButton = page.getByTestId('OrderForm_submitButton');
    await submitButton.click();
    
    await waitForLoadingSpinner(page);
    
    await expectToastMessage(page, 'success', '注文を更新しました');
    
    await expectTableToContainText(page, 'OrderTable_table', '45,000');
  });

  test('正常系: 仕入注文のステータスを変更できる', async ({ page }) => {
    const statusButton = page.getByTestId('OrderTable_statusButton').first();
    await statusButton.click();
    
    const statusSelect = page.getByTestId('StatusChangeDialog_statusSelect');
    await statusSelect.selectOption('approved');
    
    const commentInput = page.getByTestId('StatusChangeDialog_comment');
    await commentInput.fill('承認します');
    
    const submitButton = page.getByTestId('StatusChangeDialog_submitButton');
    await submitButton.click();
    
    await waitForLoadingSpinner(page);
    
    await expectToastMessage(page, 'success', 'ステータスを更新しました');
    
    await expectTableToContainText(page, 'OrderTable_table', '承認済');
  });

  test('正常系: 仕入注文の詳細を表示できる', async ({ page }) => {
    const viewButton = page.getByTestId('OrderTable_viewButton').first();
    await viewButton.click();
    
    const orderDetail = page.getByTestId('OrderDetail_title');
    await expect(orderDetail).toBeVisible();
    
    const statusHistory = page.getByTestId('StatusHistory_title');
    await expect(statusHistory).toBeVisible();
    
    const closeButton = page.getByTestId('OrderDetail_closeButton');
    await closeButton.click();
    
    await expect(orderDetail).not.toBeVisible();
  });

  test('正常系: 仕入注文を削除できる', async ({ page }) => {
    const beforeCount = await page.getByTestId('OrderTable_row').count();
    
    const deleteButton = page.getByTestId('OrderTable_deleteButton').first();
    await deleteButton.click();
    
    page.on('dialog', dialog => dialog.accept());
    
    await waitForLoadingSpinner(page);
    
    await expectToastMessage(page, 'success', '注文を削除しました');
    
    const afterCount = await page.getByTestId('OrderTable_row').count();
    expect(afterCount).toBeLessThan(beforeCount);
  });

  test('異常系: 必須項目が未入力の場合はエラーになる', async ({ page }) => {
    const addButton = page.getByTestId('OrderList_addButton');
    await addButton.click();
    
    const partnerSelect = page.getByTestId('OrderForm_partnerId');
    await partnerSelect.selectOption('1');
    
    const submitButton = page.getByTestId('OrderForm_submitButton');
    await submitButton.click();
    
    const amountError = page.getByTestId('OrderForm_amountError');
    await expect(amountError).toBeVisible();
    await expect(amountError).toContainText('金額は必須です');
    
    await expect(submitButton).toBeVisible();
  });

  test('異常系: 金額が不正な値の場合はエラーになる', async ({ page }) => {
    const addButton = page.getByTestId('OrderList_addButton');
    await addButton.click();
    
    const invalidOrder = {
      partnerId: '1',
      amount: '-1000', // 負の値
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'テスト'
    };
    
    await fillOrderForm(page, invalidOrder);
    
    const submitButton = page.getByTestId('OrderForm_submitButton');
    await submitButton.click();
    
    const amountError = page.getByTestId('OrderForm_amountError');
    await expect(amountError).toBeVisible();
    await expect(amountError).toContainText('金額は0以上の値を入力してください');
    
    await expect(submitButton).toBeVisible();
  });

  test.skip('異常系: 仕入先以外の取引先を選択した場合はエラーになる', async ({ page }) => {
    const addButton = page.getByTestId('OrderList_addButton');
    await addButton.click();
    
    const invalidOrder = {
      partnerId: '2', // 顧客ID (customer) - 本来選択できないはず
      amount: '30000',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'テスト'
    };
    
    await fillOrderForm(page, invalidOrder);
    
    const submitButton = page.getByTestId('OrderForm_submitButton');
    await submitButton.click();
    
    const partnerError = page.getByTestId('OrderForm_partnerIdError');
    await expect(partnerError).toBeVisible();
    await expect(partnerError).toContainText('仕入先を選択してください');
    
    await expect(submitButton).toBeVisible();
  });
});
