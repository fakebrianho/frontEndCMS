const API_URL = 'http://localhost:3000/api'

const API_BASE_URL = '/api'

export const updatePost = async (title, updateData) => {
	const encodedTitle = encodeURIComponent(title)
	const url = `${API_URL}/posts/title/${encodedTitle}`
	console.log('Making PATCH request to:', url)
	console.log('Update data:', updateData)

	try {
		const response = await fetch(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updateData),
		})

		if (!response.ok) {
			const errorData = await response
				.json()
				.catch(() => ({ error: 'Network response was not ok' }))
			console.log('Error response:', errorData)
			throw new Error(
				errorData.error || `Failed to update post: ${response.status}`
			)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error('Error updating post:', error)
		throw error
	}
}

export async function fetchPosts() {
	const response = await fetch(`${API_URL}/posts`)
	if (!response.ok) {
		throw new Error('Failed to fetch posts')
	}
	return response.json()
}

export async function fetchPost(id) {
	const response = await fetch(`${API_URL}/posts/${id}`)
	if (!response.ok) {
		throw new Error('Failed to fetch post')
	}
	return response.json()
}

export async function createPost(post) {
	const response = await fetch(`${API_URL}/posts`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(post),
	})
	if (!response.ok) {
		throw new Error('Failed to create post')
	}
	return response.json()
}

// export const updatePost = async (title, updateData) => {
// 	// Encode the title for URL safety
// 	const encodedTitle = encodeURIComponent(title)
// 	try {
// 		const response = await fetch(`/api/posts/title/${encodedTitle}`, {
// 			method: 'PATCH',
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify(updateData),
// 		})

// 		if (!response.ok) {
// 			const error = await response.json()
// 			throw new Error(error.error || 'Failed to update post')
// 		}

// 		return await response.json()
// 	} catch (error) {
// 		console.error('Error updating post:', error)
// 		throw error
// 	}
// }
