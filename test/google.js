const { Builder } = require('selenium-webdriver');

describe("Open Google", function () {
    it("Should open Google homepage", async function () {
        const driver = await new Builder().forBrowser("chrome").build();
        await driver.get("https://www.google.com/");
        // await driver.sleep(1000);
        await driver.quit();
    });
});