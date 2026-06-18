var CONFIG_KEYS = Object.freeze([
  'INQUIRY_SPREADSHEET_ID',
  'INQUIRY_SHEET_NAME',
  'GMAIL_SEARCH_QUERY',
  'PROCESSED_LABEL_NAME',
  'ERROR_LABEL_NAME',
  'MAX_THREADS_PER_RUN'
]);

var CONFIG_UTILS = typeof require !== 'undefined' ? require('./utils') : null;
var DEFAULT_MAX_THREADS_PER_RUN = 10;
var MAX_THREADS_PER_RUN_UPPER_LIMIT = 100;

/**
 * 設定値を空白除去し、未設定値をnullへそろえる。
 *
 * @param {*} value 設定値。
 * @return {?string} 正規化後の設定値。
 */
function normalizeConfigValue(value) {
  var normalizer = CONFIG_UTILS ? CONFIG_UTILS.normalizeBlank : normalizeBlank;
  return normalizer(value);
}

/**
 * 設定値オブジェクトから既知キーだけを取り出して整形する。
 * Apps Scriptサービスへは依存しない。
 *
 * @param {Object} values 設定値オブジェクト。
 * @return {Object} 正規化済み設定。
 */
function buildConfigFromValues(values) {
  var source = values || {};
  var config = {};

  CONFIG_KEYS.forEach(function(key) {
    config[key] = normalizeConfigValue(source[key]);
  });

  config.MAX_THREADS_PER_RUN = CONFIG_UTILS
    ? CONFIG_UTILS.parsePositiveIntegerOrNull(config.MAX_THREADS_PER_RUN)
    : parsePositiveIntegerOrNull(config.MAX_THREADS_PER_RUN);

  return config;
}

/**
 * 1回の実行で処理する最大スレッド数を検証して数値化する。
 *
 * @param {?string} value 設定値。
 * @param {Object=} options defaultValue / maxValue。
 * @return {number} 最大スレッド数。
 */
function parseMaxThreadsPerRun(value, options) {
  var normalized = normalizeConfigValue(value);
  var settings = options || {};
  var defaultValue =
    settings.defaultValue === undefined
      ? DEFAULT_MAX_THREADS_PER_RUN
      : settings.defaultValue;
  var maxValue =
    settings.maxValue === undefined
      ? MAX_THREADS_PER_RUN_UPPER_LIMIT
      : settings.maxValue;

  if (normalized === null) {
    return defaultValue;
  }

  var parsed = Number(normalized);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error('MAX_THREADS_PER_RUN must be a positive integer.');
  }
  if (parsed > maxValue) {
    throw new Error('MAX_THREADS_PER_RUN must be less than or equal to ' + maxValue + '.');
  }

  return parsed;
}

/**
 * 必須設定の不足キーを返す。
 *
 * @param {Object} config 設定値オブジェクト。
 * @param {string[]} requiredKeys 必須キー一覧。
 * @return {string[]} 不足しているキー一覧。
 */
function getMissingRequiredConfigKeys(config, requiredKeys) {
  var source = config || {};
  return (requiredKeys || []).filter(function(key) {
    if (CONFIG_KEYS.indexOf(key) === -1) {
      throw new Error('Unknown config key: ' + key);
    }

    return normalizeConfigValue(source[key]) === null;
  });
}

/**
 * 必須設定の不足があればエラーにする。
 *
 * @param {Object} config 設定値オブジェクト。
 * @param {string[]} requiredKeys 必須キー一覧。
 * @return {boolean} 不足がなければtrue。
 */
function assertRequiredConfigValues(config, requiredKeys) {
  var missingKeys = getMissingRequiredConfigKeys(config, requiredKeys);
  if (missingKeys.length > 0) {
    throw new Error('Required config is not set: ' + missingKeys.join(', '));
  }

  return true;
}

/**
 * Script Propertiesから設定値を取得する。
 * PR1では値の存在確認や秘匿値のログ出力を行わない。
 *
 * @return {Object} 設定キーごとの値。未設定の場合はnull。
 */
function getConfig() {
  var properties = PropertiesService.getScriptProperties();
  var values = {};

  CONFIG_KEYS.forEach(function(key) {
    values[key] = properties.getProperty(key);
  });

  return buildConfigFromValues(values);
}

/**
 * READMEや動作確認で参照できる設定キー一覧を返す。
 * Script Propertiesの値そのものは返さない。
 *
 * @return {string[]} 設定キー一覧。
 */
function getConfigKeys() {
  return CONFIG_KEYS.slice();
}

/**
 * 後続PRで必須設定を読むためのヘルパー。
 *
 * @param {string} key 設定キー。
 * @return {string} 設定値。
 */
function getRequiredConfigValue(key) {
  if (CONFIG_KEYS.indexOf(key) === -1) {
    throw new Error('Unknown config key: ' + key);
  }

  var value = normalizeConfigValue(PropertiesService.getScriptProperties().getProperty(key));
  if (value === null) {
    throw new Error('Required config is not set: ' + key);
  }

  return value;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONFIG_KEYS: CONFIG_KEYS,
    DEFAULT_MAX_THREADS_PER_RUN: DEFAULT_MAX_THREADS_PER_RUN,
    MAX_THREADS_PER_RUN_UPPER_LIMIT: MAX_THREADS_PER_RUN_UPPER_LIMIT,
    normalizeConfigValue: normalizeConfigValue,
    buildConfigFromValues: buildConfigFromValues,
    parseMaxThreadsPerRun: parseMaxThreadsPerRun,
    getMissingRequiredConfigKeys: getMissingRequiredConfigKeys,
    assertRequiredConfigValues: assertRequiredConfigValues,
    getConfigKeys: getConfigKeys
  };
}
