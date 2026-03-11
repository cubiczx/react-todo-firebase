import { render, screen } from '@testing-library/react';
import App from './App';

// Mock Firebase
jest.mock('./utils/firebase');

// Mock Firebase App and Firestore functions
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

// Mock Firebase Firestore functions
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  query: jest.fn(),
  orderBy: jest.fn(),
}));

// Mock SVG imports
jest.mock('./assets/svg/check.svg', () => ({
  ReactComponent: () => <div>CheckIcon</div>
}));
jest.mock('./assets/svg/delete.svg', () => ({
  ReactComponent: () => <div>DeleteIcon</div>
}));
jest.mock('./assets/svg/send.svg', () => ({
  ReactComponent: () => <div>SendIcon</div>
}));

describe('App Component', () => {
  test('renders app title', async () => {
    render(<App />);
    const titleElement = await screen.findByText(/Listado de tareas de Xavier Palacín Ayuso/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders Today section', async () => {
    render(<App />);
    const todayElement = await screen.findByText(/Today/i);
    expect(todayElement).toBeInTheDocument();
  });
});
