import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Task from './Task';

// Mock Firebase
jest.mock('../../utils/firebase');

// Mock Firebase App
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

const mockUpdateDoc = jest.fn();
const mockDeleteDoc = jest.fn();
const mockDoc = jest.fn();

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  doc: (...args: any[]) => mockDoc(...args),
  updateDoc: (...args: any[]) => mockUpdateDoc(...args),
  deleteDoc: (...args: any[]) => mockDeleteDoc(...args),
}));

// Mock SVG imports
jest.mock('../../assets/svg/check.svg', () => ({
  ReactComponent: ({ className, ...props }: any) => (
    <div data-testid="check-icon" className={className} {...props}>
      CheckIcon
    </div>
  )
}));
jest.mock('../../assets/svg/delete.svg', () => ({
  ReactComponent: (props: any) => <div data-testid="delete-icon" {...props}>DeleteIcon</div>
}));

describe('Task Component', () => {
  const mockSetReloadTask = jest.fn();
  const mockTask = {
    id: 'test-task-id',
    name: 'Test Task',
    done: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task name', () => {
    render(<Task task={mockTask} setReloadTask={mockSetReloadTask} />);

    const taskName = screen.getByText('Test Task');
    expect(taskName).toBeInTheDocument();
  });

  test('renders check and delete icons', () => {
    render(<Task task={mockTask} setReloadTask={mockSetReloadTask} />);

    const checkIcon = screen.getByTestId('check-icon');
    const deleteIcon = screen.getByTestId('delete-icon');

    expect(checkIcon).toBeInTheDocument();
    expect(deleteIcon).toBeInTheDocument();
  });

  test('applies done class when task is completed', () => {
    const completedTask = { ...mockTask, done: true };
    render(<Task task={completedTask} setReloadTask={mockSetReloadTask} />);

    const checkIcon = screen.getByTestId('check-icon');
    expect(checkIcon).toHaveClass('done');
  });

  test('toggles task completion when check icon is clicked', async () => {
    mockUpdateDoc.mockResolvedValue({});

    render(<Task task={mockTask} setReloadTask={mockSetReloadTask} />);

    const checkIcon = screen.getByTestId('check-icon');
    fireEvent.click(checkIcon);

    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
    expect(mockSetReloadTask).toHaveBeenCalledWith(true);
  });

  test('shows confirmation modal when delete icon is clicked', () => {
    render(<Task task={mockTask} setReloadTask={mockSetReloadTask} />);

    const deleteIcon = screen.getByTestId('delete-icon');
    fireEvent.click(deleteIcon);

    const modalTitle = screen.getByText(/Confirm deletion/i);
    expect(modalTitle).toBeInTheDocument();
  });

  test('displays task name in modal confirmation', () => {
    render(<Task task={mockTask} setReloadTask={mockSetReloadTask} />);

    const deleteIcon = screen.getByTestId('delete-icon');
    fireEvent.click(deleteIcon);

    const confirmationText = screen.getByText(/Are you sure you want to delete the task "Test Task"/i);
    expect(confirmationText).toBeInTheDocument();
  });

  test('closes modal when cancel button is clicked', async () => {
    render(<Task task={mockTask} setReloadTask={mockSetReloadTask} />);

    const deleteIcon = screen.getByTestId('delete-icon');
    fireEvent.click(deleteIcon);

    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText(/Confirm deletion/i)).not.toBeInTheDocument();
    });
  });

  test('deletes task when delete button is clicked in modal', async () => {
    mockDeleteDoc.mockResolvedValue({});

    render(<Task task={mockTask} setReloadTask={mockSetReloadTask} />);

    const deleteIcon = screen.getByTestId('delete-icon');
    fireEvent.click(deleteIcon);

    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
    expect(mockSetReloadTask).toHaveBeenCalledWith(true);
  });

  test('handles error when updating task fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockUpdateDoc.mockRejectedValue(new Error('Firebase error'));

    render(<Task task={mockTask} setReloadTask={mockSetReloadTask} />);

    const checkIcon = screen.getByTestId('check-icon');
    fireEvent.click(checkIcon);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  test('handles error when deleting task fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockDeleteDoc.mockRejectedValue(new Error('Firebase error'));

    render(<Task task={mockTask} setReloadTask={mockSetReloadTask} />);

    const deleteIcon = screen.getByTestId('delete-icon');
    fireEvent.click(deleteIcon);

    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
