// kamus teks bahasa Jepang (日本語) buat seluruh tampilan PhotoPip
// dimuat lewat LanguageProvider kalau user pilih bahasa Jepang
import type { Messages } from "../types";

export const ja: Messages = {
  // label dasar aplikasi dan status proses
  app: {
    studio: "フォトスタジオ",
    language: "言語",
    skip: "スタジオへ",
    light: "ライトモード",
    dark: "ダークモード",
    processing: "処理中…",
    photoComplete: "撮れました！",
    downloadStarted: "ダウンロードを開始しました。",
    dismiss: "閉じる",
  },
  // status kamera dan kontrol jepret otomatis
  camera: {
    label: "カメラ",
    off: "カメラはオフ",
    requesting: "カメラの許可を待っています…",
    ready: "カメラ準備完了",
    enable: "カメラをオンにする",
    cancel: "キャンセル",
    retry: "もう一度",
    mirror: "カメラと写真を左右反転",
    timer: "カウントダウン",
    noDelay: "カウントダウンなし",
    auto: "自動撮影（5秒間隔）",
  },
  // teks halaman studio fase 1
  capture: {
    layoutLabel: "レイアウト",
    chooseLayout: "レイアウトを選ぶ",
    photosLabel: "写真",
    optionsLabel: "オプション",
    progress: "写真",
    review: "フォトストリップを編集",
    reset: "新しい撮影",
    retake: "撮り直す",
    takePhoto: "写真を撮る",
    cameraOff: "カメラはまだオフです",
    cameraOffNote: "オンにすると始められます。写真をアップロードしてもOK。",
    stepsTitle: "使い方",
    steps: ["レイアウトを選ぶ", "撮影かアップロード", "飾ってダウンロード"],
    previewTitle: "あなたのフォトストリップ",
    upload: "写真をアップロード",
    uploading: "アップロード中…",
    photo: "枚",
    photos: "枚",
    readyToEdit: "編集できます",
    resetTitle: "最初からやり直す？",
    resetBody:
      "このセッションの写真はすべて消えます。残したいときは先にストリップをダウンロードしてね。",
  },
  // label fitur dan panel pengaturan di halaman editor
  editor: {
    title: "ストリップを編集",
    subtitle: "好きに仕上げて、印刷できる形でダウンロード。",
    back: "戻る",
    undo: "元に戻す",
    redo: "やり直す",
    zoomIn: "拡大",
    zoomOut: "縮小",
    fit: "画面に合わせる",
    tabs: {
      frame: "フレーム",
      photo: "写真",
      sticker: "ステッカー",
      text: "テキスト",
      properties: "プロパティ",
    },
    framePresets: "フレームのスタイル",
    frameHint: "フォトストリップのフレームスタイルを選んでください。",
    surprise: "ランダム",
    filters: "写真フィルター",
    photoLabel: "写真",
    retakePhoto: "この写真を撮り直す",
    allCategories: "すべて",
    duplicate: "複製",
    bringFront: "最前面へ",
    sendBack: "最背面へ",
    flipX: "左右反転",
    flipY: "上下反転",
    opacity: "透明度",
    addText: "テキストを追加",
    defaultCaption: "ここに入力",
    textContent: "キャプション",
    textPlaceholder: "名前、日付、メッセージなど",
    font: "フォント",
    color: "色",
    align: "配置",
    alignLeft: "左",
    alignCenter: "中央",
    alignRight: "右",
    bold: "太字",
    italic: "斜体",
    noSelection:
      "ストリップ上のステッカーやテキストをタップすると、ここに設定が出ます。",
    position: "位置",
    layer: "レイヤー",
    deleteSelection: "削除",
    textEmpty: "名前や日付を入れると、ぐっと自分らしくなります。",
    stickers: "ステッカー",
    clearStickers: "ステッカーを消す",
    search: "ステッカーを検索",
    searchEmpty: "この検索に合うステッカーはありません。",
    clearSearch: "検索をクリア",
    uploadSticker: "ステッカーをアップロード",
    horizontal: "横位置",
    vertical: "縦位置",
    size: "サイズ",
    rotation: "回転",
    remove: "削除",
    filterNames: {
      none: "オリジナル",
      bw: "モノクロ",
      warm: "暖色",
      cool: "寒色",
      vintage: "ヴィンテージ",
      fade: "フェード",
    },
  },
  // teks bar download hasil
  export: {
    format: "ファイル形式",
    download: "ストリップをダウンロード",
  },
  // pesan error kamera, upload, dan ekspor
  errors: {
    camera: {
      denied:
        "カメラの許可がブロックされています。ブラウザのサイト設定で許可して、もう一度試してください。",
      missing: "カメラが見つかりません。接続してからもう一度試してください。",
      busy: "別のアプリがカメラを使っています。閉じてからもう一度試してください。",
      unavailable:
        "ここではカメラを使えません。対応ブラウザでHTTPSのページを開いてください。",
      readiness:
        "カメラから映像が届いていません。カメラを確認して、もう一度試してください。",
      capture:
        "撮影できませんでした。カメラをオンにし直して、もう一度試してください。",
    },
    upload:
      "写真をアップロードできませんでした。別の画像を選んで、もう一度試してください。",
    export:
      "ストリップをダウンロードできませんでした。編集内容は残っています。もう一度試してください。",
  },
  // nama 5 template layout
  layoutNames: {
    "4x1": "クラシックストリップ",
    "3x1": "3枚ストリップ",
    "2x3": "2 × 3グリッド",
    "2x2": "正方形グリッド",
    "1x1": "1枚写真",
  },
};
