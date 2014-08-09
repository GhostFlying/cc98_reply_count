/**
 * Created by ghostflying on 14-8-7.
 */
var fs = require("fs");

var userCount = function (username) {
    this.name = username;
    this.count = 0;
};

userCount.prototype.inc = function () {
    this.count ++;
};

var countStorage = function () {
    this.storage = {};
};

countStorage.prototype.addCount = function (username) {
    if (this.storage[username] != null) {
        this.storage[username].inc();
    }
    else {
        var user = new userCount(username);
        user.inc();
        this.storage[username] = user;
    }
};

countStorage.prototype.print = function () {
    var array = this.toArray();
    var writeStr = "";
    var filename = new Date().toLocaleTimeString().replace(/:/g, "_") + ".txt";

    array.sort(this.compareFunction);
    for (var i = 0; i < array.length; i ++) {
        writeStr += array[i].name + " : " + array[i].count + "\r\n";
    }
    console.log ("start write to file.");
    console.log (writeStr);
    fs.writeFile(filename, writeStr, function (err) {
        if (err)
            throw  err;
        console.log ("result file saved. " + filename);
    });
}

countStorage.prototype.toArray = function () {
    var array = [];

    for (var each in this.storage) {
        array.push(this.storage[each]);
    }
    return array;
}

countStorage.prototype.compareFunction = function (a, b) {
    if (a.count > b.count){
        return - 1;
    }
    if (a.count < b.count){
        return 1;
    }
    return 0;
}

module.exports = countStorage;