import { collection, doc, writeBatch } from 'firebase/firestore'
import { db } from './firebaseConfig.js'

/**
 * Saves or updates products in Firestore.
 *
 * @param {Object} allData - The collected product data organized by category and subcategory.
 * @returns {Promise<void>} A promise that resolves when the data has been written to Firestore.
 */
const saveOrUpdateProducts = async allData => {
	try {
		const batch = writeBatch(db)

		for (const category in allData) {
			for (const subcategory in allData[category]) {
				const products = allData[category][subcategory]

				for (const product of products) {
					const subcategoryRef = doc(
						collection(db, 'categories', category, 'subcategories'),
						subcategory
					)
					const productDocRef = doc(collection(subcategoryRef, 'products')) // Auto ID for each product under the subcategory

					batch.set(productDocRef, {
						...product,
						categoryRef: doc(db, 'categories', category), // Reference to category
						subcategoryRef: subcategoryRef, // Reference to subcategory
						prices: product.price
							? [
									{
										number: parseFloat(product.price),
										timestamp: new Date().toISOString(),
									},
							  ]
							: [], // Price history
					})
				}
			}
		}

		await batch.commit()
		console.log('Products saved/updated successfully!')
	} catch (error) {
		console.error('Error saving/updating products:', error)
		throw error
	}
}

export default saveOrUpdateProducts
