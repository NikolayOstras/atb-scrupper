import express from 'express'
import { urls } from '../../data/ATB/urls.js'
const atbUrlsRouter = express.Router()

atbUrlsRouter.get('/api/atb/urls', (req, res) => {
	res.json(urls)
})

export default atbUrlsRouter
