const express = require('express')
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

async function connectDB() {
	try {
		await client.connect()
		console.log('Connected to MongoDB')
	} catch (error) {
		console.error('MongoDB connection error:', error)
		process.exit(1)
	}
}

connectDB()

const db = client.db('blog-app')
const posts = db.collection('posts')

// First, make sure this route is BEFORE any other /api/posts routes
app.patch('/api/posts/:title', async (req, res) => {
	console.log('PATCH REQUEST RECEIVED')
	console.log('URL params:', req.params)
	console.log('Request body:', req.body)

	try {
		const searchTitle = req.params.title

		// Let's try a simpler query first
		const allPosts = await posts.find({}).toArray()
		console.log('All posts:', allPosts)

		const existingPost = await posts.findOne({
			title: `"${searchTitle}"`,
		})

		console.log('Search result:', existingPost)

		if (!existingPost) {
			console.log('No post found with title:', searchTitle)
			return res.status(404).json({ error: 'Post not found' })
		}

		const result = await posts.findOneAndUpdate(
			{ _id: existingPost._id },
			{ $set: req.body },
			{ returnDocument: 'after' }
		)

		res.json(result)
	} catch (error) {
		console.error('Error:', error)
		res.status(500).json({ error: error.message })
	}
})

// Make sure this is AFTER the PATCH route
app.get('/api/posts/:id', async (req, res) => {
	try {
		const post = await posts.findOne({ _id: new ObjectId(req.params.id) })
		if (!post) {
			return res.status(404).json({ error: 'Post not found' })
		}
		res.json(post)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// Get all posts
app.get('/api/posts', async (req, res) => {
	try {
		const allPosts = await posts.find().sort({ createdAt: -1 }).toArray()
		res.json(allPosts)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// Create post
app.post('/api/posts', async (req, res) => {
	try {
		const {
			title,
			content,
			prev,
			next,
			uuid,
			children,
			parent,
			isSectionHead,
		} = req.body

		const newPost = {
			title,
			content,
			prev,
			next,
			uuid,
			children,
			parent,
			isSectionHead,
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		const result = await posts.insertOne(newPost)
		res.status(201).json({ ...newPost, _id: result.insertedId })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// Add a helper function to find post by title
app.get('/api/posts/title/:title', async (req, res) => {
	try {
		console.log('Searching for post with title:', req.params.title)
		const post = await posts.findOne({ title: req.params.title })

		if (!post) {
			return res.status(404).json({ error: 'Post not found' })
		}

		res.json(post)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})

process.on('SIGINT', async () => {
	await client.close()
	process.exit(0)
})
