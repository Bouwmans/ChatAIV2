import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MessageInput } from '../components/MessageInput';

describe('MessageInput', () => {
  it('renders input field and send button', () => {
    const mockSendMessage = vi.fn();
    render(<MessageInput onSendMessage={mockSendMessage} />);
    
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onSendMessage when form is submitted', async () => {
    const mockSendMessage = vi.fn();
    render(<MessageInput onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const button = screen.getByRole('button');
    
    fireEvent.change(input, { target: { value: 'Hello world' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('Hello world');
    });
  });

  it('does not send empty messages', () => {
    const mockSendMessage = vi.fn();
    render(<MessageInput onSendMessage={mockSendMessage} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it('handles Enter key press', async () => {
    const mockSendMessage = vi.fn();
    render(<MessageInput onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('Test message');
    });
  });
});
