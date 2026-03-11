import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddTask from './AddTask';

// Mock Firebase
jest.mock('../../utils/firebase');

// Mock Firebase App
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

const mockAddDoc = jest.fn();
const mockCollection = jest.fn();
const mockServerTimestamp = jest.fn(() => new Date());

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: (...args: any[]) => mockCollection(...args),
  addDoc: (...args: any[]) => mockAddDoc(...args),
  serverTimestamp: () => mockServerTimestamp(),
}));

// Mock lodash
jest.mock('lodash', () => ({
  isEmpty: (str: string) => !str || str.trim() === ''
}));

// Mock SVG imports
jest.mock('../../assets/svg/send.svg', () => ({
  ReactComponent: () => <div>SendIcon</div>
}));

describe('AddTask Component', () => {
  const mockSetReloadTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input and submit button', () => {
    render(<AddTask setReloadTask={mockSetReloadTask} />);

    const input = screen.getByPlaceholderText(/New task/i);
    const button = screen.getByRole('button', { name: 'SendIcon' });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('updates input value when typing', () => {
    render(<AddTask setReloadTask={mockSetReloadTask} />);

    const input = screen.getByPlaceholderText(/New task/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New test task' } });

    expect(input.value).toBe('New test task');
  });

  test('submits task when form is submitted with valid input', async () => {
    mockAddDoc.mockResolvedValue({ id: 'test-id' });

    render(<AddTask setReloadTask={mockSetReloadTask} />);

    const input = screen.getByPlaceholderText(/New task/i);
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Test task' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalled();
    });
    expect(mockSetReloadTask).toHaveBeenCalledWith(true);
  });

  test('does not submit task when input is empty', async () => {
    render(<AddTask setReloadTask={mockSetReloadTask} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAddDoc).not.toHaveBeenCalled();
    });
  });

  test('clears input after successful submission', async () => {
    mockAddDoc.mockResolvedValue({ id: 'test-id' });

    render(<AddTask setReloadTask={mockSetReloadTask} />);

    const input = screen.getByPlaceholderText(/New task/i) as HTMLInputElement;
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Test task' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  test('handles error when adding task fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockAddDoc.mockRejectedValue(new Error('Firebase error'));

    render(<AddTask setReloadTask={mockSetReloadTask} />);

    const input = screen.getByPlaceholderText(/New task/i);
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Test task' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
