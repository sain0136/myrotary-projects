import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/landingPage";

test.describe("landing", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto("/");
  });

  test("landing has a login button", async ({ page }) => {
    const loginButton = page.locator("text=Login");
    await expect(loginButton).toHaveText("Login");
    await expect(loginButton).toBeVisible();
  });

  test("log successfully into Super User Account", async ({ page }) => {
    const loginButton = page.locator("text=Login");
    await loginButton.click();
    const username = process.env.PLAYWRIGHT_USERNAME;
    const password = process.env.PLAYWRIGHT_PASSWORD;
    await loginPage.login(username as string, password as string);
    await expect(page).toHaveURL("/admin-portal");
  });
});
