/**
 * Created by yan on 16/11/29.
 */

/**
 网络收集词牌规则如下
 符号：○平声 ●仄声 ⊙可平可仄 △平韵 ▲仄韵
 */

var argv = require("argv");

var table = ["○", "●", "◎", "⊙", "△", "▲", "，", "。", "、", "『", "』", "〖", "〗"];
//            0平  1仄  2偏平 3偏仄 4平韵 5仄韵 6    7     8     9对偶10     11叠韵12

var convert = function (str) {
    var i = 0, value = -1, res = "";
    for(i; i < str.length; i++){
        value = table.indexOf(str[i]);
        if(value === -1) throw "Input error : Unknown Symbol " + str[i];
        res += value;
    }
    return parseInt(res);
};

var single = function (str) {
    // take spaces and \n out
    str = str.replace(/" "+/g, "");
    str = str.replace(/"\n"/g, "");
    var i = 0, arr = [];
    for(i; i < str.length; i++){
        arr.push(convert(str[i]))
    }
    return arr
};

// local test
/** passed */
var args = argv.run().targets;
console.log(JSON.stringify(single(args[0])));


