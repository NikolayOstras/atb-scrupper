import Control from './components/Control/Control'
const App = () => {
	return (
		<div className='container'>
			<h1 className='text-3xl font-bold text-center border-b'>ATB Parser</h1>
			<Control category='drinks' />
		</div>
	)
}

export default App
