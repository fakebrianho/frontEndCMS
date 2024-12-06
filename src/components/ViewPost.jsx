import React from 'react';
import { Container, Title, Text, Loader, Alert } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { usePost } from '../hooks/usePosts';

export function ViewPost() {
  const { id } = useParams();
  const { post, loading, error } = usePost(id);

  if (loading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert color="red" title="Error">
          {error.message}
        </Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container>
        <Alert color="yellow" title="Not Found">
          Post not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Title order={1} mb={10}>{post.title}</Title>
      <Text size="sm" c="dimmed" mb={30}>
        {new Date(post.createdAt).toLocaleDateString()}
      </Text>
      <div className="markdown-content">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </Container>
  );
}