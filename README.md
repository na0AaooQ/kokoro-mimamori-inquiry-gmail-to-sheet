# kokoro-mimamori-inquiry-gmail-to-sheet

「こころみまもり」宛のGmail問い合わせを、将来的にGoogleスプレッドシートへ自動記録するためのGoogle Apps Script（GAS）をclaspで管理するリポジトリです。

## PR1の目的

PR1では、Gmail本文取得、スプレッドシートへの問い合わせ記録、自動返信は実装しません。
clasp / GAS の初期構成、設定管理方針、README整備までを対象にします。

## 運用方針

- 開発・単体テストは、元々のGoogleアカウント `naohisa.aoki@gmail.com` 側の開発用シートを使います。
- 本番運用は、後続フェーズで事業問い合わせ受付用 Google アカウント `na0aaooq@gmail.com` 側の本番用シートへ切り替えます。
- 本番スプレッドシートID、問い合わせ本文、送信者名、メールアドレス、Reply-To、Gmail raw bodyなどはGitへコミットしません。
- 問い合わせ本文やメールアドレスなどの個人情報は、`console.log` / `Logger.log` 等へ出力しません。
- `.clasp.json` / `.clasprc.json` / `.env` / `.env.*` はGit管理外とします。
- `.clasp.json` はローカルのclasp接続情報として扱い、コミットしません。

## 設定管理

設定値はGASのScript Propertiesで管理します。PR1では、開発用シートIDも本番用シートIDもコードへ直書きしません。

想定するScript Properties:

| Key | 用途 |
| --- | --- |
| `INQUIRY_SPREADSHEET_ID` | 問い合わせ管理シートのスプレッドシートID |
| `INQUIRY_SHEET_NAME` | 問い合わせ管理シート内の対象シート名 |
| `GMAIL_SEARCH_QUERY` | 後続PRで使用するGmail検索クエリ |
| `PROCESSED_LABEL_NAME` | 後続PRで使用する処理済みラベル名 |
| `ERROR_LABEL_NAME` | 後続PRで使用するエラーラベル名 |
| `MAX_THREADS_PER_RUN` | 1回の実行で処理する最大スレッド数 |

## 問い合わせ管理シートの列構成

後続PRでは、問い合わせ管理シートの以下の列へ追記できるように実装します。

| 列名 |
| --- |
| No |
| 受信日時 |
| 記録日時 |
| 問い合わせID |
| Gmail Message ID |
| Gmail Thread ID |
| 送信者名 |
| 送信者メールアドレス |
| Reply-To |
| 件名 |
| 本文抜粋 |
| 本文全文 |
| 推定流入元 |
| 問い合わせ種別 |
| 優先度 |
| 対応状況 |
| 返信要否 |
| 一次返信済み |
| 備考 |
| Gmailリンク |

PR1では、この列への書き込み処理は未実装です。

## claspコマンド

```bash
npm run status
npm run push
npm run pull
npm run open
```

`npm run push` を実行する前に、`.clasp.json` の有無、接続先アカウント、接続先GASプロジェクト、対象シートを確認してください。

開発用GASプロジェクトは、開発用の「お問い合わせ記録用GAS登録シート」に紐づける想定です。

## 実装済み

- `appsscript.json` にGASの初期設定を追加
- `src/main.js` に手動実行用の `healthCheck()` / `getProjectInfo()` を追加
- `src/config.js` にScript Propertiesから設定値を読む土台を追加
- `src/trigger.js` に時間主導型トリガー実装方針の土台を追加
- `src/utils.js` にPR1用の小さな共通関数を追加
- `package.json` にclasp操作用scriptsを追加

## PR1で未実装の内容

- Gmailから新着問い合わせメールを検索する本処理
- Gmail本文を取得して解析する処理
- Googleスプレッドシートへ問い合わせ内容を追記する処理
- Gmailラベルを付与する処理
- 10分おき時間主導型トリガーの本番作成
- 自動返信メール送信
- Gmail下書き作成
- 添付ファイル保存
- 外部AI判定
- 外部API連携

## 後続PR予定

- PR2: Gmail新着問い合わせを検索し、未記録メールだけを問い合わせ管理シートへ追記するMVP実装
- PR3: Gmail Message IDによる重複防止、処理済みラベル付与、エラーラベル付与、10分おきトリガー作成
- PR4: READMEや運用手順、開発用から本番用への切り替え手順、安全面の運用メモ整備

将来的には、問い合わせ種別の読み取りや一次受付メールの下書き作成、条件付き自動返信を検討します。自動返信は慎重に段階導入し、最初から完全自動送信にはしません。
