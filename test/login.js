const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const chrome = require("selenium-webdriver/chrome");

describe("Automation Belajar Bareng", function () {
    this.timeout(60000);

    let driver;

    before(async function () {
        const options = new chrome.Options();

        options.addArguments("--disable-features=PasswordLeakDetection");

        options.setUserPreferences({
            credentials_enable_service: false,
            "profile.password_manager_enabled": false,
            "profile.password_manager_leak_detection": false
        });

        driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();
    });

    after(async function () {
        await driver.quit();
    });

    // Login Positive
    it("Login berhasil", async function () {
        await driver.get("https://belajar-bareng.onrender.com/");

        await driver.findElement(
            By.css('[data-testid="username-input"]')
        ).sendKeys("admin");

        await driver.findElement(
            By.css('[data-testid="password-input"]')
        ).sendKeys("admin");

        await driver.findElement(
            By.css('[data-testid="login-button"]')
        ).click();

        await driver.wait(
            until.urlContains("/users"),
            10000
        );

        assert.ok(
            (await driver.getCurrentUrl()).includes("/users"),
            "Login gagal"
        );
    });

    // Login Negative
    it("Login dengan password salah", async function () {
        await driver.get("https://belajar-bareng.onrender.com/");

        await driver.findElement(
            By.css('[data-testid="username-input"]')
        ).sendKeys("admin");

        await driver.findElement(
            By.css('[data-testid="password-input"]')
        ).sendKeys("salah123");

        await driver.findElement(
            By.css('[data-testid="login-button"]')
        ).click();

        await driver.sleep(500);

        assert.ok(
            !(await driver.getCurrentUrl()).includes("/users"),
            "Login tetap berhasil"
        );
    });

    // Add User Positive
    it("Add User berhasil", async function () {
        await driver.get("https://belajar-bareng.onrender.com/");

        await driver.findElement(
            By.css('[data-testid="username-input"]')
        ).sendKeys("admin");

        await driver.findElement(
            By.css('[data-testid="password-input"]')
        ).sendKeys("admin");

        await driver.findElement(
            By.css('[data-testid="login-button"]')
        ).click();

        await driver.wait(
            until.urlContains("/users"),
            10000
        );

        await driver.findElement(
            By.xpath("//*[normalize-space()='Add']")
        ).click();

        const username = await driver.findElement(
            By.css('[data-testid="username-input"]')
        );

        const age = await driver.findElement(
            By.css('[data-testid="age-input"]')
        );

        await username.sendKeys(
            "NRTest" + Date.now().toString().slice(-3)
        );

        await age.sendKeys("27");

        assert.ok(
            (await username.getAttribute("value")).length > 0,
            "Username kosong"
        );

        assert.strictEqual(
            await age.getAttribute("value"),
            "27",
            "Age kosong"
        );

        await driver.findElement(
            By.css('[data-testid="submit-button"]')
        ).click();
    });

    // Add User Negative
    it("Add User dengan username kosong", async function () {
        await driver.get("https://belajar-bareng.onrender.com/");

        await driver.findElement(
            By.css('[data-testid="username-input"]')
        ).sendKeys("admin");

        await driver.findElement(
            By.css('[data-testid="password-input"]')
        ).sendKeys("admin");

        await driver.findElement(
            By.css('[data-testid="login-button"]')
        ).click();

        await driver.wait(
            until.urlContains("/users"),
            10000
        );

        await driver.findElement(
            By.xpath("//*[normalize-space()='Add']")
        ).click();

        const username = await driver.findElement(
            By.css('[data-testid="username-input"]')
        );

        const age = await driver.findElement(
            By.css('[data-testid="age-input"]')
        );

        await age.sendKeys("25");

        await driver.findElement(
            By.css('[data-testid="submit-button"]')
        ).click();

        assert.strictEqual(
            await username.getAttribute("validationMessage"),
            "Please fill out this field.",
            "Validasi username tidak muncul"
        );
    });
});