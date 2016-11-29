/**
 * Created by yan on 16/11/29.
 */

/**
 网络收集词牌规则如下
 符号：○平声 ●仄声 ⊙可平可仄 △平韵 ▲仄韵
 */

var argv = require("argv");

var table = ["○", "●", "⊙", "△", "▲", "，", "。", "、"];

var convert = function (str) {
    var i = 0, value = -1, res = "";
    for(i; i < str.length; i++){
        value = table.indexOf(str[i]);
        if(value === -1) throw "Unknown Symbol";
        res += value;
    }
    return res;
};

var single = function (str) {
    // take spaces out
    str = str.replace(/" "+/g, "");
    // split to parts
    var arr = str.split("\n");
    var i = 0;
    for(i; i < arr.length; i++){
        arr[i] = convert(arr[i])
    }
    return arr;
};

// local test
/** passed
var args = argv.run().targets;
console.log(single(args[0]));
*/
