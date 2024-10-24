import fs from 'fs'
import categoryTree from './src/categoryTree.js'
import findProductDifference from './src/findProductsDifference.js'
import saveOrUpdateProducts from './src/firestore/saveOrUpdateProducts.js'
import makeReq from './src/makeReq.js'
import writeDataToCSV from './src/wiriteDataToCSV.js'

/**
 * Main function to scrape product data, save to CSV, and update Firestore.
 */

const main = async () => {
	const startTime = Date.now()
	const parsedData = {}
	for (const category in categoryTree) {
		parsedData[category] = {}
		for (const subcategory in categoryTree[category]) {
			const url = categoryTree[category][subcategory]
			parsedData[category][subcategory] = await makeReq(url)
		}
	}
	// save in csv to local usage
	await writeDataToCSV('data.csv', parsedData)

	// Compare the new data with the old data and find the difference
	let difference = {}
	if (fs.existsSync('data.old.json')) {
		const oldData = JSON.parse(fs.readFileSync('data.old.json', 'utf-8'))
		difference = findProductDifference(parsedData, oldData)
		fs.writeFileSync('data.old.json', JSON.stringify(parsedData, null, 2))
	} else {
		const productsAmount = Object.values(parsedData).reduce(
			(total, category) => {
				return (
					total +
					Object.values(category).reduce((subTotal, subcategory) => {
						return (
							subTotal + (Array.isArray(subcategory) ? subcategory.length : 0)
						)
					}, 0)
				)
			},
			0
		)

		console.log(
			'No old data found. Creating a new one,parsed ' +
				productsAmount +
				' products'
		)

		difference = parsedData
		fs.writeFileSync('data.old.json', JSON.stringify(parsedData, null, 2))
	}

	// Process the 'difference' object, e.g., update Firestore
	saveOrUpdateProducts(difference)

	const elapsedSeconds = (Date.now() - startTime) / 1000
	console.log(`Time taken: ${elapsedSeconds.toFixed(2)} seconds`)
}

main()
