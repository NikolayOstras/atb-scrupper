import cors from 'cors'
import express from 'express'
import ATBParser from './ATBParser.js'
import WebBrowser from './WebBrowser.js'
import atbParsePageRouter from './routes/atb/atbParsePageRouter.js'
import atbTotalPagesRouter from './routes/atb/atbTotalPagesRouter.js'
import atbUrlsRouter from './routes/atb/atbUrlsRouter.js'
import writeDataRouter from './routes/writeDataRouter.js'

const browser = new WebBrowser()
await browser.launch()

const app = express()
const parser = new ATBParser(browser)
app.use(express.json())
app.use(
	cors({
		origin: '*',
		methods: ['GET', 'POST'],
		allowedHeaders: '*',
	})
)
app.get('/', (req, res) => {
	res.send('Hello World')
})
app.use(writeDataRouter)
app.use(atbUrlsRouter)
app.use(atbTotalPagesRouter(parser))
app.use(atbParsePageRouter(parser))
app.listen(3000, () => {
	console.log(`Server is running on port 3000`)
})
