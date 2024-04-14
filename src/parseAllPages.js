import * as cheerio from 'cheerio'
import cliProgress from 'cli-progress'
import { chrome } from './Chrome.js'
import { parsePage } from './parsePage.js'
import { checkJsonFile } from './utils/checkJsonFile.js'
import { checkUrlAndGetUrlName } from './utils/checkUrlAndGetUrlName.js'
import { writeDataToJson } from './writeDataToJson.js'
const progressBar = new cliProgress.SingleBar({
	format:
		'Progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} Pages | Speed: {speed} pages/s',
	barCompleteChar: '\u2588',
	barIncompleteChar: '\u2591',
	hideCursor: true,
})
export const parseAllPages = async url => {
	const urlName = checkUrlAndGetUrlName(url)

	if (!urlName) {
		console.log('URL not found in the list.')
		return
	}

	if (checkJsonFile(urlName) == true) {
		console.log(urlName + ' already parsed today')
		return
	}
	let totalPages = 0
	let startTime = Date.now()
	let lastUpdateTime = startTime
	let lastPageCount = 0

	const allItems = []

	try {
		await chrome.initialize()
		let currentPage = 1

		while (true) {
			const currentTime = Date.now()
			const currentUrl = url + `?page=${currentPage}`
			const html = await chrome.getPage(currentUrl)
			const $ = cheerio.load(html)
			totalPages = $('.product-pagination__list').children().length - 2
			progressBar.start(totalPages, currentPage)

			const parsedItems = parsePage(html)
			allItems.push(...parsedItems)
			const elapsedTime = (currentTime - Date.now()) / 1000
			const pagesPerSecond =
				((currentPage - lastPageCount) / (currentTime - lastUpdateTime)) * 1000
			if (currentPage === totalPages) {
				console.log('/n Parsing complete.')
				progressBar.stop()

				await chrome.close()
				break
			}
			currentPage++
			progressBar.update(currentPage, {
				speed: pagesPerSecond.toFixed(2),
			})
		}
	} catch (error) {
		console.log(error)
		progressBar.stop()
		await chrome.close()
	}
	writeDataToJson(allItems, `${urlName}.json`)
}
