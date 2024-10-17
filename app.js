import cliProgress from 'cli-progress'
import categoryTree from './src/categoryTree.js'
import makeReq from './src/makeReq.js'
import writeDataToCSV from './src/wiriteDataToCSV.js'

const main = async () => {
	const startTime = Date.now() // Start time

	const allData = {}
	const progressBar = new cliProgress.SingleBar(
		{
			format:
				'Progress |{bar}| {percentage}% || {value}/{total} Requests || ETA: {eta}s',
			clearOnComplete: true,
			hideCursor: true,
		},
		cliProgress.Presets.shades_classic
	)

	const totalRequests = Object.values(categoryTree).reduce(
		(acc, curr) => acc + Object.keys(curr).length,
		0
	)
	let completedRequests = 0

	progressBar.start(totalRequests, 0)

	for (const category in categoryTree) {
		allData[category] = {}
		for (const subcategory in categoryTree[category]) {
			const url = categoryTree[category][subcategory]
			allData[category][subcategory] = await makeReq(url)
			completedRequests++
			progressBar.update(completedRequests)
		}
	}

	progressBar.stop()
	const csvData = []
	for (const category in allData) {
		for (const subcategory in allData[category]) {
			for (const product of allData[category][subcategory]) {
				csvData.push({
					category,
					subcategory,
					...product,
				})
			}
		}
	}

	await writeDataToCSV('data.csv', csvData)
	const endTime = Date.now() // End time
	const elapsedTime = endTime - startTime // Calculate elapsed time
	const elapsedSeconds = elapsedTime / 1000
	console.log(`Time taken: ${elapsedSeconds.toFixed(2)} seconds`) // Log the time
}

main()
