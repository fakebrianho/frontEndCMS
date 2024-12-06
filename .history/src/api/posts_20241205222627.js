const API_URL = 'http://localhost:3000/api'

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

export async function updatePost(title, updates) {
	const response = await fetch(
		`${API_URL}/posts/${encodeURIComponent(title)}`,
		{
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updates),
		}
	)

	if (!response.ok) {
		throw new Error('Failed to update post')
	}
	return response.json()
}
