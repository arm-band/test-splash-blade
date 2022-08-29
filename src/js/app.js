/**
 * validatePhotoURL
 *
 * @param {string} url
 * @returns {string} error message (return empty string when validate is true.)
 */
const validatePhotoURL = (url) => {
    const validURLPrefix = 'https://unsplash.com/photos/';
    const regexp = new RegExp(/^[\w\d\-\_]+$/);
    if(url.length === undefined || url.length === 0) {
        return 'URL が空です。';
    }
    if(url.indexOf(validURLPrefix) === -1 || url.indexOf(validURLPrefix) > 0) {
        return 'URL が不正です。正しい URL (`https://unsplash.com/photos/XXXXXXXXXXX`) を入力してください。';
    }
    const pictureID = url.replace(validURLPrefix, '');
    if(pictureID.slice(-1) === '/' || !regexp.test(pictureID)) {
        return '画像IDが不正です。また、末尾はスラッシュで終わらないようにしてください。';
    }
    return '';
};
/**
 * validateWH
 *
 * @param {string} width
 * @param {string} height
 * @returns {string} error message (return empty string when validate is true.)
 */
 const validateWH = (width, height) => {
    const regexp = new RegExp(/^[\d]+$/);
    if(
        (width.length === undefined || width.length === 0)
        && (height.length === undefined || height.length === 0)
    ) {
        // 両方とも空文字列ならば問題なし
        return '';
    }
    if (
        width.length > 0 && height.length === 0
        || width.length === 0 && height.length > 0
    ) {
        // どちらか片方しか入力していない場合はエラー
        return '幅・高さは両方とも入力してください。';
    }
    if(!regexp.test(width) || !regexp.test(height)) {
        // 数字であることをチェック
        return '幅・高さ のどちらか、または両方が不正です。数字で入力してください。';
    }
    return '';
};

/**
 * htmlspecialchars
 *
 * @param {string} txt
 * @returns {string} html special characters escaped text
 */
const htmlspecialchars = (txt) => {
    if(typeof txt !== 'string'){
      return txt;
    }
    return txt.replace(
      /[&'`"<>]/g,
      function(match) {
        return {
          '&': '&amp;',
          "'": '&#x27;',
          '`': '&#x60;',
          '"': '&quot;',
          '<': '&lt;',
          '>': '&gt;',
        }[match]
      }
    );
  }

/**
 * generateAPIURL
 *
 * @param {string} url
 * @param {string} width
 * @param {string} height
 * @returns {string} error message (return empty string when validate is true.)
 */
 const generateAPIURL = (url, width, height) => {
    const validURLPrefix = 'https://unsplash.com/photos/';
    const apiURLPrefix = 'https://source.unsplash.com/';
    const pictureID = url.replace(validURLPrefix, '');
    let apiURL = `${apiURLPrefix}${pictureID}`;
    if(
        (width.length === undefined || width.length === 0)
        && (height.length === undefined || height.length === 0)
    ) {
        return apiURL;
    }

    return `${apiURL}/${width}x${height}`;
};

/**
 * clipboardCopy
 *
 * @param {string} url
 * @returns {boolean}
 */
 const clipboardCopy = (url) => {
    navigator.clipboard.writeText(url);
    return true;
};

window.addEventListener('load', () => {
    // https://unsplash.com/photos/
    const $generateButton = document.querySelector('#generate');

    $generateButton.addEventListener('click', () => {
        // ボタンがクリックされたら
        const $photoURL = document.querySelector('#photo-url');
        const $width = document.querySelector('#width');
        const $height = document.querySelector('#height');
        // 値取得
        const photoURL = $photoURL.value;
        const validatedResultPhotoURL = validatePhotoURL(photoURL);
        if(validatedResultPhotoURL.length > 0) {
            // バリデーション & アラート
            alert(validatedResultPhotoURL);
            return false;
        }
        const width = $width.value;
        const height = $height.value;
        const validateResultWH = validateWH(width, height);
        if(validateResultWH.length > 0) {
            // バリデーション & アラート
            alert(validateResultWH);
            return false;
        }
        const apiURL = htmlspecialchars(generateAPIURL(photoURL, width, height));
        const $apiURL = document.querySelector('#api-url');
        $apiURL.value = apiURL;
    });
    $generateButton.addEventListener('click', () => {
        const $apiURL = document.querySelector('#api-url');
        const apiURL = $apiURL.value;
        return clipboardCopy(apiURL);
    });
});
