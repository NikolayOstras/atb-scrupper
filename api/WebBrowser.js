import chromium from 'chrome-aws-lambda'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())

const LOCAL_CHROME_EXECUTABLE =
	'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

class WebBrowser {
	constructor() {
		this.browser = null
		this.page = null
	}

	async launch() {
		this.browser = await puppeteer.launch({
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			executablePath:
				(await chromium.executablePath) || LOCAL_CHROME_EXECUTABLE,
			headless: chromium.headless,
			ignoreHTTPSErrors: true,
		})

		const pages = await this.browser.pages()
		if (pages.length > 0) {
			this.page = pages[0]
		}

		await this.page.setRequestInterception(true)
		this.page.on('request', async request => {
			const resourceType = request.resourceType()
			if (
				['image', 'script', 'font', 'xhr', 'fetch', 'stylesheet'].includes(
					resourceType
				)
			) {
				await request.abort()
			} else {
				await request.continue()
			}
		})
	}

	async close() {
		if (this.browser !== null) {
			await this.browser.close()
		}
	}

	async fetchPageHtml(url) {
		console.log(url)
		await this.page.goto(url, { waitUntil: 'domcontentloaded' })
		return await this.page.evaluate(() => document.body.innerHTML)
	}
}

export default WebBrowser
