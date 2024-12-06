// const express = require('express')
// const cors = require('cors')
// const { MongoClient, ObjectId } = require('mongodb')
// require('dotenv').config()

// const app = express()
// const port = process.env.PORT || 3000

// app.use(
// 	cors({
// 		origin: 'http://localhost:5173',
// 		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
// 		credentials: true,
// 	})
// )
// app.use(express.json())

// const uri = process.env.MONGODB_URI
// const client = new MongoClient(uri)

// async function connectDB() {
// 	try {
// 		await client.connect()
// 		console.log('Connected to MongoDB')
// 	} catch (error) {
// 		console.error('MongoDB connection error:', error)
// 		process.exit(1)
// 	}
// }

// connectDB()

// const db = client.db('blog-app')
// const posts = db.collection('posts')

// // Your PATCH route
// // In your backend index.js, update the PATCH route:
// app.patch('/api/posts/title/:title', async (req, res) => {
// 	try {
// 		const searchTitle = req.params.title.replace(/^"|"$/g, '') // Remove any surrounding quotes
// 		console.log('PATCH Request received:')
// 		console.log('- Search Title:', searchTitle)
// 		console.log('- Update Data:', req.body)

// 		// Let's see what posts we have in the database
// 		const allPosts = await posts.find({}).toArray()
// 		console.log(
// 			'All posts in database:',
// 			allPosts.map((p) => p.title)
// 		)

// 		// Find the post with exact title match
// 		const existingPost = await posts.findOne({
// 			title: searchTitle,
// 		})

// 		console.log('Found post:', existingPost)

// 		if (!existingPost) {
// 			console.log('Post not found with title:', searchTitle)
// 			return res
// 				.status(404)
// 				.json({ error: `Post not found with title: ${searchTitle}` })
// 		}

// 		const result = await posts.findOneAndUpdate(
// 			{ _id: existingPost._id },
// 			{ $set: req.body },
// 			{ returnDocument: 'after' }
// 		)

// 		console.log('Update result:', result)
// 		res.json(result)
// 	} catch (error) {
// 		console.error('Server Error:', error)
// 		res.status(500).json({ error: error.message })
// 	}
// })

// // Get all posts
// app.get('/api/posts', async (req, res) => {
// 	try {
// 		const allPosts = await posts.find().sort({ createdAt: -1 }).toArray()
// 		res.json(allPosts)
// 	} catch (error) {
// 		res.status(500).json({ error: error.message })
// 	}
// })

// // Create post
// app.post('/api/posts', async (req, res) => {
// 	try {
// 		const {
// 			title,
// 			content,
// 			prev,
// 			next,
// 			uuid,
// 			children,
// 			parent,
// 			isSectionHead,
// 		} = req.body

// 		const newPost = {
// 			title,
// 			content,
// 			prev,
// 			next,
// 			uuid,
// 			children,
// 			parent,
// 			isSectionHead,
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 		}

// 		const result = await posts.insertOne(newPost)
// 		res.status(201).json({ ...newPost, _id: result.insertedId })
// 	} catch (error) {
// 		res.status(500).json({ error: error.message })
// 	}
// })

// // Add a helper function to find post by title
// app.get('/api/posts/title/:title', async (req, res) => {
// 	try {
// 		console.log('Searching for post with title:', req.params.title)
// 		const post = await posts.findOne({ title: req.params.title })

// 		if (!post) {
// 			return res.status(404).json({ error: 'Post not found' })
// 		}

// 		res.json(post)
// 	} catch (error) {
// 		res.status(500).json({ error: error.message })
// 	}
// })

// app.listen(port, () => {
// 	console.log(`Server running on port ${port}`)
// })

// process.on('SIGINT', async () => {
// 	await client.close()
// 	process.exit(0)
// })
const express = require('express')
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

// Add request logging middleware
app.use((req, res, next) => {
	console.log(`${req.method} ${req.path}`)
	next()
})

app.use(
	cors({
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
		credentials: true,
	})
)
app.use(express.json())

// ... database connection code ...
app.get('/api/debug/posts', async (req, res) => {
	try {
		const allPosts = await posts.find({}).toArray()
		console.log('All posts in database:', allPosts)
		res.json(allPosts)
	} catch (error) {
		console.error('Error fetching posts:', error)
		res.status(500).json({ error: error.message })
	}
})

// Add a test route to verify the server is working
app.get('/api/test', (req, res) => {
	console.log('Test route hit')
	res.json({ message: 'Server is running' })
})

// Your PATCH route
app.patch('/api/posts/title/:title', async (req, res) => {
	try {
		const searchTitle = req.params.title.replace(/^"|"$/g, '')
		console.log('PATCH Request received:')
		console.log('- Search Title:', searchTitle)
		console.log('- Update Data:', req.body)

		// Let's see what posts we have in the database
		const allPosts = await posts.find({}).toArray()
		console.log(
			'All posts in database:',
			allPosts.map((p) => ({ title: p.title, _id: p._id }))
		)

		// Find the post with exact title match
		const existingPost = await posts.findOne({
			title: searchTitle,
		})

		console.log('Found post:', existingPost)

		if (!existingPost) {
			console.log('Post not found with title:', searchTitle)
			return res
				.status(404)
				.json({ error: `Post not found with title: ${searchTitle}` })
		}

		const result = await posts.findOneAndUpdate(
			{ _id: existingPost._id },
			{ $set: req.body },
			{ returnDocument: 'after' }
		)

		console.log('Update result:', result)
		res.json(result)
	} catch (error) {
		console.error('Server Error:', error)
		res.status(500).json({ error: error.message })
	}
})

// Add a catch-all route handler for debugging
app.use((req, res) => {
	console.log('404 - Route not found:', req.method, req.path)
	res.status(404).json({ error: 'Route not found' })
})

// Error handling middleware
app.use((err, req, res, next) => {
	console.error('Global error handler:', err)
	res.status(500).json({ error: err.message })
})

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
