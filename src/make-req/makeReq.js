import parsePage from '../parsePage.js'
import { HEADERS } from './headers.js'

/**
 * Makes a request to a given URL and parses the HTML response, handling pagination.
 *
 * @param {string} url - The URL to make the request to.
 * @returns {Promise<object[]>} A promise that resolves to an array of parsed data objects.
 * @throws {Error} Throws an error if the request fails or the HTML parsing fails.
 */
const makeReq = async url => {
	let allParsedData = []
	let currentUrl = url

	try {
		const response = await fetch(currentUrl, {
			headers: HEADERS,
			body: null,
			method: 'GET',
		})

		console.log(url + ' response received. Status:', response.status)

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`)
		}

		const html = await response.text()
		const { parsedItems, totalPages } = await parsePage(html)
		console.log(parsedItems)
		allParsedData.push(...parsedItems)

		if (totalPages > 1) {
			for (let i = 2; i <= totalPages; i++) {
				const pageUrl = new URL(currentUrl)
				pageUrl.searchParams.set('page', i)

				const pageResponse = await fetch(pageUrl, {
					headers: HEADERS,
					body: null,
					method: 'GET',
				})

				if (!pageResponse.ok) {
					console.error(
						`Failed to fetch page ${i}. Status: ${pageResponse.status}`
					)
					continue
				}

				const pageHtml = await pageResponse.text()
				const { parsedItems: pageParsedData } = parsePage(pageHtml)
				allParsedData.push(...pageParsedData)
			}
		}

		return allParsedData
	} catch (error) {
		console.error('Error fetching or parsing data:', error)
		throw error // Re-throw the error to be handled by the caller
	}
}

export default makeReq
