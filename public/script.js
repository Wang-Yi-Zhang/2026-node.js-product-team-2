// A1：上傳檔案畫面，可拖曳或選擇檔案上傳

    // 1. 拿放大鏡找到我們在 HTML 寫好的大框框 (對應 id="dropZone")
    const dropZone = document.getElementById('dropZone');
    // 同時找到那個被隱藏的真實輸入格 (對應 id="fileInput")
    const fileInput = document.getElementById('fileInput');

    // 2. 動作一：當使用者拿著檔案，「滑進」大框框的上方時
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault(); // 【超級關鍵】阻止瀏覽器把圖片直接打開的預設行為！
        
        dropZone.classList.add('dragover'); // 幫大框框「穿上」我們在 CSS 準備好的 dragover 變色衣服
    });

    // 3. 動作二：當使用者拿著檔案，又「滑離開」大框框時
    dropZone.addEventListener('dragleave', function() {
        dropZone.classList.remove('dragover'); // 檔案走了，把變色衣服「脫掉」，恢復原狀
    });

    // 4. 動作三：當使用者在框框上方「放開滑鼠（丟下檔案）」時
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault(); // 再次阻止瀏覽器直接打開圖片的行為
        
        dropZone.classList.remove('dragover'); // 檔案已經丟進來了，任務完成，把變色衣服「脫掉」

        // 5. 抓取真正被丟進來的檔案
        const files = e.dataTransfer.files; // 這行程式碼可以拿到使用者丟進來的所有檔案
        
        handleFile(files[0]);
        }
    );

    // 5. 動作四：監聽點擊選擇，當使用者從電腦選好檔案時
    fileInput.addEventListener('change', function(e) {
        // e.target 代表觸發事件的元件（也就是 fileInput 自己）
        const files = e.target.files; 
        
        if (files.length > 0) {
        // 因為是點擊選檔案，fileInput 已經自己拿到檔案了，直接送去給小工具處理
        handleFile(files[0]);
        }
    });


// A2：設定壓縮品質與輸出格式：預覽 → 選格式/品質 → 壓縮 → 顯示結果 → 下載
  // 先抓取 HTML 的元素（DOM 節點）
  // 監聽「檔案輸入框」的 change 事件（使用者選好檔案時觸發）


// 1. 抓取需要用到的元素
const uploadSection = document.getElementById('upload-section');
const settingsSection = document.getElementById('settings-section');
const previewThumbnail = document.getElementById('previewThumbnail');
const fileNameText = document.getElementById('fileName');
const fileMetaText = document.getElementById('fileMeta');
const formatButtons = document.querySelectorAll('.format-btn');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValueText = document.getElementById('qualityValue');
const compressButton = document.getElementById('compressButton');
const resultCard = document.getElementById('resultCard');
const originalSizeText = document.getElementById('originalSizeText');
const compressedSizeText = document.getElementById('compressedSizeText');
const savedPercentText = document.getElementById('savedPercentText');
const downloadButton = document.getElementById('downloadButton');

// 2. 用變數記住使用者目前的選擇，壓縮的時候會用到
let selectedFile = null;
let selectedFormat = 'webp'; // 要跟 HTML 上預設 active 的按鈕一致
let selectedQuality = 80;    // 要跟 slider 的 value 一致

// 3. 顯示預覽卡片，並且切換到 A2 畫面
function showPreview(file) {
  selectedFile = file;

  const objectUrl = URL.createObjectURL(file); 
  // file 是使用者選的那個檔案，它只是存在瀏覽器記憶體裡，還沒有「網址」。
  // 這行的作用是幫它臨時生一個網址（類似 blob:http://localhost/xxxx-xxxx），這樣 <img> 才有東西可以放。
  previewThumbnail.src = objectUrl;
  fileNameText.textContent = file.name;
  fileMetaText.textContent = (file.size / 1024 / 1024).toFixed(1) + ' MB'; 
  // file.size 是檔案大小，單位是「位元組（bytes）」，所以除以 1024 兩次換算成 MB。.toFixed(1) 是「取到小數點後一位」。

  // 每次選新圖片，都要把上一次的壓縮結果藏起來，重新開始
  resultCard.style.display = 'none';

  // 拖曳區之後要兼作錯誤顯示區，維持一直顯示，不隱藏 uploadSection
  settingsSection.style.display = 'block';
}

// 4. 修改 handleFile：抓到圖片後呼叫 showPreview
function handleFile(file) {
  if (!file) return;

  if (file.type.startsWith('image/')) {
    showPreview(file);
  } else {
    alert('這好像不是圖片檔案喔，請重新上傳！');
    fileInput.value = '';
  }
}

// 5. 輸出格式按鈕：切換 active 樣式 + 記錄選擇
  // 「把 WebP、JPEG、PNG 這三顆按鈕都各自綁上一個點擊事件」
  // 這樣不管使用者點哪一顆，都會觸發對應的邏輯（清掉全部的橘色，再把使用者點的那顆變橘色）。
formatButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    formatButtons.forEach(function (btn) {
      btn.classList.remove('active');
    });
    button.classList.add('active');
    selectedFormat = button.dataset.format;
  });
});

// 6. 壓縮品質滑桿：更新數字 + 記錄選擇
qualitySlider.addEventListener('input', function (e) {
  selectedQuality = e.target.value;
  qualityValueText.textContent = selectedQuality;
});

// 7. （待改：之後要改成 fetch 和後端拿資料）
// 【核心】開始壓縮：用 canvas 把圖片畫出來，再輸出成指定格式/品質
compressButton.addEventListener('click', function () {
  if (!selectedFile) return;

  const img = new Image();
  img.onload = function () {
    // 7-1. 建立一張跟原圖一樣大小的畫布
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    // 7-2. 把圖片畫到畫布上
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // 7-3. 把畫布輸出成圖片檔案（Blob）
    //     注意：PNG 是無失真格式，不支援「品質」這個參數，所以只有 webp/jpeg 會吃 quality
    const mimeType = 'image/' + selectedFormat;
    const quality = selectedQuality / 100; // toBlob 吃的是 0~1 之間的小數

    canvas.toBlob(function (blob) {
      showResult(blob);
    }, mimeType, quality);
  };
  img.src = URL.createObjectURL(selectedFile);
});

// A3：壓縮完成顯示區域
// 顯示壓縮結果：原始大小 / 壓縮後大小 / 節省百分比 + 設定下載連結
function showResult(blob) {
  const originalSize = selectedFile.size;
  const compressedSize = blob.size;
  const savedPercent = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

  originalSizeText.textContent = (originalSize / 1024 / 1024).toFixed(2) + ' MB';
  compressedSizeText.textContent = (compressedSize / 1024 / 1024).toFixed(2) + ' MB';
  savedPercentText.textContent = savedPercent + '%';

  // 把壓縮後的檔案包成一個下載網址，塞進下載按鈕
  const downloadUrl = URL.createObjectURL(blob);
  downloadButton.href = downloadUrl;
  downloadButton.download = 'compressed.' + selectedFormat;

  resultCard.style.display = 'block';
}



// A4：（未完成）錯誤顯示，顯示各種錯誤訊息