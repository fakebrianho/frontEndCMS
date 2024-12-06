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

app.get('/api/posts/:title', async (req, res) => {
	try {
		const post = await posts.findOne({ file_name: req.params.title })
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
		// console.log('Updating post with title:', req.params.title)
		// console.log('New child to add:', req.body.children)
		// console.log('postss', posts)

		const currentDoc = await posts.findOne({
			file_name: req.params.title,
		})
		if (!currentDoc) {
			return res.status(404).json({ error: 'Post not found' })
		}

		let updateOperation = {}
		if (req.body.children) {
			const currentChildren = currentDoc.children
				? currentDoc.children.filter((child) => child !== null)
				: []
			const newChild = req.body.children
			if (!currentChildren.includes(newChild)) {
				currentChildren.push(newChild)
			}
			updateOperation = {
				children: currentChildren,
				num_child_nodes: currentChildren.length,
			}
		} else if (req.body.next) {
			updateOperation = {
				next: req.body.next,
			}
		} else {
			updateOperation = req.body
		}

		console.log('Update operation:', updateOperation)

		// The fix: wrap updateOperation in $set
		const result = await posts.findOneAndUpdate(
			{ title: req.params.title },
			{ $set: updateOperation }, // This was the key fix
			{
				returnDocument: 'after',
				new: true,
			}
		)

		console.log('Updated result:', result)
		res.json(result)
	} catch (error) {
		console.error('Server Error:', error)
		res.status(500).json({ error: error.message })
	}
})

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
