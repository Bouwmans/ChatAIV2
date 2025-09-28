import { describe, it, expect } from 'vitest';
import { generateConversationTitle, truncateText, formatDate } from '../utils';

describe('Utils', () => {
  describe('generateConversationTitle', () => {
    it('should truncate long messages', () => {
      const longMessage = 'This is a very long message that should be truncated because it exceeds the maximum length allowed for conversation titles';
      const title = generateConversationTitle(longMessage);
      expect(title).toBe('This is a very long message that should be truncat...');
    });

    it('should remove markdown formatting', () => {
      const message = '# Hello **world** `code` and _italic_';
      const title = generateConversationTitle(message);
      expect(title).toBe('Hello world code and italic');
    });

    it('should handle short messages', () => {
      const message = 'Hello';
      const title = generateConversationTitle(message);
      expect(title).toBe('Hello');
    });
  });

  describe('truncateText', () => {
    it('should truncate text longer than max length', () => {
      const text = 'This is a long text';
      const truncated = truncateText(text, 10);
      expect(truncated).toBe('This is a ...');
    });

    it('should not truncate text shorter than max length', () => {
      const text = 'Short';
      const truncated = truncateText(text, 10);
      expect(truncated).toBe('Short');
    });
  });

  describe('formatDate', () => {
    it('should format recent dates as time', () => {
      const now = new Date();
      const recent = new Date(now.getTime() - 1000 * 60 * 60); // 1 hour ago
      const formatted = formatDate(recent);
      expect(formatted).toMatch(/^\d{1,2}:\d{2}$/);
    });
  });
});
