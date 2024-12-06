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
import { createPost, updatePost } from '../api/posts'

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
			children: '',
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
			// If it's not a section head and has a previous post, update the previous post
			if (!values.isSectionHead && values.prev) {
				try {
					await updatePost(values.prev, {
						next: values.title,
					})
				} catch (err) {
					console.error('Failed to update previous post:', err)
					throw new Error('Failed to update previous post')
				}
			}

			// Then create the new post
			await createPost(values)
			navigate('/')
		} catch (err) {
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
						placeholder='Write the name of the next chronological post if there is one'
						{...form.getInputProps('uuid')}
					/>
					<Textarea
						label='parent'
						placeholder='Write the name of the parent post'
						required={!form.values.isSectionHead}
						{...form.getInputProps('parent')}
					/>
					<Textarea
						label='children'
						placeholder='Write the name of the next chronological post if there is one'
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
