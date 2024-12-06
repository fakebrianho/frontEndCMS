import React from 'react'
import {
	Container,
	Title,
	TextInput,
	Textarea,
	Button,
	Stack,
	Alert,
	Checkbox,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useNavigate } from 'react-router-dom'
import { createPost, updatePost, updateParentPost } from '../api/posts'

export function CreatePost() {
	const navigate = useNavigate()
	const [error, setError] = React.useState(null)

	const form = useForm({
		initialValues: {
			title: '',
			content: '',
			prev: '',
			next: '',
			uuid: '',
			children: [],
			num_child_nodes: 0,
			parent: '',
			isSectionHead: false,
		},
		validate: {
			title: (value) =>
				value.trim().length === 0 ? 'Title is required' : null,
			content: (value) =>
				value.trim().length === 0 ? 'Content is required' : null,
			uuid: (value) =>
				value.trim().length === 0 ? 'uuid is required' : null,
			parent: (value, values) => {
				if (values.isSectionHead) return null
				return value.trim().length === 0
					? 'Parent is required for non-section heads'
					: null
			},
			prev: (value, values) => {
				if (values.isSectionHead) return null
				return value.trim().length === 0
					? 'Previous post is required for non-section heads'
					: null
			},
		},
	})

	const handleSubmit = async (values) => {
		try {
			console.log('Creating new post with values:', values)
			await createPost(values)

			if (values.prev && !values.isSectionHead) {
				console.log('Updating previous post:', {
					prevPost: values.prev,
					updateData: { next: values.title },
				})
				await updatePost(values.prev, { next: values.title })
			}
			if (values.next && !values.isSectionHead) {
				await updatePost(values.next, { prev: values.title })
			}
			if (values.parent) {
				console.log('Updating parent post:', {
					parentPost: values.parent,
					updateData: { children: values.title },
				})
				await updateParentPost(values.parent, values.title)
			}

			navigate('/')
		} catch (err) {
			console.error('Error in handleSubmit:', err)
			setError(
				err instanceof Error ? err.message : 'Failed to create post'
			)
		}
	}

	return (
		<Container>
			<Title order={1} mb={30}>
				Create New Post
			</Title>
			{error && (
				<Alert color='red' title='Error' mb={20}>
					{error}
				</Alert>
			)}
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack>
					<TextInput
						label='Title'
						placeholder='Enter post title'
						required
						{...form.getInputProps('title')}
					/>
					<Textarea
						label='Content'
						placeholder='Write your post content (Markdown supported)'
						minRows={10}
						required
						{...form.getInputProps('content')}
					/>
					<Textarea
						label='prev'
						placeholder='Write the name of the previous chronological post'
						required={!form.values.isSectionHead}
						{...form.getInputProps('prev')}
					/>
					<Textarea
						label='next'
						placeholder='Write the name of the next chronological post if there is one'
						{...form.getInputProps('next')}
					/>
					<Textarea
						label='uuid'
						placeholder='Write the uuid'
						required
						{...form.getInputProps('uuid')}
					/>
					<Textarea
						label='parent'
						placeholder='Write the parent post name'
						required={!form.values.isSectionHead}
						{...form.getInputProps('parent')}
					/>
					<Textarea
						label='children'
						placeholder='Write children post names'
						{...form.getInputProps('children')}
					/>
					<Checkbox
						label='Section Head'
						{...form.getInputProps('isSectionHead', {
							type: 'checkbox',
						})}
					/>
					<Button type='submit'>Create Post</Button>
				</Stack>
			</form>
		</Container>
	)
}
