import cors from 'cors'
import express from 'express'
import WebSocket from 'ws'
import ATBParser from './src/ATBParser.js'
import WebBrowser from './src/WebBrowser.js'
import { urls } from './src/data/urls.js'

const browser = new WebBrowser()

class Server {
	constructor(browser) {
		this.clients = new Set()
		this.app = express()
		this.server = null
		this.wss = null
		this.browser = browser
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

	configureWebSocket() {
		this.wss = new WebSocket.Server({ server: this.server })

		this.wss.on('connection', ws => {
			this.clients.add(ws)
			console.log('New client connected')

			ws.on('close', () => {
				this.clients.delete(ws)
				console.log('Client disconnected')
			})
		})
	}

	sendDataToClients(data) {
		if (!this.clients) return
		this.clients.forEach(client => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(data))
			}
		})
	}

	configureRoutes() {
		this.app.get('/atb/urls', (req, res) => {
			res.json(urls)
		})

		this.app.post('/atb/parse', async (req, res) => {
			const { categoryName } = req.body

			if (!categoryName)
				return res.status(400).json({ error: 'URL is missing .' })

			try {
				const parser = new ATBParser(
					categoryName,
					this.sendDataToClients,
					this.browser
				)
				await parser.parseCategory()
				return res.json({ message: 'Parsing completed successfully.' })
			} catch (error) {
				console.log(error)
				return res
					.status(500)
					.json({ error: 'An error occurred during parsing.' })
			}
		})
	}

	async start(port) {
		this.configureCors()
		this.configureMiddlewares()
		this.startServer(port)
		this.configureWebSocket()
		this.configureRoutes()
	}
}

const server = new Server(browser)
await server.browser.launch()

server.start(3000)
