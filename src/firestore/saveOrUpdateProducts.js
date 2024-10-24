import {
	addDoc,
	collection,
	doc,
	getDocs,
	query,
	where,
	writeBatch,
} from 'firebase/firestore'

import { db } from './firebaseConfig.js'

/**
 * Saves or updates products in Firestore with auto-generated IDs.
 * Data structure: *category name* -> *subcategory name* -> product (auto-ID).
 *
 * @param {Object} data - The collected product data organized by category and subcategory.
 * @returns {Promise<void>} A promise that resolves when the data has been written to Firestore.
 */
const saveOrUpdateProducts = async data => {
	try {
		console.log('Saving/updating products...')

		const batch = writeBatch(db)

		for (const category in data) {
			for (const subcategory in data[category]) {
				const products = data[category][subcategory]

				for (const product of products) {
					console.log('Writing', product.title, 'to Firestore')

					// Reference the subcollection where products are stored
					const productsCollectionRef = collection(
						db,
						'categories',
						category,
						'subcategories',
						subcategory,
						'products'
					)

					// Check if a product with the same title already exists
					const q = query(
						productsCollectionRef,
						where('title', '==', product.title)
					)
					const querySnapshot = await getDocs(q)

					if (querySnapshot.empty) {
						// Product doesn't exist, create a new document with auto-ID
						const productDocRef = await addDoc(productsCollectionRef, {
							...product,
							categoryRef: doc(db, 'categories', category),
							subcategoryRef: doc(
								db,
								'categories',
								category,
								'subcategories',
								subcategory
							),
							prices: [
								{ price: product.price, timestamp: new Date().toISOString() },
							],
						})

						console.log('Added new product with ID:', productDocRef.id)
					} else {
						// Product exists, update its price history
						const existingProductDoc = querySnapshot.docs[0]
						const existingProductData = existingProductDoc.data()
						let priceHistory = existingProductData.prices || []

						priceHistory.push({
							price: product.price,
							timestamp: new Date().toISOString(),
						})

						batch.update(existingProductDoc.ref, { prices: priceHistory })
						console.log('Updated product with ID:', existingProductDoc.id)
					}
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
