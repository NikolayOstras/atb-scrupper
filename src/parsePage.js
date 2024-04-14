import * as cheerio from 'cheerio'

export function parsePage(html) {
	const parsedItems = []
	const $ = cheerio.load(html)
	const items = $('article.catalog-item').map((index, element) => {
		const item = $(element)
		const img = item.find('.catalog-item__img').attr('src')
		const title = item.find('.catalog-item__title a').text()
		const link =
			'https://www.atbmarket.com/' +
			item.find('.catalog-item__title a').attr('href')
		const price = item.find('.product-price__top').attr('value')

		parsedItems.push({ img, title, link, price })
	})
	return parsedItems
}
