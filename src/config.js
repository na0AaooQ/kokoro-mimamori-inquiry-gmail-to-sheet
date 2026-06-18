var CONFIG_KEYS = Object.freeze([
  'INQUIRY_SPREADSHEET_ID',
  'INQUIRY_SHEET_NAME',
  'GMAIL_SEARCH_QUERY',
  'PROCESSED_LABEL_NAME',
  'ERROR_LABEL_NAME',
  'MAX_THREADS_PER_RUN'
]);

/**
 * Script Propertiesから設定値を取得する。
 * PR1では値の存在確認や秘匿値のログ出力を行わない。
 *
 * @return {Object} 設定キーごとの値。未設定の場合はnull。
 */
function getConfig() {
  var properties = PropertiesService.getScriptProperties();
  var config = {};

  CONFIG_KEYS.forEach(function(key) {
    config[key] = normalizeBlank(properties.getProperty(key));
  });

  config.MAX_THREADS_PER_RUN = parsePositiveIntegerOrNull(config.MAX_THREADS_PER_RUN);

  return config;
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

  var value = normalizeBlank(PropertiesService.getScriptProperties().getProperty(key));
  if (value === null) {
    throw new Error('Required config is not set: ' + key);
  }

  return value;
}
