import express from 'express'
import { writeDataToJson } from '../utils/writeDataToJson.js'
const writeDataRouter = express.Router()

writeDataRouter.post('/api/write-json', (req, res) => {
	const { data, filename } = req.body
	console.log('data:', data, 'filename:', filename)
	if (!data || !filename) {
		return res.status(400).json({ error: 'Data or fileName is missing.' })
	}
	try {
		writeDataToJson(data, filename)
		return res.json({ message: 'Data successfully written to JSON file.' })
	} catch (error) {
		console.error('Error writing data to JSON file:', error)
		return res
			.status(500)
			.json({ error: 'An error occurred while writing data to JSON file.' })
	}
})

export default writeDataRouter
