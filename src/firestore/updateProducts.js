import {
	addDoc,
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore'
import { db } from './firebaseConfig.js'

async function updateProducts(newProducts) {
	for (const categoryName in newProducts) {
		const categoryRef = await getOrCreateDocument('categories', {
			title: categoryName,
		})

		for (const subCategoryName in newProducts[categoryName]) {
			const subCategoryRef = await getOrCreateDocument('subcategories', {
				title: subCategoryName,
				category: categoryRef,
			})

			const products = newProducts[categoryName][subCategoryName]

			for (const product of products) {
				await createOrUpdateProduct(product, categoryRef, subCategoryRef)
			}
		}
	}
}

export async function updateSubCategoryCount(subCategoryRef, productCount) {
	await updateDoc(subCategoryRef, { amount: productCount })
}

// Generic function to get or create a document based on conditions
export async function getOrCreateDocument(collectionName, conditions) {
	const collectionRef = collection(db, collectionName)

	// Filter out any undefined values from the conditions
	const validConditions = Object.entries(conditions).filter(
		([key, value]) => value !== undefined
	)

	if (validConditions.length === 0) {
		throw new Error('All condition values are undefined')
	}

	const q = query(
		collectionRef,
		...validConditions.map(([field, value]) => where(field, '==', value))
	)
	const querySnapshot = await getDocs(q)

	return querySnapshot.empty
		? await addDoc(collectionRef, conditions)
		: querySnapshot.docs[0].ref
}

async function createOrUpdateProduct(product, categoryRef, subCategoryRef) {
	const productsRef = collection(db, 'products')
	const q = query(productsRef, where('link', '==', product.link))
	const querySnapshot = await getDocs(q)

	const productData = {
		title: product.title,
		img: product.img,
		link: product.link,
		price: product.price,
		category: categoryRef,
		subcategory: subCategoryRef,
	}

	const clientTimestamp = new Date()

	if (querySnapshot.empty) {
		// Product doesn't exist, create it with initial price history
		await addDoc(productsRef, {
			...productData,
			priceHistory: [{ price: product.price, timestamp: clientTimestamp }],
		})
		console.log(`Created product: ${product.title}`)
	} else {
		const productDocRef = doc(db, 'products', querySnapshot.docs[0].id)

		// Ensure currentHistory is an array
		const currentHistory = querySnapshot.docs[0].data().priceHistory || []
		const updatedHistory = [
			...currentHistory,
			{ price: product.price, timestamp: clientTimestamp },
		]

		await updateDoc(productDocRef, {
			...productData,
			priceHistory: updatedHistory,
		})

		console.log(
			`Updated product: ${product.title}  ${
				querySnapshot.docs[0].data().price !== product.price
					? 'price changed'
					: ''
			}`
		)
	}
}
export default updateProducts
