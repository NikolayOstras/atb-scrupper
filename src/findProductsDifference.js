const findProductDifference = (newData, oldData) => {
	const difference = {}
	let newProductsCount = 0
	let changedProductsCount = 0

	// Iterate over categories and subcategories in newData
	for (const category in newData) {
		for (const subcategory in newData[category]) {
			// Compare products within the subcategory
			const newProducts = newData[category][subcategory]
			const oldProducts = oldData[category][subcategory] || [] // Handle cases where the subcategory doesn't exist in old data

			const productDifference = newProducts.filter(newProduct => {
				// Find if there's an old product with the same title, img, and price
				const matchingOldProduct = oldProducts.find(oldProduct => {
					return (
						oldProduct.title === newProduct.title &&
						oldProduct.img === newProduct.img &&
						oldProduct.link === newProduct.link
					)
				})

				if (!matchingOldProduct) {
					newProductsCount++
					return true // It's a new product
				} else if (matchingOldProduct.price !== newProduct.price) {
					changedProductsCount++
					return true // Price has changed
				}

				return false // Product is unchanged
			})

			if (productDifference.length > 0) {
				difference[category] = {
					...(difference[category] || {}),
					[subcategory]: productDifference,
				}
			}
		}
	}
	console.log(
		`Found ${newProductsCount} new products and ${changedProductsCount} changed products`
	)
	return difference
}

export default findProductDifference
