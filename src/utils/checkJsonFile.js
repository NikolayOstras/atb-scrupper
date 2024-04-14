import fs from 'fs'
import { getCurrentDate } from './getCurrentDate.js'
export const checkJsonFile = name => {
	console.log('start checkjson')
	const currentDate = getCurrentDate()
	const fileName = `json/${currentDate}/${name}.json`
	console.log('filename:' + fileName)

	try {
		const fileData = fs.readFileSync(fileName, 'utf-8')
		const parsedData = JSON.parse(fileData)

		if (parsedData.length > 0) {
			return true
		}
	} catch (error) {
		// File does not exist or error reading file
		return false
	}

	return false
}
