import { urls } from '../urls.js'
export const checkUrlAndGetUrlName = url => {
	for (const key in urls) {
		if (urls[key] === url) {
			return key
		}
	}
	return null
}
