import parsePage from './parsePage.js'

const makeReq = async url => {
	try {
		// console.log(url)
		// console.log('Fetching data from ATB Market...')
		const response = await fetch(url, {
			headers: {
				accept:
					'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
				'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,uk;q=0.6',
				priority: 'u=0, i',
				'sec-ch-ua':
					'"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"Windows"',
				'sec-fetch-dest': 'document',
				'sec-fetch-mode': 'navigate',
				'sec-fetch-site': 'same-origin',
				'sec-fetch-user': '?1',
				'upgrade-insecure-requests': '1',

				// Referer: 'https://www.atbmarket.com/catalog/287-ovochi-ta-frukti',
				// 'Referrer-Policy': 'strict-origin-when-cross-origin',
			},
			body: null,
			method: 'GET',
		})

		// console.log('Response received. Status:', response.status)
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`)
		}
		const html = await response.text()
		// console.log('Parsing HTML...')
		const parsedData = parsePage(html)
		// console.log('Parsing complete.')

		return parsedData
	} catch (error) {
		console.error('Error fetching or parsing data:', error)
		throw error // Re-throw the error to be handled by the caller
	}
}
export default makeReq
