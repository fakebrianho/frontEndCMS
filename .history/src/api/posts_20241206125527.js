const API_BASE_URL = 'http://localhost:3000/api'

export const updatePost = async (title, updateData) => {
	const encodedTitle = encodeURIComponent(title)
	const url = `${API_BASE_URL}/posts/title/${encodedTitle}`
	console.log('Making PATCH request to:', url)
	console.log('With headers:', {
		'Content-Type': 'application/json',
	})
	console.log('With body:', updateData)

	try {
		const response = await fetch(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updateData),
		})

		console.log('Response status:', response.status)

		if (!response.ok) {
			const errorData = await response.json()
			console.log('Error response data:', errorData)
			throw new Error(
				errorData.error || `Failed to update post: ${response.status}`
			)
		}

		const data = await response.json()
		console.log('Success response data:', data)
		return data
	} catch (error) {
		console.error('Error updating post:', error)
		throw error
	}
}

export const pregnant = (title, updateData) => {
	//
}

export async function fetchPosts() {
	const response = await fetch(`${API_BASE_URL}/posts`)
	if (!response.ok) {
		throw new Error('Failed to fetch posts')
	}
	return response.json()
}

export async function fetchPost(id) {
	const response = await fetch(`${API_BASE_URL}/posts/${id}`)
	if (!response.ok) {
		throw new Error('Failed to fetch post')
	}
	return response.json()
}
export async function createPost(post) {
	const response = await fetch(`${API_BASE_URL}/posts`, {
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
