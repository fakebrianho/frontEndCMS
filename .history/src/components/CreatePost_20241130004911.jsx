import React from 'react'
import {
	Container,
	Title,
	TextInput,
	Textarea,
	Button,
	Stack,
	Alert,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../api/posts'

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
		},
		validate: {
			title: (value) =>
				value.trim().length === 0 ? 'Title is required' : null,
			content: (value) =>
				value.trim().length === 0 ? 'Content is required' : null,
		},
	})

	const handleSubmit = async (values) => {
		try {
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
					<Button type='submit'>Create Post</Button>
				</Stack>
			</form>
		</Container>
	)
}
