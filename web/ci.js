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
 * return 韵脚，平仄，原拼音
 */
function rythme(pinyin) {
    var py = stripInitial(pinyin);
    var match = py.match(/[0-9]$/);
    if (!match) return [py, 0, pinyin];
    return [py.slice(0, -1), (function () {
        if (match[0] <= 2) return 1;
        else return 2;
    })(), pinyin];
}

/**
 * a javascript version of sprintf for myself
 * use %s, no support for \%s
 * @param str
 * @param arr
 */
function sprintf(str, arr) {
    var tmp = str.split("%s");
    if (tmp.length != arr.length + 1) throw "internal error: not enough insertion";
    var i = 1, res = tmp[0];
    for (i; i < tmp.length; i++) {
        res += (arr[i - 1] + tmp[i])
    }
    return res
}

function toRythme(num) {
    return ["平", "仄", "可平可仄", "平韵", "仄韵", "逗号", "句号", "顿号"][num];
}

function toTone(num) {
    return ["轻", "平", "仄"][num]
}
/**
 * format expect for a sentence
 * rythme: "0123456", standing for ["平","仄","可平可仄","平韵","仄韵","逗号","句号","顿号"]
 * pinyin: [["pin1"], ["duo1", "yin1", "zi4"], ...]
 */

/**
 * comparing if a sentence matches the regular
 * each parameter are imported without ，。、
 * @param origin 原句
 * @param rythmes
 * @param pinyins
 * @param root 韵脚
 */
function compareSentence(origin, rythmes, pinyins, root) {
    var r = 0;
    var common = function (or, py, condition, err) {
        var tone = 0, root = 0;
        for (r = 0; r < py.length; r++) {
            tone = rythme(py[r])[1];
            root = rythme(py[r])[0];
            if (condition(tone, root)) return {result: true}
        }
        return {
            result: false,
            error: err
        }
    };
    var err_tone = function (tone, or, py) {
        return sprintf("根据本程序之词典库，文字\"%s\"不符合音调，此处应为%s。\n生成的拼音为%s(%s)。\n程序判断仅供参考。", [or, toRythme(tone), py, (function () {
            var res = [], i = 0;
            for (i; i < py.length; i++) {
                res.push(toTone(rythme(py[i])[1]))
            }
            return res
        }())])
    };
    var err_root = function (root, or, py) {
        return sprintf("根据本程序之词典库，文字\"%s\"不符合韵脚，此处应押%s韵。\n生成的拼音为%s(%s)。\n程序判断仅供参考。", [or, root, py, (function () {
            var res = [], i = 0;
            for (i; i < py.length; i++) {
                res.push(rythme(py[i])[0])
            }
            return res
        }())])
    };
    var err_rythme = function (root, or, py) {

    };
    var regular = [
        function (or, py) {
            // 0 平
            return common(or, py, function (tone) {
                return tone === 0 || tone == 1;
            }, err_tone(0, or, py))
        },
        function (or, py) {
            // 1 仄
            return common(or, py, function (tone) {
                return tone === 0 || tone == 2
            }, err_tone(1, or, py))
        },
        function (or, py) {
            // 2 可平可仄
            return {result: true}
        },
        function (or, py, root) {
            // 3 平韵
            var true_tone, true_root;
            return common(or, py, function (tone, r) {
                    true_tone = tone === 0 || tone == 1;
                    true_root = r == root;
                },
                (function () {
                    var res = "";
                    if(!true_tone) res += err_tone(0, or, py);
                    if(!true_root) res += err_root(root, or, py);
                    return res
                })())
        },
        function (or, py, root) {
            // 4 仄韵
            var true_tone, true_root;
            return common(or, py, function (tone, r) {
                    true_tone = tone === 0 || tone == 2;
                    true_root = r == root;
                },
                (function () {
                    var res = "";
                    if(!true_tone) res += err_tone(1, or, py);
                    if(!true_root) res += err_root(root, or, py);
                    return res
                })())
        }
        /*
         return {
         result: true_root && true_tone,
         err: (function () {
         var res = "";
         if(!true_tone) res += err_tone(0, or, py);
         if(!true_root) res += err_root(r, or, py);
         return res
         }())
         }
         */
    ];
    /**
     *
     * @param or 单字，原文
     * @param py 单个字的拼音 数组的数组，由rythme生成
     * @param ry 格律 数字
     */
    var test = function (or, py, ry) {
        var pass = regular[ry](py, root);

    };

    return regular[4]("还", ["hai2", "huan2"], "ie");
}

// local tests
/** test rythme() passed
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

var origin_totest = "斜月半窗还少睡"; //《蝶恋花》晏几道

var res = compareSentence(origin_totest, ry_totest, py_totest, root_totest);
//console.log(res);
if(!res.result) console.log(res.error)

/** test sprintf() passed
 console.log(sprintf("haha%shjgjfg%sdflkdhf", [1,2]));
 */


