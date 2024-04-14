import fs from 'fs'
import path from 'path'
import { getCurrentDate } from './utils/getCurrentDate.js'
export const writeDataToJson = (data, fileName) => {
	const directoryPath = path.join('json', getCurrentDate())
	if (!fs.existsSync(directoryPath)) {
		fs.mkdirSync(directoryPath, { recursive: true })
	}
	const filePath = path.join(directoryPath, fileName)
	fs.writeFile(filePath, JSON.stringify(data, null, 2), err => {
		if (err) {
			console.error('Ошибка при записи в файл:', err)
		} else {
			console.log('Данные успешно записаны в файл:', filePath)
		}
	})
}
