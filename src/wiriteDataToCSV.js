import fs from 'fs'
import { parse } from 'json2csv'

/**
 * Writes data to a CSV file.
 *
 * @param {string} filename - The name of the CSV file to write to.
 * @param {object[]} data - An array of objects representing the data to write.
 * @returns {Promise<void>} A promise that resolves when the data has been written to the file.
 */
const writeDataToCSV = async (filename, data) => {
	try {
		const csv = parse(data)
		await fs.promises.writeFile(filename, csv)
		console.log(`Data written to ${filename}`)
	} catch (err) {
		console.error(`Error writing to CSV: ${err}`)
		throw err
	}
}

export default writeDataToCSV
