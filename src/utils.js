/**
 * 空文字列をnullへ正規化する。
 *
 * @param {?string} value 対象文字列。
 * @return {?string} 正規化後の文字列。
 */
function normalizeBlank(value) {
  if (value === null || value === undefined) {
    return null;
  }

  var trimmed = String(value).trim();
  return trimmed === '' ? null : trimmed;
}

/**
 * 正の整数文字列を数値へ変換する。未設定または不正値はnull。
 *
 * @param {?string} value 対象文字列。
 * @return {?number} 正の整数またはnull。
 */
function parsePositiveIntegerOrNull(value) {
  var normalized = normalizeBlank(value);
  if (normalized === null) {
    return null;
  }

  var parsed = Number(normalized);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

/**
 * 現在日時をISO 8601文字列で返す。
 *
 * @return {string} 現在日時。
 */
function getNowIsoString() {
  return new Date().toISOString();
}
