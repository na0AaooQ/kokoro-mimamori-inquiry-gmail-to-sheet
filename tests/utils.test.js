const {
  normalizeBlank,
  parsePositiveIntegerOrNull,
  truncateText,
  formatDateToIsoString,
  generateInquiryId,
  buildGmailSearchUrl
} = require('../src/utils');

describe('normalizeBlank', () => {
  test('null, undefined, blank values become null', () => {
    expect(normalizeBlank(null)).toBeNull();
    expect(normalizeBlank(undefined)).toBeNull();
    expect(normalizeBlank('')).toBeNull();
    expect(normalizeBlank('   ')).toBeNull();
  });

  test('non-blank values are trimmed and stringified', () => {
    expect(normalizeBlank('  test value  ')).toBe('test value');
    expect(normalizeBlank(123)).toBe('123');
  });
});

describe('parsePositiveIntegerOrNull', () => {
  test('positive integer strings become numbers', () => {
    expect(parsePositiveIntegerOrNull('1')).toBe(1);
    expect(parsePositiveIntegerOrNull(' 25 ')).toBe(25);
  });

  test('blank and invalid values become null', () => {
    expect(parsePositiveIntegerOrNull('')).toBeNull();
    expect(parsePositiveIntegerOrNull('0')).toBeNull();
    expect(parsePositiveIntegerOrNull('-1')).toBeNull();
    expect(parsePositiveIntegerOrNull('1.5')).toBeNull();
    expect(parsePositiveIntegerOrNull('not-a-number')).toBeNull();
  });
});

describe('truncateText', () => {
  test('keeps values within the requested maximum length', () => {
    expect(truncateText('abcdefghij', 8)).toBe('abcde...');
    expect(truncateText('abcdefghij', 8)).toHaveLength(8);
    expect(truncateText('abcdefghij', 3)).toBe('abc');
    expect(truncateText('abcdefghij', 0)).toBe('');
  });

  test('does not modify short values and treats blank values as empty strings', () => {
    expect(truncateText('abc', 5)).toBe('abc');
    expect(truncateText('   ', 5)).toBe('');
    expect(truncateText(null, 5)).toBe('');
  });

  test('rejects invalid maxLength values', () => {
    expect(() => truncateText('abc', -1)).toThrow('maxLength');
    expect(() => truncateText('abc', 1.5)).toThrow('maxLength');
  });
});

describe('formatDateToIsoString', () => {
  test('formats date-like values as ISO 8601 strings', () => {
    expect(formatDateToIsoString('2026-01-02T03:04:05.000Z')).toBe(
      '2026-01-02T03:04:05.000Z'
    );
  });

  test('rejects invalid date values', () => {
    expect(() => formatDateToIsoString('invalid-date')).toThrow('Invalid date');
  });
});

describe('generateInquiryId', () => {
  test('generates a deterministic inquiry id without exposing message content', () => {
    expect(
      generateInquiryId('2026-01-02T03:04:05.000Z', 'gmail-message-abc12345')
    ).toBe('INQ-20260102030405-ABC12345');
  });

  test('requires a Gmail message id', () => {
    expect(() => generateInquiryId('2026-01-02T03:04:05.000Z', '')).toThrow(
      'gmailMessageId'
    );
  });
});

describe('buildGmailSearchUrl', () => {
  test('builds an encoded Gmail search URL', () => {
    const query = 'subject:"contact form" newer_than:1d';
    expect(buildGmailSearchUrl(query)).toBe(
      'https://mail.google.com/mail/u/0/#search/' + encodeURIComponent(query)
    );
  });

  test('returns the base search URL for blank values', () => {
    expect(buildGmailSearchUrl('   ')).toBe('https://mail.google.com/mail/u/0/#search/');
  });
});
