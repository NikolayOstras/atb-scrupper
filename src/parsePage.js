import * as cheerio from 'cheerio'
//todo - pagination

const parsePage = html => {
	// Pass HTML as an argument
	const $ = cheerio.load(html) // Load the HTML into cheerio
	const items = $('article.catalog-item')
	const parsedItems = [] // Create an array to store parsed items

	items.map((index, element) => {
		const item = $(element)
		const img = item.find('.catalog-item__img').attr('src')
		const title = item.find('.catalog-item__title a').text().trim()
		const link =
			'https://www.atbmarket.com/' +
			item.find('.catalog-item__title a').attr('href')
		const price = item.find('.product-price__top').attr('value')
		parsedItems.push({ img, title, link, price })
	})

	return parsedItems // Return the parsed items
}
export default parsePage
