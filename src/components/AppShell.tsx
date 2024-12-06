import React from 'react';
import { AppShell as MantineAppShell, Burger, Group } from '@mantine/core';
import { Link } from 'react-router-dom';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = React.useState(false);

  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      <MantineAppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={opened}
            onClick={() => setOpened(!opened)}
            hiddenFrom="sm"
            size="sm"
          />
          <Group>
            Blog Desktop App
          </Group>
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar p="md">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '1rem' }}>
          Home
        </Link>
        <Link to="/create" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          Create Post
        </Link>
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>
        {children}
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}