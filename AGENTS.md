# AGENTS.md

このリポジトリで作業するAIコーディングエージェント向けの開発・安全方針です。

## 目的

このリポジトリは、「こころみまもり」宛のGmail問い合わせを、将来的にGoogleスプレッドシートへ自動記録するGoogle Apps Script（GAS）をclaspで管理するためのものです。

## プロジェクト概要

- Google Apps Script V8ランタイムで動く問い合わせ管理用スクリプトを管理します。
- Gmail新着問い合わせの検索、未記録メールのシート追記、処理済み管理を段階的に実装します。
- 本リポジトリには問い合わせ本文、メールアドレス、Reply-To、Gmail raw body、シートIDなどの機微情報を含めません。
- 自動返信、Gmail送信、添付ファイル保存、外部API連携、外部AI判定は慎重に段階導入します。

## Google Apps Script / clasp 管理方針

- GASのソースは `src/` 配下で管理します。
- `appsscript.json` はGASプロジェクト設定としてGit管理します。
- `.clasp.json` と `.clasprc.json` はローカル接続情報として扱い、Git管理しません。
- `clasp push` 実行前に、接続先アカウント、接続先GASプロジェクト、対象シートを必ず確認します。
- PR2着手前準備では、原則として `clasp push` やGAS側操作は行いません。

## アカウントとシートの扱い

- 開発・単体テストは、開発用Googleアカウント側の開発用シートを使う方針です。
- 本番運用は、後続フェーズで事業問い合わせ受付用Googleアカウント側の本番用シートへ切り替える方針です。
- 開発用シート:
  - `07_001_こころみまもり_お問い合わせ記録用GAS登録シート_開発用シート`
  - `07_002_こころみまもり_お問い合わせ管理シート_開発用シート`
- 本番用シート:
  - `07_001_こころみまもり_お問い合わせ記録用GAS登録シート_本番シート`
  - `07_002_こころみまもり_お問い合わせ管理シート_本番シート`
- 本番スプレッドシートIDは、コード、README、テスト、コミットメッセージ、PR本文へ安易に記載しません。
- 開発用シートIDも原則としてコードへ直書きせず、Script Propertiesまたはローカル運用メモで管理します。

## 設定管理

- 設定値はGASのScript Propertiesで管理します。
- 想定キーは `INQUIRY_SPREADSHEET_ID`, `INQUIRY_SHEET_NAME`, `GMAIL_SEARCH_QUERY`, `PROCESSED_LABEL_NAME`, `ERROR_LABEL_NAME`, `MAX_THREADS_PER_RUN` です。
- 本番シートIDや運用上の秘密情報をコードへ直書きしません。
- Script Propertiesの値そのものをログやテスト出力へ出しません。

## 個人情報・ログ安全方針

- 問い合わせ本文をGitにコミットしません。
- 送信者メールアドレスをGitにコミットしません。
- Reply-ToをGitにコミットしません。
- Gmail raw bodyをGitにコミットしません。
- 実在の問い合わせ本文や実在のメールアドレスをテストコードに含めません。
- Logger.log / console.log に問い合わせ本文全文、メールアドレス、Reply-To、Gmail raw body、Gmail raw responseを出しません。
- ログに出す場合は、件数、処理結果、設定キー名など、機微情報を含まない情報に限定します。

## Git管理してはいけないもの

- `.clasp.json`
- `.clasprc.json`
- `.env`
- `.env.*`
- `local/`
- `tmp/`
- 問い合わせ本文やGmail raw bodyを含むファイル
- 実在の送信者名、メールアドレス、Reply-Toを含むファイル
- 本番スプレッドシートIDや運用上の秘密情報を含むファイル

## Apps Script V8 と Node.js の違い

- GAS本体コードでは `import` / `export` / `require` を使いません。
- GAS側で動くグローバル関数形式を維持します。
- Node.js / Jestでテストしたい純粋関数だけ、`if (typeof module !== 'undefined' && module.exports) { ... }` のconditional exportsを使います。
- Apps Script実行環境で `module` が未定義でもエラーにならない形にします。
- GmailApp / SpreadsheetApp / PropertiesService などのGAS組み込みサービスへ直接依存する処理は、後続PRで薄いラッパーへ分離します。

## テスト方針

- ローカル単体テストはNode.js / Jestで実行します。
- テスト対象は、GASサービスに依存しない純粋関数を中心にします。
- GmailApp / SpreadsheetApp / PropertiesService を直接呼ぶテストは書きません。
- テストデータに問い合わせ本文、実在メールアドレス、Reply-To、本番シートIDを含めません。
- 構文確認には `npm run check:syntax` を使います。
- 単体テストには `npm test` を使います。

## PRを小さく分ける方針

- 1つのPRでは目的を絞り、Gmail取得、Sheets追記、ラベル付与、トリガー作成、自動返信を一度に混ぜません。
- 安全面に影響する変更は、挙動と未実装範囲をREADMEまたはPR本文に明記します。
- 実Gmailや実スプレッドシートへアクセスする処理は、接続先確認とレビューを挟んでから進めます。

## PR1で実装済み

- `appsscript.json` の初期設定
- `src/main.js` の `healthCheck()` / `getProjectInfo()`
- `src/config.js` のScript Propertiesから設定値を読む土台
- `src/trigger.js` の時間主導型トリガー方針
- `src/utils.js` の初期ユーティリティ
- `package.json` のclasp操作用scripts
- READMEの初期セットアップ、運用方針、安全方針、未実装範囲、後続PR予定

## 今後のPR予定

- PR2: Gmail新着問い合わせを検索し、未記録メールだけを問い合わせ管理シートへ追記するMVP実装
- PR3: Gmail Message IDによる重複防止、処理済みラベル付与、エラーラベル付与、10分おきトリガー作成
- PR4: READMEや運用手順、開発用から本番用への切り替え手順、安全面の運用メモ整備
- 将来的な拡張: 問い合わせ種別の読み取り、一次受付メールの下書き作成、条件付き自動返信の検討

## 禁止事項

- 自動返信を勝手に実装しません。
- Gmail送信処理を勝手に追加しません。
- Gmail下書き作成処理を勝手に追加しません。
- 添付ファイル保存処理を勝手に追加しません。
- 外部API連携や外部AI判定を勝手に追加しません。
- Gmailから新着問い合わせメールを検索する本処理を、準備PRへ混ぜません。
- Gmail本文取得や本文解析を、準備PRへ混ぜません。
- Googleスプレッドシートへの問い合わせ追記処理を、準備PRへ混ぜません。
- 10分おき時間主導型トリガーの本番作成を、準備PRへ混ぜません。
- 実Gmailや実スプレッドシートにアクセスするテストを書きません。
