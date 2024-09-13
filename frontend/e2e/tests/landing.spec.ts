import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/landingPage";

test.describe("landing", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto("http://localhost:5173");
  });

  test("landing has a login button", async ({ page }) => {
    const loginButton = page.locator("text=Login");
    await expect(loginButton).toHaveText("Login");
    await expect(loginButton).toBeVisible();
  });

  test("log successfully into Super User Account", async ({ page }) => {
    const loginButton = page.locator("text=Login");
    await loginButton.click();
    await loginPage.login("admin@myrotaryrotaryprojects.com", "WeThr3K1ngsFrom@Far");
    await expect(page).toHaveURL("/admin-portal");
  });
});
