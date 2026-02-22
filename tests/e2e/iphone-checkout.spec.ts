import { test, expect } from '@playwright/test';

const BASE = 'https://rahulshettyacademy.com/loginpagePractise/';

test('add iPhone X to cart and checkout', async ({ page }) => {
  await page.goto(BASE);

  // Fill login fields using stable id selectors
  await page.locator('#username, input[name="username"]').first().fill('rahulshettyacademy');
  await page.locator('#password, input[name="password"]').first().fill('Learning@830$3mK2');

  // Select Admin radio (preferred) or click label if input not present
  const adminInput = page.locator('input[value="admin"]');
  if (await adminInput.count()) {
    await adminInput.check().catch(() => {});
  } else {
    const adminLabel = page.locator('label:has-text("Admin")');
    if (await adminLabel.count()) await adminLabel.first().click().catch(() => {});
  }

  // Check agreement if present
  const checkbox = page.locator('input[type="checkbox"]');
  if (await checkbox.count()) await checkbox.check().catch(() => {});

  // Sign in using stable id when available
  const signIn = page.locator('#signInBtn');
  if (await signIn.count()) {
    await signIn.first().waitFor({ state: 'visible', timeout: 10000 });
    await signIn.first().click();
  } else {
    await page.locator('button:has-text("Sign In")').first().click();
  }

  const shopLink = page.locator('a:has-text("Shop")');
  try {
    await shopLink.first().waitFor({ state: 'visible', timeout: 5000 });
    await shopLink.first().click();
  } catch {
    await page.goto('https://rahulshettyacademy.com/angularpractice/shop');
  }

  // Wait for product cards to appear
  const products = page.locator('.card');
  await products.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

  // Take screenshot to see the products page
  await page.screenshot({ path: 'products-page.png' });

  // Log all product text to find the exact name
  const allProductText = await page.locator('.card').allInnerTexts();
  console.log('All products:', allProductText);

  // Find iPhone X using different approach
  let productAdded = false;
  
  // Try to find by text content
  const iphoneCards = page.locator('.card:has-text("iphone")').or(page.locator('.card:has-text("iPhone")'));
  const iphoneCount = await iphoneCards.count();
  console.log(`Cards with iPhone text: ${iphoneCount}`);
  
  for (let i = 0; i < iphoneCount; i++) {
    const card = iphoneCards.nth(i);
    const cardText = await card.innerText().catch(() => '');
    console.log(`iPhone Card ${i}:`, cardText);
    
    if (cardText.includes('X')) {
      console.log('Found iPhone X card!');
      
      // Try clicking with different methods
      try {
        // Method 1: Find button by text
        const addBtn = card.locator('button:has-text("Add")');
        const btnCount = await addBtn.count();
        console.log(`Found ${btnCount} "Add" buttons`);
        
        if (btnCount > 0) {
          await addBtn.first().click();
          console.log('Successfully clicked Add button (method 1)');
          productAdded = true;
          break;
        }
      } catch (e) {
        console.log('Method 1 failed:', e);
      }
      
      try {
        // Method 2: Click all buttons and check for Add action
        const allBtns = card.locator('button');
        const btnCount = await allBtns.count();
        console.log(`Total buttons in card: ${btnCount}`);
        
        for (let j = 0; j < btnCount; j++) {
          const btn = allBtns.nth(j);
          const btnText = await btn.innerText().catch(() => '');
          const btnClass = await btn.getAttribute('class').catch(() => '');
          console.log(`Button ${j}: text="${btnText}", class="${btnClass}"`);
          
          if (btnText.toUpperCase().includes('ADD') || btnText.includes('Cart')) {
            await btn.click();
            console.log(`Clicked button ${j}`);
            productAdded = true;
            break;
          }
        }
        
        if (productAdded) break;
      } catch (e) {
        console.log('Method 2 failed:', e);
      }
    }
  }
  
  if (!productAdded) {
    console.log('Product not added - could not find iPhone X');
    // Take another screenshot to see state
    await page.screenshot({ path: 'not-added.png' });
  } else {
    console.log('Product successfully added!');
  }

  // Take screenshot after attempting to add
  await page.screenshot({ path: 'after-add.png' });

  // Wait 3 seconds after adding product
  await page.waitForTimeout(3000);

  // Click Checkout / Cart
  await page.locator('a:has-text("Checkout"), button:has-text("Checkout"), a:has-text("Cart")').first().click();

  // Verify product present in cart/checkout page (5 second timeout)
  await expect(page.getByText(/iphone\s*x/i)).toBeVisible({ timeout: 5000 });

  // Wait 10 seconds before closing
  await page.waitForTimeout(10000);
});
