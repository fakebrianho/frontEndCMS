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

// Get all posts
app.get('/api/posts', async (req, res) => {
	try {
		const allPosts = await posts.find().sort({ createdAt: -1 }).toArray()
		res.json(allPosts)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// Get single post
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

// Add this new endpoint for updating posts by title
app.patch('/api/posts/:title', async (req, res) => {
	try {
		console.log('Searching for post with title:', req.params.title)
		console.log('Update data:', req.body)

		const post = await posts.findOneAndUpdate(
			{ title: req.params.title },
			{ $set: req.body },
			{ returnDocument: 'after' }
		)

		console.log('Found post:', post)

		if (!post) {
			return res.status(404).json({ error: 'Post not found' })
		}

		res.json(post)
	} catch (error) {
		console.error('Update error:', error)
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
