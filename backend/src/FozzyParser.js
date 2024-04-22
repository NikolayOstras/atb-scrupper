import * as cheerio from 'cheerio'
import { urls } from './data/Fozzy/urls.js'

class FozzyParser {
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
		const items = $('article.product-miniature')
		items.map((index, element) => {
			const item = $(element)
			const img = item.find('.img-fluid').attr('src')
			const title = item.find('.product-title > a').attr('title')
			const link = item.find('a.product-thumbnail').attr('href')
			const price = item
				.find('.product-price-and-shipping .product-price')
				.attr('content')
			this.parsedItems.push({ img, title, link, price })
		})
		return this.parsedItems
	}

	async getTotalPages() {
		await this.loadPage()
		const $ = cheerio.load(this.html)
		const pagination = $('.pagination > ul')
		const childrenElements = pagination.children()
		const preLastChildElement = childrenElements.eq(childrenElements.length - 2)
		const totalPages = preLastChildElement.text().trim
		return totalPages
	}
}

export default FozzyParser
