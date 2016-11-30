/**
 * Created by yan on 16/11/29.
 */

/**
 * will run constantly on server to provide pinyin
 * UTF-8 is(will be) asserted to run this program on your server.
 */

var express = require("express");
var pinyin = require("pinyin");
var Storage = require("dom-storage")
    ,ls = new Storage('./db.json', { strict: false, ws: '  ' });
var argv = require("argv");

//TODO assertion of utf-8 encoding

// Calculation
var main = function (phrase) {
    var value = ls.getItem(phrase);
    //console.log(value);
    if(value) return value;
    value = pinyin(phrase, {
        heteronym: true,
        segment: true,
        style: pinyin.STYLE_TONE2
    });
    var value1 = JSON.stringify(value);
    ls.setItem(phrase, value1);
    //console.log(phrase);
    return value;
};

//TODO Transaction
var app = express();


// for console testing

/* passed
var args = argv.run().targets;
console.log(main(args[0]));

*/

var test = ["间关莺语花底滑", "幽咽泉流冰下难",
    "冰泉冷涩弦凝绝", "凝绝不通声暂歇",
    "别有幽愁暗恨生", "此时无声胜有声"];
var a = test.map(main);
console.log(a)
