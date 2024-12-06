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

// Create post
app.post('/api/posts', async (req, res) => {
	try {
		const newPost = {
			...req.body,
			createdAt: new Date(),
			updatedAt: new Date(),
		}
		const result = await posts.insertOne(newPost)
		res.status(201).json({ ...newPost, _id: result.insertedId })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// Update post by title
app.patch('/api/posts/title/:title', async (req, res) => {
	try {
		const searchTitle = req.params.title
		const existingPost = await posts.findOne({ title: searchTitle })

		if (!existingPost) {
			return res.status(404).json({ error: 'Post not found' })
		}

		let updateOperation = {}

		// If we're updating children array, use $addToSet
		if (req.body.children) {
			updateOperation.$addToSet = { children: req.body.children }
		} else {
			// For all other fields, use regular $set
			updateOperation.$set = req.body
		}

		const result = await posts.findOneAndUpdate(
			{ _id: existingPost._id },
			updateOperation,
			{ returnDocument: 'after' }
		)
		res.json(result)
	} catch (error) {
		console.error('Server Error:', error)
		res.status(500).json({ error: error.message })
	}
})

// app.patch('/api/posts/title/:title/children', async (req, res) => {
// 	try {
// 		const parentTitle = req.params.title
// 		const childTitle = req.body.child
// 		console.log('hello world')

// 		const result = await posts.findOneAndUpdate(
// 			{ title: parentTitle },
// 			{ $addToSet: { children: childTitle } },
// 			{ returnDocument: 'after' }
// 		)

// 		if (!result) {
// 			return res.status(404).json({ error: 'Parent post not found' })
// 		}

// 		res.json(result)
// 	} catch (error) {
// 		console.error('Server Error:', error)
// 		res.status(500).json({ error: error.message })
// 	}
// })

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
