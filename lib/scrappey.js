const axios = require('axios');
const url = require('url');

function getProxyObject(proxyUrl) {
    const parsedUrl = url.parse(proxyUrl);
    const username = parsedUrl.auth.split(':')[0];
    const password = parsedUrl.auth.split(':')[1];
    const server = `${parsedUrl.protocol}//${parsedUrl.hostname}:${parsedUrl.port}`;

    const proxyObj = {
        server: server,
        username: username,
        password: password
    };
    return proxyObj;
}

function parseCookieString(cookieString, targetUrl) {
    const parsedUrl = url.parse(targetUrl);
    const domain = parsedUrl.hostname;

    const cookies = cookieString.split('; ').map(cookie => {
        const [name, value] = cookie.split('=');
        return {
            name: name,
            value: value,
            domain: domain,
            path: '/'
        };
    });
    return cookies;
}

async function getCookiesAndUserAgent(apiKey, targetUrl, proxyUrl, version = 126, browserName = 'chrome') {
    const requestUrl = `https://publisher.scrappey.com/api/v1?key=${apiKey}`;
    const headers = {
        'Content-Type': 'application/json'
    };
    const body = {
        cmd: 'request.get',
        url: targetUrl,
        proxy: proxyUrl,
        filter: ['cookieString', 'userAgent'],
        noDriver: browserName !== 'firefox',
        browser: [
            {
                name: browserName,
                minVersion: version,
                maxVersion: version
            }
        ]
    };

    console.log('----- Requesting cookies and user agent from Scrappey, may take 30 seconds -----');

    try {
        const response = await axios.post(requestUrl, body, { headers });
        const responseData = response.data;

        const cookieString = responseData.solution.cookieString; // Adjust this according to the actual response structure
        const userAgent = responseData.solution.userAgent; // Adjust this according to the actual response structure
        const cookieObject = parseCookieString(cookieString, targetUrl);
        const proxyObject = getProxyObject(proxyUrl);

        console.log('----- Cookies and user agent received from Scrappey -----');
        return { cookieObject, userAgent, proxyObject };
    } catch (error) {
        throw new Error(`Error parsing response from Scrappey ${error.response ? error.response.data : error.message}`);
    }
}

module.exports = {
    getCookiesAndUserAgent
}