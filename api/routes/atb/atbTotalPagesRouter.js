import express from 'express'

const atbTotalPagesRouter = parser => {
	const router = express.Router()

	router.post('/api/atb/total', async (req, res) => {
		const { categoryName } = req.body
		if (!categoryName) {
			return res.status(400).json({ error: 'Category name is missing.' })
		}
		try {
			parser.setUrl(categoryName, 1)
			const totalPages = await parser.getTotalPages()
			return res.json({ totalPages: totalPages })
		} catch (error) {
			console.log(error)
			return res.status(500).json({ error: 'An error occurred.' })
		}
	})

	return router
}

export default atbTotalPagesRouter
