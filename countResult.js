/**
 * Created by ghostflying on 14-8-7.
 */
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

module.exports = countStorage;