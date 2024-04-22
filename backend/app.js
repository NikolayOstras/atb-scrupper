import cors from 'cors'
import express from 'express'
import ATBParser from './src/ATBParser.js'
import WebBrowser from './src/WebBrowser.js'
import atbParsePageRouter from './src/routes/atb/atbParsePageRouter.js'
import atbTotalPagesRouter from './src/routes/atb/atbTotalPagesRouter.js'
import atbUrlsRouter from './src/routes/atb/atbUrlsRouter.js'
import writeDataRouter from './src/routes/writeDataRouter.js'

const browser = new WebBrowser()

class Server {
	constructor(browser) {
		this.app = express()
		this.server = null
		this.browser = browser
		this.parser = new ATBParser(this.browser)
	}

	configureCors() {
		this.app.use(
			cors({
				origin: '*',
				methods: ['GET', 'POST'],
				allowedHeaders: '*',
			})
		)
	}

	configureMiddlewares() {
		this.app.use(express.json())
	}

	startServer(port) {
		this.server = this.app.listen(port, () => {
			console.log(`Server is running on port ${port}`)
		})
	}

	configureRoutes() {
		this.app.use(writeDataRouter)
		this.app.use(atbUrlsRouter)
		this.app.use(atbTotalPagesRouter(this.parser))
		this.app.use(atbParsePageRouter(this.parser))
	}

	async start(port) {
		this.configureCors()
		this.configureMiddlewares()
		this.configureRoutes()
		this.startServer(port)
	}
}

const server = new Server(browser)
await server.browser.launch()

server.start(3000)
