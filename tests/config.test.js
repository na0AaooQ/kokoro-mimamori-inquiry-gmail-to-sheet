const {
  CONFIG_KEYS,
  DEFAULT_MAX_THREADS_PER_RUN,
  buildConfigFromValues,
  parseMaxThreadsPerRun,
  getMissingRequiredConfigKeys,
  assertRequiredConfigValues,
  getConfigKeys
} = require('../src/config');

describe('getConfigKeys', () => {
  test('returns a copy of known config keys', () => {
    const keys = getConfigKeys();

    expect(keys).toEqual(CONFIG_KEYS);
    expect(keys).toContain('INQUIRY_SPREADSHEET_ID');

    keys.push('MUTATED_IN_TEST');
    expect(getConfigKeys()).not.toContain('MUTATED_IN_TEST');
  });
});

describe('buildConfigFromValues', () => {
  test('normalizes known config values and ignores unknown keys', () => {
    const config = buildConfigFromValues({
      INQUIRY_SPREADSHEET_ID: ' sheet-id-for-test ',
      GMAIL_SEARCH_QUERY: ' label:test-inquiry ',
      MAX_THREADS_PER_RUN: ' 12 ',
      UNKNOWN_KEY: 'ignored'
    });

    expect(config.INQUIRY_SPREADSHEET_ID).toBe('sheet-id-for-test');
    expect(config.INQUIRY_SHEET_NAME).toBeNull();
    expect(config.GMAIL_SEARCH_QUERY).toBe('label:test-inquiry');
    expect(config.MAX_THREADS_PER_RUN).toBe(12);
    expect(config.UNKNOWN_KEY).toBeUndefined();
  });

  test('returns null for missing or invalid MAX_THREADS_PER_RUN in raw config', () => {
    expect(buildConfigFromValues({}).MAX_THREADS_PER_RUN).toBeNull();
    expect(buildConfigFromValues({ MAX_THREADS_PER_RUN: '0' }).MAX_THREADS_PER_RUN).toBeNull();
  });
});

describe('parseMaxThreadsPerRun', () => {
  test('uses the default value when the setting is blank', () => {
    expect(parseMaxThreadsPerRun(null)).toBe(DEFAULT_MAX_THREADS_PER_RUN);
    expect(parseMaxThreadsPerRun('   ')).toBe(DEFAULT_MAX_THREADS_PER_RUN);
  });

  test('parses valid positive integers', () => {
    expect(parseMaxThreadsPerRun('1')).toBe(1);
    expect(parseMaxThreadsPerRun('50')).toBe(50);
  });

  test('rejects invalid or too large values', () => {
    expect(() => parseMaxThreadsPerRun('0')).toThrow('positive integer');
    expect(() => parseMaxThreadsPerRun('1.5')).toThrow('positive integer');
    expect(() => parseMaxThreadsPerRun('not-a-number')).toThrow('positive integer');
    expect(() => parseMaxThreadsPerRun('101')).toThrow('less than or equal to 100');
  });

  test('allows test-specific default and upper limit options', () => {
    expect(parseMaxThreadsPerRun('', { defaultValue: 3, maxValue: 5 })).toBe(3);
    expect(parseMaxThreadsPerRun('5', { defaultValue: 3, maxValue: 5 })).toBe(5);
    expect(() => parseMaxThreadsPerRun('6', { defaultValue: 3, maxValue: 5 })).toThrow(
      'less than or equal to 5'
    );
  });
});

describe('required config validation', () => {
  test('returns missing required keys', () => {
    const config = buildConfigFromValues({
      INQUIRY_SPREADSHEET_ID: 'sheet-id-for-test',
      INQUIRY_SHEET_NAME: '   ',
      GMAIL_SEARCH_QUERY: null
    });

    expect(
      getMissingRequiredConfigKeys(config, [
        'INQUIRY_SPREADSHEET_ID',
        'INQUIRY_SHEET_NAME',
        'GMAIL_SEARCH_QUERY'
      ])
    ).toEqual(['INQUIRY_SHEET_NAME', 'GMAIL_SEARCH_QUERY']);
  });

  test('throws a clear error for missing required keys', () => {
    const config = buildConfigFromValues({
      INQUIRY_SPREADSHEET_ID: 'sheet-id-for-test'
    });

    expect(() =>
      assertRequiredConfigValues(config, ['INQUIRY_SPREADSHEET_ID', 'INQUIRY_SHEET_NAME'])
    ).toThrow('INQUIRY_SHEET_NAME');
  });

  test('throws for unknown required config keys', () => {
    expect(() => getMissingRequiredConfigKeys({}, ['UNKNOWN_KEY'])).toThrow(
      'Unknown config key'
    );
  });
});
