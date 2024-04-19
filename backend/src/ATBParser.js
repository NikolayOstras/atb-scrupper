import * as cheerio from 'cheerio'
import { urls } from './data/urls.js'
import { writeDataToJson } from './utils/writeDataToJson.js'

const DOMAIN = 'https://www.atbmarket.com/'

class ATBParser {
	constructor(categoryName, sendDataToClient, browser) {
		this.browser = browser
		this.categoryName = categoryName
		this.html = ''
		this.parsedItems = []
		this.url = urls[categoryName] || null
		this.sendDataToClient = sendDataToClient
		this.currentPage = 1
		this.totalPages = 2
		this.currentUrl = `${this.url}?page=${this.currentPage}`
	}

	parsePage() {
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
	}
	async parseCategory() {
		if (!this.url) return

		try {
			while (this.currentPage <= this.totalPages) {
				const startTime = Date.now()
				this.html = await this.browser.fetchPageHtml(this.currentUrl)
				const $ = cheerio.load(this.html)
				// TODO: optimize getting of totalPages
				// BUG: no load total pages in headless mode
				this.totalPages = $('.product-pagination__list').children().length - 2
				console.log(this.totalPages)
				this.parsePage()
				debugger
				const endTime = Date.now() // Засекаем конечное время
				const parsingTime = endTime - startTime
				this.sendDataToClient({
					completed: this.currentPage,
					total: this.totalPages,
					speed: parsingTime,
				})
				this.currentPage++
				this.currentUrl = `${this.url}?page=${this.currentPage}`
			}
		} catch (error) {
			throw error
		}
		writeDataToJson(this.parsedItems, this.categoryName + '.json')
	}
}

export default ATBParser
