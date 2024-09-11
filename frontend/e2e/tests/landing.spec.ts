import { test, expect } from "@playwright/test";

test("landing has a login button", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  const loginButton = page.locator("text=Login");
  await expect(loginButton).toHaveText("Login");
  await expect(loginButton).toBeVisible();
});
