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
    if (!checkPinyin(pinyin)) throw "error: pinyin in wrong format";
    // for 嗯 哼
    if (/^nm?g?[0-9]?$/.test(pinyin)) return pinyin;
    // others
    //console.log(pinyin)
    return pinyin.replace(/^[b-df-hj-np-tw-z]*/, "")
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

var trans = {
    symbol: ["○", "●", "◎", "⊙", "△", "▲", "，", "。", "、", "『", "』", "〖", "〗"],
    rythme: ["平", "仄", "本平可仄", "本仄可平", "平韵", "仄韵", "，", "。", "、", "『", "』", "〖", "〗"],
    tone: ["轻", "平", "仄"]
};

function toRythme(num) {
    return trans.rythme[num];
}

function toTone(num) {
    return trans.tone[num]
}
/**
 * format expect for a sentence
 * rythme: "0123456...", standing for ["平","仄","可平可仄","平韵","仄韵","逗号","句号","顿号" ... ]
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
        var truth = {
            true_tone: false,
            true_root: false
        };
        for (r = 0; r < py.length; r++) {
            tone = rythme(py[r])[1];
            root = rythme(py[r])[0];
            if (condition(tone, root, truth)) return {result: true}
        }
        return {
            result: false,
            error: err(truth)
        }
    };
    var err_tone = function (tone, or, py) {
        return sprintf("根据本程序之词典库，文字\"%s\"不符合音调，此处应为%s。\n生成的拼音为%s(%s)。\n程序判断仅供参考。\n", [or, toRythme(tone), py, (function () {
            var res = [], i = 0;
            for (i; i < py.length; i++) {
                res.push(toTone(rythme(py[i])[1]))
            }
            return res
        }())])
    };
    var err_root = function (root, or, py) {
        return sprintf("根据本程序之词典库，文字\"%s\"不符合韵脚，此处应押%s韵。\n生成的拼音为%s(%s)。\n程序判断仅供参考。\n", [or, root, py, (function () {
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
            }, function () {
                return err_tone(1, or, py)
            })
        },
        function (or, py) {
            // 1 仄
            return common(or, py, function (tone) {
                return tone === 0 || tone == 2
            }, function () {
                return err_tone(1, or, py)
            })
        },
        function (or, py) {
            // 2， 3 可平可仄
            return {result: true}
        },
        function (or, py) {
            // 2， 3 可平可仄
            return {result: true}
        },
        function (or, py, root) {
            // 4 平韵

            return common(or, py, function (tone, r, truth) {
                    truth.true_tone = tone === 0 || tone == 1;
                    truth.true_root = r == root;
                    return truth.true_root && truth.true_tone
                },
                function (truth) {
                    var res = "";
                    if (!truth.true_tone) res += err_tone(0, or, py);
                    if (!truth.true_root) res += err_root(root, or, py);
                    return res
                })
        },
        function (or, py, root) {
            // 5 仄韵
            return common(or, py, function (tone, r, truth) {
                    truth.true_tone = tone === 0 || tone == 2;
                    truth.true_root = r == root;
                    return truth.true_root && truth.true_tone
                },
                function (truth) {
                    var res = "";
                    if (!truth.true_tone) res += err_tone(1, or, py);
                    if (!truth.true_root) res += err_root(root, or, py);
                    return res
                })
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
        return regular[ry](or, py, root);
    };

    var res = [], i = 0;
    for (i; i < rythmes.length; i++) {
        res[i] = test(origin[i], pinyins[i], rythmes[i])
    }

    return res;
}

function analyse(res) {
    var i = 0;
    var correct = true;
    for (i; i < res.length; i++) {
        if (!res[i].result) {
            console.log(res[i].error);
            correct = false
        }
    }
    if (correct)
        console.log("根据本程序之词典库，这个句子是符合格律的，\n程序判断仅供参考。")
}

// ui

function in_array(e, arr) {
    var i = 0;
    for (i; i < arr.length; i++) {
        if (e === arr[i]) return true
    }
    return false
}

var EXCEPTION = {
    NullPointerException: "Internal error: %s index out of range"
};

function error(exception, detail) {
    if (Array.isArray(detail)) return sprintf(exception, detail);
    return sprintf(exception, [detail])
}


/**
 * 解读服务器端输出的格律标记
 * @param arr
 */
function readSequence(arr) {
    var res = {}, i = 0;
    // display
    res.display = [];
    var char = '', tmp = "", num = -1;
    // partition
    res.part = [];
    for (i = 0; i < arr.length; i++) {
        num = arr[i];
        if (num >= trans.rythme.length) throw error(EXCEPTION.NullPointerException, "rythme " + num);
        char = trans.rythme[num];
        res.display.push(char);
        if (num < 6) {
            tmp += num
        }
        if (num >= 6 && num <= 8) {
            res.part.push(tmp);
            tmp = ""
        }
    }
    return res
}

/**
 *
 * @param or_arr
 * @param ry_arr
 * @param py_arr
 * @param root
 */
function compareSequence(or_arr, ry_arr, py_arr, root) {
    console.log(sprintf("输入文本：%s，\n测试韵律：浣溪沙 格律如下\n %s\n韵集：%s", [or_arr, (function (l) {
        var res = "", i = 0;
        for (i; i < l.length; i++) {
            if (in_array(l[i], ["，", "。", "、"])) res += "\n";
            else res += (l[i] + " ");
        }
        return res
    }(readSequence(ry_arr).display)), "普通话"]));
    var sequence = readSequence(ry_arr).part;
    //console.log(sequence)
    var len = sequence.length, i = 0, res;
    for (i; i < len; i++) {
        res = compareSentence(or_arr[i], sequence[i], py_arr[i], root);
        //console.log(res)
        analyse(res)
    }
}


// local tests
/** test rythme() passed
 var py = ["ha1", "ng", "na4", "o2"];
 py.forEach(function (e) {
    console.log(e, rythme(e))
});
 */

/** test compareSentence() passed */
/** test compareSequence() passed
 var py_totest = [ [ [ 'yi1' ],
 [ 'qu1', 'qu3' ],
 [ 'xin1' ],
 [ 'ci2' ],
 [ 'jiu3' ],
 [ 'yi1' ],
 [ 'bei1' ] ],
 [ [ 'qu4' ],
 [ 'nian2' ],
 [ 'tian1' ],
 [ 'qi4' ],
 [ 'jiu4' ],
 [ 'ting2' ],
 [ 'tai2', 'tai1' ] ],
 [ [ 'xi1' ],
 [ 'yang2' ],
 [ 'xi1' ],
 [ 'xia4' ],
 [ 'ji3' ],
 [ 'shi2' ],
 [ 'hui2' ] ],
 [ [ 'wu2' ],
 [ 'ke3' ],
 [ 'nai4' ],
 [ 'he2' ],
 [ 'hua1' ],
 [ 'la4', 'luo4', 'lao4' ],
 [ 'qu4' ] ],
 [ [ 'si4' ],
 [ 'ceng2' ],
 [ 'xiang1' ],
 [ 'shi2' ],
 [ 'yan4', 'yan1' ],
 [ 'gui1' ],
 [ 'lai2' ] ],
 [ [ 'xiao3' ],
 [ 'yuan2' ],
 [ 'xiang1' ],
 [ 'jing4' ],
 [ 'du2' ],
 [ 'pai2' ],
 [ 'huai2' ] ] ];

 var py_totest2 = [ [ [ 'jian1', 'jian4' ],
 [ 'guan1' ],
 [ 'ying1' ],
 [ 'yu3' ],
 [ 'hua1' ],
 [ 'di3', 'de' ],
 [ 'hua2' ] ],
 [ [ 'you1' ],
 [ 'ye4' ],
 [ 'quan2' ],
 [ 'liu2' ],
 [ 'bing1' ],
 [ 'xia4' ],
 [ 'nan2', 'nan4', 'nuo2' ] ],
 [ [ 'bing1' ],
 [ 'quan2' ],
 [ 'leng3' ],
 [ 'se4' ],
 [ 'xian2' ],
 [ 'ning2' ],
 [ 'jue2' ] ],
 [ [ 'ning2' ],
 [ 'jue2' ],
 [ 'bu4', 'fou3' ],
 [ 'tong1' ],
 [ 'sheng1' ],
 [ 'zan4' ],
 [ 'xie1' ] ],
 [ [ 'bie2', 'bie4' ],
 [ 'you3', 'you4' ],
 [ 'you1' ],
 [ 'chou2' ],
 [ 'an4' ],
 [ 'hen4' ],
 [ 'sheng1' ] ],
 [ [ 'ci3' ],
 [ 'shi2' ],
 [ 'wu2' ],
 [ 'sheng1' ],
 [ 'sheng4' ],
 [ 'you3', 'you4' ],
 [ 'sheng1' ] ] ];

 var ry_totest = [3,1,3,0,3,1,4,6,3,0,3,1,1,0,4,7,9,3,0,3,1,1,0,4,6,3,1,3,0,0,1,1,10,7,3,0,3,1,1,0,4,6,3,0,3,1,1,0,4,7];

 var root_totest = "ai";

 var origin_totest = ["一曲新词酒一杯", "去年天气旧亭台", "夕阳西下几时回",
 "无可奈何花落去", "似曾相识燕归来", "小园香径独徘徊"]; //《浣溪沙》 晏殊

 var origin_totest2 = ["间关莺语花底滑", "幽咽泉流冰下难",
 "冰泉冷涩弦凝绝", "凝绝不通声暂歇",
 "别有幽愁暗恨生", "此时无声胜有声"]; // 《琵琶行》 白居易
 //compareSequence(origin_totest, ry_totest, py_totest, root_totest);
 compareSequence(origin_totest2, ry_totest, py_totest2, root_totest);
 */

/**
 var res = compareSentence(origin_totest, ry_totest, py_totest, root_totest);
 console.log("输入：", origin_totest);
 analyse(res);

 var py2 = [['men2'],
 ['bo2', 'po1'],
 ['dong1'],
 ['wu2'],
 ['wan4', 'mo4'],
 ['li3'],
 ['chuan2']];

 var origin2 = "门泊东吴万里船";
 console.log("输入：", origin2);
 var res2 = compareSentence(origin2, ry_totest, py2, root_totest);
 analyse(res2);

 //if(!res.result) console.log(res.error)


 /** test sprintf() passed
 console.log(sprintf("haha%shjgjfg%sdflkdhf", [1,2]));
 */


