import express from 'express'

const atbParsePageRouter = parser => {
	const router = express.Router()

	router.post('/api/atb/parse', async (req, res) => {
		const { categoryName, numberOfPage } = req.body

		try {
			parser.setUrl(categoryName, numberOfPage)
			await parser.loadPage()
			const items = await parser.parsePage()
			return res.json({ parsedItems: items })
		} catch (error) {
			console.log(error)
			return res
				.status(500)
				.json({ error: 'An error occurred during parsing.' })
		}
	})

	return router
}

export default atbParsePageRouter
