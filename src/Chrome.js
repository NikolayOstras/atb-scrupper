import puppeteer from 'puppeteer-extra'
import stealth from 'puppeteer-extra-plugin-stealth'

const defaultViewport = {
	width: 1280,
	height: 800,
}
puppeteer.use(stealth())

class Chrome {
	constructor() {
		this.browser = null
		this.page = null
	}

	async initialize() {
		this.browser = await puppeteer.launch({ defaultViewport: defaultViewport })
		this.page = await this.browser.newPage({ javascriptEnabled: false })
		await this.page.setRequestInterception(true)

		this.page.on('request', request => {
			const requestType = request.resourceType()
			if (requestType === 'document') {
				request.continue()
			} else {
				request.abort()
			}
		})
	}

	async close() {
		if (this.browser) {
			await this.browser.close()
			this.browser = null
			this.page = null
		}
	}

	async getPage(url) {
		await this.page.goto(url, { waitUntil: 'domcontentloaded' })
		const html = await this.page.evaluate(() => document.body.innerHTML)

		return html
	}
}
export const chrome = new Chrome()
