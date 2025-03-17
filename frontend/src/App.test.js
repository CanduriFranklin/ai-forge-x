import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders AI ForgeX Suite heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/AI ForgeX Suite/i);
  expect(headingElement).toBeInTheDocument();
});
