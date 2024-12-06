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
// app.patch('/api/posts/title/:title', async (req, res) => {
// 	try {

// 		// Log for debugging
// 		console.log('Updating post with title:', req.params.title)
// 		console.log('New child to add:', req.body.children)

// 		const result = await posts.findOneAndUpdate(
// 			{ title: req.params.title }, // Query by title directly
// 			{
// 				$push: {
// 					children: req.body.children,
// 				},
// 			},
// 			{
// 				$set: {
// 					num_child_nodes: { $size: '$children' },
// 				},
// 			},
// 			{
// 				returnDocument: 'after',
// 				new: true,
// 			}
// 		)

// 		if (!result) {
// 			return res.status(404).json({ error: 'Post not found' })
// 		}

// 		console.log('Updated result:', result)
// 		res.json(result)
// 	} catch (error) {
// 		console.error('Server Error:', error)
// 		res.status(500).json({ error: error.message })
// 	}
// })
app.patch('/api/posts/title/:title', async (req, res) => {
	try {
		console.log('Updating post with title:', req.params.title)
		console.log('New child to add:', req.body.children)

		// First update - add the child
		const result = await posts.findOneAndUpdate(
			{ title: req.params.title },
			{
				$push: {
					children: req.body.children,
				},
			},
			{
				returnDocument: 'after',
				new: true,
			}
		)

		if (!result) {
			return res.status(404).json({ error: 'Post not found' })
		}

		// Second update - update the count based on array length
		await posts.updateOne(
			{ title: req.params.title },
			{
				$set: {
					num_child_nodes: result.children.length,
				},
			}
		)

		// Get the final result after both updates
		const finalResult = await posts.findOne({ title: req.params.title })

		console.log('Updated result:', finalResult)
		res.json(finalResult)
	} catch (error) {
		console.error('Server Error:', error)
		res.status(500).json({ error: error.message })
	}
})
app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
