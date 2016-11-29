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
    if (/^nm?g?[0-9]?$/.test(pinyin)) return pinyin;
    // others
    return pinyin.replace(/^[b-df-hj-np-tw-z]]*/, "")
}

/**
 * convert a pinyin(for a single chinese character) to rythme
 * 1 平 2 仄 0 轻声
 * @param pinyin: str
 */
function rythme(pinyin) {
    var py = stripInitial(pinyin);
    var match = py.match(/[0-9]$/);
    if (!match) return [py, 0];
    return [py.slice(0, -1), (function () {
        if (match[0] <= 2) return 1;
        else return 0;
    })()];
}

/**
 * format expect for a sentence
 * rythme: "0123456", standing for ["平","仄","可平可仄","平韵","仄韵","逗号","句号","顿号"]
 * pinyin: [["pin1"], ["duo1", "yin1", "zi4"], ...]
 */

/**
 * comparing if a sentence matches the regular
 * each parameter are imported without ，。、
 * @param rythme
 * @param pinyin
 * @param root 韵脚
 */
function compareSentence(rythme, pinyin, root) {
    var r = 0;
    var regular = [
        function (py) {
            // 0 平

        }
    ];
    var test = function (py, ry) {
        /**
         * py: 单个字的拼音 数组的数组，由rythme生成
         * ry: 格律 数字
         */
        var pass = regular[ry](py, root);

    }
}

// local tests
/** passed
 var py = ["ha1", "ng", "na4", "o2"];
 py.forEach(function (e) {
    console.log(e, rythme(e))
});
 */

var py_totest = [['xie2', 'xia2'],
    ['yue4'],
    ['ban4'],
    ['chuang1'],
    ['huan2', 'hai2'],
    ['shao3', 'shao4'],
    ['shui4']];

var ry_totest = "2120014";

var root_totest = "ui";

console.log(compareSentence(ry_totest, py_totest, root_totest));

// 斜月半窗还少睡 《蝶恋花》晏几道
