/**
 * Apps Script editorから手動実行して、PR1の初期構成を確認する。
 * 問い合わせ本文、メールアドレス、シートIDなどの機微情報は返さない。
 *
 * @return {Object} プロジェクトの疎通確認情報。
 */
function healthCheck() {
  return {
    status: 'ok',
    project: 'kokoro-mimamori-inquiry-gmail-to-sheet',
    phase: 'PR1',
    timestamp: getNowIsoString()
  };
}

/**
 * GASプロジェクトの概要を返す。
 * Script Propertiesの値そのものは返さない。
 *
 * @return {Object} プロジェクト概要。
 */
function getProjectInfo() {
  return {
    name: 'kokoro-mimamori-inquiry-gmail-to-sheet',
    service: 'kokoro-mimamori',
    phase: 'PR1',
    implemented: {
      gmailSearch: false,
      sheetAppend: false,
      autoReply: false,
      timeTrigger: false
    },
    configKeys: getConfigKeys()
  };
}
