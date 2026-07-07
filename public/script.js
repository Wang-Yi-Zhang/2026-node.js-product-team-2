// A1：上傳檔案畫面，可拖曳或選擇檔案上傳


  // 判斷是否成功抓取圖片的函式工具：不管是點擊還是拖曳，拿到檔案後都送來這裡處理
 
  function handleFile(file) {
    if (!file) return;

    // 檢查是不是圖片
    if (file.type.startsWith('image/')) {
      // 成功抓到圖片，跳出提示
      alert(`成功抓到圖片：${file.name} \n可以準備進行壓縮囉！`);
      console.log('目前暫存的檔案物件為：', file);
    } else {
      alert('這好像不是圖片檔案喔，請重新上傳！');
      fileInput.value = ''; // 如果選錯檔案，把隱藏的輸入格清空
    }
  }


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


// A2：（未完成）收到檔案後：設定壓縮品質與輸出格式

// 1. 先抓取 HTML 的元素（DOM 節點）
// 2. 監聽「檔案輸入框」的 change 事件（使用者選好檔案時觸發）
// 【核心步驟】把隱藏的設定區塊顯示出來！
// （選做）如果你想讓畫面更乾淨，也可以順便把原本的上傳框隱藏起來

// A3：（未完成）壓縮完成顯示區域

// A4：（未完成）錯誤顯示，顯示各種錯誤訊息