# Playwright JavaScript CF Solver

This repository contains a JavaScript script that sends a POST request to an API, extracts the cookie and user agent, and uses Playwright to set these cookies and user agent in a browser session while navigating to a specified URL through a proxy.

## Prerequisites

- Node.js 12+
- [Playwright](https://playwright.dev/docs/intro) for JavaScript
- Required Node.js packages (listed in `package.json`)

## Code example

```javascript
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
```

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/pim97/undetected-playwright-javascript-bypass-cloudflare.git
    cd repo-name
    ```

2. **Install the required packages:**

    ```bash
    npm install
    ```

3. **Install Playwright browsers:**

    ```bash
    npx playwright install
    ```

## Usage

1. **Set your API key and proxy URL:**

    Create a `.env` file in the root of your project and add your API key, target URL, and proxy details:

    ```env
    API_KEY=YOUR_API_KEY_HERE
    TARGET_URL=https://example.com
    PROXY_URL=http://user:pass@host:port
    ```

2. **Run the script:**

    ```bash
    node script.js
    ```

    This will execute the script, sending a POST request to the API, extracting the cookie and user agent, and using Playwright to set these cookies and user agent in a browser session while navigating to the specified URL.

## Script Breakdown

- **Step 1:** Send a POST request to the API and extract the cookie and user agent from the response.
- **Step 2:** Parse the target URL to extract the domain.
- **Step 3:** Use Playwright to launch a browser, set the extracted cookie and user agent, and navigate to the specified URL through the provided proxy.

### Functions

- **`parseCookieString(cookieString)`**: Parses the cookie string into a list of cookie objects.
- **`getCookiesAndUserAgent(apiKey, targetUrl, proxyUrl, version, browserName)`**: The main asynchronous function that sends a request to the API, retrieves cookies and user agent, and returns them along with proxy settings.

## Legal and Ethical Considerations

It's crucial to adhere to legal and ethical guidelines when conducting web scraping. Respect the website's terms of service and scraping policies. Ensure that the use of the extracted data complies with all relevant laws and regulations, especially concerning data privacy and intellectual property rights. 🚫⚖️

*Disclaimer: This guide on web scraping is intended for educational and informational purposes only. Engage in responsible web scraping practices and adhere to the terms and conditions of the targeted website.* 📚🔍
