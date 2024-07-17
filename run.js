const { chromium } = require('playwright');
const { getCookiesAndUserAgent } = require('./lib/scrappey.js');
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const PROXY_URL = process.env.PROXY_URL;
const TARGET_URL = process.env.TARGET_URL;

(async () => {
  const { cookieObject, userAgent, proxyObject } = await getCookiesAndUserAgent(API_KEY, TARGET_URL, PROXY_URL, 126, 'chrome');

  const browser = await chromium.launch({ proxy: proxyObject, headless: false });
  const context = await browser.newContext({
    userAgent: userAgent
  });
  await context.addCookies(cookieObject);

  try {

    const page = await context.newPage();
    await page.goto(TARGET_URL);
    
    await page.waitForSelector('body');

    await page.screenshot({ path: 'screenshot_chrome.png' });

  } catch (e) {
    console.error(`Exception occurred: ${e}`);
  } finally {
    await browser.close();
  }
})();
