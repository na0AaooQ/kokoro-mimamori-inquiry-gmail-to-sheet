var INQUIRY_TRIGGER_HANDLER = 'processInquiryMessages';

/**
 * 後続PRで作成する時間主導型トリガーの方針を返す。
 * PR1では実際のトリガー作成は行わない。
 *
 * @return {Object} トリガー実装方針。
 */
function getTriggerPlan() {
  return {
    handlerFunction: INQUIRY_TRIGGER_HANDLER,
    intervalMinutes: 10,
    implemented: false
  };
}

/**
 * PR3以降で10分おきトリガー作成処理を実装する予定。
 */
function createTimeTrigger() {
  throw new Error('createTimeTrigger is not implemented in PR1.');
}

/**
 * PR3以降で時間主導型トリガー削除処理を実装する予定。
 */
function deleteTimeTriggers() {
  throw new Error('deleteTimeTriggers is not implemented in PR1.');
}
