import React from 'react'
import {
	Container,
	Title,
	Card,
	Text,
	Group,
	Stack,
	Alert,
} from '@mantine/core'
import { Link } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'

export function BlogList() {
	const { posts, loading, error } = usePosts()

	if (loading) {
		return (
			<Container>
				<Text>Loading posts...</Text>
			</Container>
		)
	}

	if (error) {
		return (
			<Container>
				<Alert color='red' title='Error'>
					{error.message}
				</Alert>
			</Container>
		)
	}

	return (
		<Container>
			<Title order={1} mb={30}>
				Blog Posts
			</Title>
			<Stack>
				{posts.map((post) => (
					<Card
						key={post._id}
						shadow='sm'
						p='lg'
						component={Link}
						to={`/post/${post.file_name}`}
					>
						<Group justify='space-between' mb={5}>
							<Text fw={500}>{post.title}</Text>
							<Text size='sm' c='dimmed'>
								{new Date(post.createdAt).toLocaleDateString()}
							</Text>
						</Group>
						<Text size='sm' c='dimmed' lineClamp={2}>
							{post.content}
						</Text>
					</Card>
				))}
			</Stack>
		</Container>
	)
}
