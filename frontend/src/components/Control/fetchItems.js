import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000/atb'

export const fetchItems = async totalPages => {
	const items = []
	for (let page = 1; page <= totalPages; page++) {
		try {
			const response = await axios.post('/parse', {
				categoryName: category,
				numberOfPage: page,
			})
			items.push(...response.data.parsedItems)
			const progress = Math.floor((page / totalPages) * 100)
			setState(prevState => ({ ...prevState, progress }))
		} catch (error) {
			setState(prevState => ({ ...prevState, error }))
			console.error(error)
			break
		}
	}
	return items
}
