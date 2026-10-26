const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const assert = require("assert");

describe("Automation Testing Web Belajar Bareng - Login dan Add User", function () {
  this.timeout(60000);

  let driver;

  beforeEach(async function () {
    const options = new chrome.Options();
    options.addArguments("--disable-notifications");
    options.addArguments("--disable-save-password-bubble");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
      driver = null;
    }
  });

  async function loginAdmin() {
    await driver.get("https://belajar-bareng.onrender.com/");

    await driver
      .findElement(By.css('[data-testid="username-input"]'))
      .sendKeys("admin");

    await driver
      .findElement(By.css('[data-testid="password-input"]'))
      .sendKeys("admin");

    await driver
      .findElement(By.css('[data-testid="login-button"]'))
      .click();

    await driver.wait(until.urlContains("/users"), 10000);
  }

  // Membuat username unik (maksimal 10 karakter)
  function createUniqueUsername() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let number = Date.now();
    let suffix = "";

    while (number > 0) {
      suffix = letters[number % 26] + suffix;
      number = Math.floor(number / 26);
    }

    return ("Q" + suffix).slice(0, 10);
  }

  // Login berhasil
  it("Login berhasil", async function () {
    await loginAdmin();

    const currentUrl = await driver.getCurrentUrl();

    assert.ok(
      currentUrl.includes("/users"),
      "Login gagal, halaman Users tidak terbuka"
    );
  });

  // Login dengan password salah
  it("Login dengan password salah", async function () {
    await driver.get("https://belajar-bareng.onrender.com/");

    await driver
      .findElement(By.css('[data-testid="username-input"]'))
      .sendKeys("admin");

    await driver
      .findElement(By.css('[data-testid="password-input"]'))
      .sendKeys("salah123");

    await driver
      .findElement(By.css('[data-testid="login-button"]'))
      .click();

    await driver.sleep(1500);

    const currentUrl = await driver.getCurrentUrl();

    assert.ok(
      !currentUrl.includes("/users"),
      "Login seharusnya gagal menggunakan password yang salah"
    );
  });

  // Add User berhasil
  it("Add User berhasil", async function () {
    await loginAdmin();

    await driver
      .findElement(By.xpath("//*[normalize-space()='Add']"))
      .click();

    const newUsername = createUniqueUsername();

    const usernameInput = await driver.findElement(
      By.css('[data-testid="username-input"]')
    );

    await usernameInput.clear();
    await usernameInput.sendKeys(newUsername);

    const actualUsername = await usernameInput.getAttribute("value");

    assert.strictEqual(
      actualUsername,
      newUsername,
      `Username berubah. Diharapkan "${newUsername}", tetapi kolom berisi "${actualUsername}"`
    );

    await driver
      .findElement(By.css('[data-testid="age-input"]'))
      .sendKeys("27");

    await driver
      .findElement(By.css('[data-testid="submit-button"]'))
      .click();

    await driver.wait(async function () {
      const bodyText = await driver
        .findElement(By.css("body"))
        .getText();

      return (
        bodyText.includes("User successfully added") ||
        bodyText.includes("already exists") ||
        bodyText.includes("Missing username") ||
        bodyText.toLowerCase().includes("error")
      );
    }, 10000);

    const bodyText = await driver
      .findElement(By.css("body"))
      .getText();

    assert.ok(
      bodyText.includes("User successfully added"),
      `Add User gagal untuk username "${newUsername}". Pesan website: ${bodyText}`
    );
  });

  // Add User dengan Age kosong
  it("Add User dengan Age kosong", async function () {
    await loginAdmin();

    await driver
      .findElement(By.xpath("//*[normalize-space()='Add']"))
      .click();

    const usernameInput = await driver.findElement(
      By.css('[data-testid="username-input"]')
    );

    const ageInput = await driver.findElement(
      By.css('[data-testid="age-input"]')
    );

    await usernameInput.sendKeys("Umira");

    await driver
      .findElement(By.css('[data-testid="submit-button"]'))
      .click();

    const validationMessage = await ageInput.getAttribute(
      "validationMessage"
    );

    assert.strictEqual(
      validationMessage,
      "Please fill out this field.",
      "Validasi Age kosong tidak sesuai"
    );
  });
});
