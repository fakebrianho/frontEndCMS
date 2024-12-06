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

// Add this at the very top of your routes, before any other routes
app.patch('/test', (req, res) => {
	console.log('Test route hit')
	res.json({ message: 'Test route working' })
})

app.get('/test', (req, res) => {
	console.log('Test GET route hit')
	res.json({ message: 'Test GET route working' })
})

// Your PATCH route
app.patch('/api/posts/:title', async (req, res) => {
	try {
		const searchTitle = req.params.title
		console.log('Attempting to update post with title:', searchTitle)
		console.log('Update data:', req.body)

		// Let's try a simpler query first
		const allPosts = await posts.find({}).toArray()
		console.log('All posts in database:', allPosts)

		// Simple exact match - no quotes, no regex, just plain search
		const existingPost = await posts.findOne({ title: searchTitle })

		console.log('Search query:', { title: searchTitle })
		console.log('Found post:', existingPost)

		if (!existingPost) {
			console.log('No post found with title:', searchTitle)
			return res.status(404).json({ error: 'Post not found' })
		}

		const result = await posts.findOneAndUpdate(
			{ _id: existingPost._id },
			{ $set: req.body },
			{ returnDocument: 'after' }
		)

		console.log('Update result:', result)
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
