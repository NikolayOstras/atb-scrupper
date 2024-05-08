import * as cheerio from 'cheerio'
import { urls } from './data/ATB/urls.js'

const DOMAIN = 'https://www.atbmarket.com/'

class ATBParser {
	constructor(browser) {
		this.browser = browser
		this.html = null
		this.parsedItems = []
		this.currentUrl = null
	}

	setUrl(categoryName, numberOfPage) {
		const url = urls[categoryName] || null
		this.currentUrl = `${url}?page=${numberOfPage}` || null
		console.log('current:', this.currentUrl)
	}

	async loadPage() {
		try {
			if (!this.currentUrl) return
			this.html = await this.browser.fetchPageHtml(this.currentUrl)
		} catch (error) {
			console.log(error)
		}
	}
	async parsePage() {
		if (!this.html) await this.loadPage()
		const $ = cheerio.load(this.html)
		const items = $('article.catalog-item')
		items.map((index, element) => {
			const item = $(element)
			const img = item.find('.catalog-item__img').attr('src')
			const title = item.find('.catalog-item__title a').text().trim()
			const link = DOMAIN + item.find('.catalog-item__title a').attr('href')
			const price = item.find('.product-price__top').attr('value')
			this.parsedItems.push({ img, title, link, price })
		})
		return this.parsedItems
	}

	async getTotalPages() {
		await this.loadPage()
		const $ = cheerio.load(this.html)
		const totalPages = $('.product-pagination__list').children().length - 2
		return totalPages
	}
}

export default ATBParser
