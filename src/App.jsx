import React from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { BlogList } from './components/BlogList';
import { CreatePost } from './components/CreatePost';
import { ViewPost } from './components/ViewPost';
import '@mantine/core/styles.css';

export default function App() {
  return (
    <MantineProvider>
      <Router>
        <AppShell>
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<ViewPost />} />
          </Routes>
        </AppShell>
      </Router>
    </MantineProvider>
  );
}