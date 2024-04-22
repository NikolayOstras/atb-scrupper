import axios from 'axios'
import React from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { MoonLoader } from 'react-spinners'
axios.defaults.baseURL = 'http://localhost:3000/atb'
const Control = ({ category }) => {
	const [state, setState] = React.useState({
		loading: false,
		parsedItems: [],
		progress: 0,
		error: null,
		completed: false,
	})

	const fetchItems = async totalPages => {
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

	const handleLaunchClick = async () => {
		setState(prevState => ({ ...prevState, completed: false, loading: true }))
		try {
			const response = await axios.post('/total', {
				categoryName: category,
			})
			const items = await fetchItems(response.data.totalPages)
			setState(prevState => ({
				...prevState,
				parsedItems: [...prevState.parsedItems, ...items],
				completed: true,
			}))
		} catch (error) {
			setState(prevState => ({ ...prevState, error }))
			console.error(error)
		} finally {
			setState(prevState => ({
				...prevState,
				loading: false,
				progress: 0,
			}))
		}
	}

	return (
		<div className='flex items-center gap-4'>
			<h2>{category}</h2>
			<button
				className='flex gap-2 px-4 py-2 text-blue-300 transition-colors rounded bg-neutral-700 hover:bg-neutral-600'
				onClick={handleLaunchClick}
				disabled={state.loading}
			>
				{!state.loading ? 'Launch' : `${state.progress}%`}
				<MoonLoader size={20} color='#64B5F6' loading={state.loading} />
			</button>
			{state.completed && !state.error && <FaCheck className='text-blue-500' />}
			{state.error && <FaTimes className='text-red-500' />}
			<div className='h-1 mt-4 bg-neutral-300'>
				<div
					className='w-full h-full bg-blue-300'
					style={{ width: `${state.progress}%` }}
				></div>
			</div>
		</div>
	)
}

export default Control
