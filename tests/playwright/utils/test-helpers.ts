import { Page, Locator, expect } from '@playwright/test';

/**
 * ヘルパー関数：ページが完全に読み込まれるまで待機
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('load');
  
  await page.waitForLoadState('networkidle');
  
  await page.waitForTimeout(1000);
}

/**
 * ヘルパー関数：取引先フォームに入力
 */
export async function fillPartnerForm(page: Page, partnerData: {
  name: string;
  representativeLastName: string;
  representativeFirstName: string;
  email: string;
  phone: string;
  address: string;
  type: 'supplier' | 'customer';
}): Promise<void> {
  await page.getByTestId('PartnerForm_name').fill(partnerData.name);
  await page.getByTestId('PartnerForm_representativeLastName').fill(partnerData.representativeLastName);
  await page.getByTestId('PartnerForm_representativeFirstName').fill(partnerData.representativeFirstName);
  await page.getByTestId('PartnerForm_email').fill(partnerData.email);
  await page.getByTestId('PartnerForm_phone').fill(partnerData.phone);
  await page.getByTestId('PartnerForm_address').fill(partnerData.address);
  
  const typeRadio = page.getByTestId(`PartnerForm_type_${partnerData.type}`);
  await typeRadio.click();
}

/**
 * ヘルパー関数：注文フォームに入力
 */
export async function fillOrderForm(page: Page, orderData: {
  partnerId: string;
  amount: string;
  orderDate: string;
  deliveryDate: string;
  notes?: string;
}): Promise<void> {
  await page.getByTestId('OrderForm_partnerId').selectOption(orderData.partnerId);
  await page.getByTestId('OrderForm_amount').fill(orderData.amount);
  await page.getByTestId('OrderForm_orderDate').fill(orderData.orderDate);
  await page.getByTestId('OrderForm_deliveryDate').fill(orderData.deliveryDate);
  
  if (orderData.notes) {
    await page.getByTestId('OrderForm_notes').fill(orderData.notes);
  }
}

/**
 * ヘルパー関数：トーストメッセージの表示を確認
 */
export async function expectToastMessage(page: Page, type: 'success' | 'error' | 'info' | 'warning', message?: string): Promise<void> {
  const toast = page.getByTestId(`Toast_${type}`);
  await expect(toast).toBeVisible();
  
  if (message) {
    await expect(toast).toContainText(message);
  }
}

/**
 * ヘルパー関数：ローディングスピナーが表示され、その後非表示になるのを待つ
 */
export async function waitForLoadingSpinner(page: Page): Promise<void> {
  await page.waitForTimeout(500);
  
  const spinner = page.getByTestId('LoadingSpinner');
  
  try {
    await spinner.waitFor({ state: 'visible', timeout: 1000 }).catch(() => {
      console.log('Loading spinner was not visible');
    });
    
    if (await spinner.isVisible()) {
      await spinner.waitFor({ state: 'hidden', timeout: 15000 });
    }
    
    await page.waitForTimeout(500);
  } catch (e) {
    console.log('Error waiting for loading spinner:', e);
  }
}

/**
 * ヘルパー関数：テーブルに特定のテキストを含む行があるか確認
 */
export async function expectTableToContainText(page: Page, tableTestId: string, text: string): Promise<void> {
  const table = page.getByTestId(tableTestId);
  await expect(table).toContainText(text);
}

/**
 * ヘルパー関数：テーブルに特定のテキストを含む行がないか確認
 */
export async function expectTableNotToContainText(page: Page, tableTestId: string, text: string): Promise<void> {
  const table = page.getByTestId(tableTestId);
  await expect(table).not.toContainText(text);
}
