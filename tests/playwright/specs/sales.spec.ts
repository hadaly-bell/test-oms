import { test, expect } from '../setup';
import { 
  waitForPageLoad, 
  fillOrderForm, 
  expectToastMessage, 
  waitForLoadingSpinner,
  expectTableToContainText,
  expectTableNotToContainText
} from '../utils/test-helpers';

test.describe('販売管理機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    const salesLink = page.getByTestId('Sidebar_sales');
    await salesLink.click();
    await waitForPageLoad(page);
  });

  test('正常系: 新規販売注文を登録できる', async ({ page }) => {
    const addButton = page.getByTestId('OrderList_addButton');
    await addButton.click();
    
    const newOrder = {
      partnerId: '2', // 販売先ID (customer)
      amount: '50000',
      orderDate: new Date().toISOString().split('T')[0], // 今日の日付
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1週間後
      notes: 'テスト販売注文です'
    };
    
    await fillOrderForm(page, newOrder);
    
    const submitButton = page.getByTestId('OrderForm_submitButton');
    await submitButton.click();
    
    await waitForLoadingSpinner(page);
    
    await expectToastMessage(page, 'success', '販売注文を登録しました');
    
    await expectTableToContainText(page, 'OrderTable_table', newOrder.amount);
  });

  test('正常系: 販売注文を編集できる', async ({ page }) => {
    const firstOrderRow = page.getByTestId('OrderTable_row').first();
    await firstOrderRow.click();
    
    const amountInput = page.getByTestId('OrderForm_amount');
    await amountInput.fill('55000');
    
    const notesInput = page.getByTestId('OrderForm_notes');
    await notesInput.fill('金額を更新しました');
    
    const submitButton = page.getByTestId('OrderForm_submitButton');
    await submitButton.click();
    
    await waitForLoadingSpinner(page);
    
    await expectToastMessage(page, 'success', '注文を更新しました');
    
    await expectTableToContainText(page, 'OrderTable_table', '55,000');
  });

  test('正常系: 販売注文のステータスを変更できる', async ({ page }) => {
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

  test('正常系: 販売注文の詳細を表示できる', async ({ page }) => {
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

  test('正常系: 販売注文を削除できる', async ({ page }) => {
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
    await partnerSelect.selectOption('2');
    
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
      partnerId: '2',
      amount: '-1000', // 負の値
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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

  test('異常系: 納期が注文日より前の場合はエラーになる', async ({ page }) => {
    const addButton = page.getByTestId('OrderList_addButton');
    await addButton.click();
    
    const today = new Date().toISOString().split('T')[0];
    const pastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const invalidOrder = {
      partnerId: '2',
      amount: '50000',
      orderDate: today,
      deliveryDate: pastDate, // 過去の日付
      notes: 'テスト'
    };
    
    await fillOrderForm(page, invalidOrder);
    
    const submitButton = page.getByTestId('OrderForm_submitButton');
    await submitButton.click();
    
    const dateError = page.getByTestId('OrderForm_deliveryDateError');
    await expect(dateError).toBeVisible();
    await expect(dateError).toContainText('納期は注文日以降の日付を指定してください');
    
    await expect(submitButton).toBeVisible();
  });
});
