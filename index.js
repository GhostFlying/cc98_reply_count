/**
 * Created by ghostflying on 14-8-8.
 * This file is the entry for user.
 */
var main = require("./main");

var user = {
    user : "username",
    password : "passwprd"
}

//main(user, boardID, startDate, endDate);
//date should be enter by the format javaScript can parse.
// endDate can be null. then it's now.
main (user, 537,"08/08/2014", null);