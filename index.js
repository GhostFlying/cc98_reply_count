/**
 * Created by ghostflying on 14-8-8.
 * This file is the entry for user.
 */
var main = require("./main");

var user = {
    user : "username",
    password : "passwprd"
}

/*
Count all the replies in one board:
main.CountAllReplies(user, boardID, startDate[, endDate]);
date should be enter by the format javaScript can parse.


Count all the replies in one post:
main.CountOnePost(user, postID, boardID[, startDate[, endDate]]);
startDate and endDate should can be parsed by js.


Sample:
main.CountAllReplies (user, 537,"08/07/2014", null);
main.CountAllReplies (user, 537,"08/07/2014", "08/08/2014");

main.CountOnePost(user, 537, 4411757);
main.CountOnePost(user, 537, 4411757, "08/08/2014");
main.CountOnePost(user, 537, 4411757, "08/08/2014", "08/09/2014");
*/
