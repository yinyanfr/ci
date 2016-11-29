/**
 * Created by yan on 16/11/29.
 */

//TODO data transfer

// data analysation and manipulation

/**
 * Checking if a pinyin is correct in its format
 * a pinyin correct for this program is as "pin1", or light tone without the number at last
 * Important: this only works in mode Contemporary Chinese Putonghua 现代汉语普通话
 * 由于资料来源所限，暂无含有入声的古韵集可用
 * @param pinyin: str
 */
function checkPinyin(pinyin) {
    // first position for now : weak check
    var regex = /^[a-z]+[0-9]?$/;
    return regex.test(pinyin)
}

/**
 * 去掉拼音的声母
 * 重要：v是一个韵母
 * @param pinyin: str
 */
function stripInitial(pinyin) {
    // for 嗯 哼
    if(/^nm?g?[0-9]?$/.test(pinyin)) return pinyin;
    // others
    return pinyin.replace(/^[b-df-hj-np-tw-z]]*/,"")
}

/**
 * convert a pinyin(for a single chinese character) to rythme
 * 1 平 2 仄 0 轻声
 * @param pinyin: str
 */
function rythme(pinyin) {
    var py = stripInitial(pinyin);
    var match = py.match(/[0-9]$/);
    if(!match) return 0;
    if(match[0] <= 2) return 1;
    else return 2;
}


// local tests
/** passed
var py = ["ha1", "ng", "na4", "o2"];
py.forEach(function (e) {
    console.log(e, rythme(e))
});
*/
