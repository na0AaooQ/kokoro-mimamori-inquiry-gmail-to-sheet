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
 * 文字列を最大文字数に収める。省略時も戻り値はmaxLength以内にする。
 *
 * @param {?string} value 対象文字列。
 * @param {number} maxLength 最大文字数。
 * @return {string} 省略後の文字列。
 */
function truncateText(value, maxLength) {
  if (!Number.isInteger(maxLength) || maxLength < 0) {
    throw new Error('maxLength must be a non-negative integer.');
  }

  var normalized = normalizeBlank(value);
  if (normalized === null || normalized.length <= maxLength) {
    return normalized || '';
  }

  var suffix = '...';
  if (maxLength <= suffix.length) {
    return normalized.slice(0, maxLength);
  }

  return normalized.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 日付値をISO 8601文字列へ整形する。
 *
 * @param {(Date|string|number)} value 日付として解釈できる値。
 * @return {string} ISO 8601文字列。
 */
function formatDateToIsoString(value) {
  var date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date value.');
  }

  return date.toISOString();
}

/**
 * 現在日時をISO 8601文字列で返す。
 *
 * @return {string} 現在日時。
 */
function getNowIsoString() {
  return formatDateToIsoString(new Date());
}

/**
 * 問い合わせ管理用の内部ID候補を生成する。
 *
 * @param {(Date|string|number)} receivedAt 受信日時。
 * @param {string} gmailMessageId Gmail Message ID。
 * @return {string} 問い合わせID。
 */
function generateInquiryId(receivedAt, gmailMessageId) {
  var normalizedMessageId = normalizeBlank(gmailMessageId);
  if (normalizedMessageId === null) {
    throw new Error('gmailMessageId is required.');
  }

  var timestamp = formatDateToIsoString(receivedAt)
    .replace(/[-:.TZ]/g, '')
    .slice(0, 14);
  var suffix = normalizedMessageId
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(-8)
    .toUpperCase();

  if (suffix === '') {
    suffix = 'NOID';
  }

  return 'INQ-' + timestamp + '-' + suffix;
}

/**
 * Gmail検索結果を開くURLを生成する。
 *
 * @param {?string} query Gmail検索クエリ。
 * @return {string} Gmail検索URL。
 */
function buildGmailSearchUrl(query) {
  var baseUrl = 'https://mail.google.com/mail/u/0/#search/';
  var normalized = normalizeBlank(query);
  return baseUrl + (normalized === null ? '' : encodeURIComponent(normalized));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    normalizeBlank: normalizeBlank,
    parsePositiveIntegerOrNull: parsePositiveIntegerOrNull,
    truncateText: truncateText,
    formatDateToIsoString: formatDateToIsoString,
    getNowIsoString: getNowIsoString,
    generateInquiryId: generateInquiryId,
    buildGmailSearchUrl: buildGmailSearchUrl
  };
}
