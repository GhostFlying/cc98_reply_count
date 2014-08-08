/**
 * Created by ghostflying on 14-8-6.
 */
var _98 = require("cc98-node-api");
var _result = require("./countResult");

var result = new _result();
var pagesCount = 0; // the count for detect does all counting finished.



//main function, startDate is the day farthest from now.
var startCount = function (account,boardID, startDateStr, endDateStr) {
    var cc98 = new _98(account);
    var startDate = new Date(startDateStr);
    var endDate = new Date();
    if (endDateStr != null){
        endDate = new Date(endDateStr);
    }

    cc98.login(function(data){
        if (data.status == 1) {
            var options = {
                cc98: cc98,
                pageNum: 1,
                boardID: boardID,
                startDate: startDate,
                endDate: endDate
            }

            countPerPage(options, null);
        }
    });
};

var countPerPage = function (options, callback) {
    var cc98 = options.cc98;
    var pageNum = options.pageNum;
    var boardID = options.boardID;
    var startDate = options.startDate;
    var endDate = options.endDate;

    cc98.getAllPostList(boardID, pageNum, pageNum, function (data) {
        if (data != null) {
            var posts = data[1].list;

            //End Condition
            if (checkPageBeforeStartDate(posts, startDate)){
                console.log ("Counting board pages finished. End at page " + pageNum);
                return;
            }
            console.log ("Start counting page " +pageNum + ".");

            for (var each in posts) {
                if ((posts[each].topicStatus == "开放主题" || posts[each].topicStatus == "保存帖"
                    || posts[each].topicStatus == "热门主题")
                    && (new Date(posts[each].lastReply) > startDate)) {
                    var postOptions = {
                        cc98 : cc98,
                        boardID : boardID,
                        postID : posts[each].postId,
                        pageNum : Math.ceil((parseInt(posts[each].replyNum) + 1)/10),
                        startDate : startDate,
                        endDate : endDate
                    }
                    pagesCount += postOptions.pageNum;
                    countPerPost(postOptions, null);
                }
            }

            options.pageNum ++;
            countPerPage(options, callback);
        }
    });
};

//if all counting finished, print the result.
var checkAllCountExit = function () {
    if (pagesCount == 0) {
        result.print();
    }
}

var countPerPost = function (options, callback) {
    var cc98 = options.cc98;
    var postID = options.postID;
    var boardID = options.boardID;
    var pageNum = options.pageNum;
    var startDate = options.startDate;
    var endDate = options.endDate;

    //all pages are counted.
    if (pageNum < 1){
        return;
    }

    cc98.getPostInfo(boardID, postID, pageNum, pageNum, function (data) {
        if (data !=null) {
            var replies = data[1].list;

            //End Condition. All replies in the page are out of date.
            var firstIndex = checkRepliesBeforeStartDate(replies, startDate);
            if (firstIndex < 0) {
                pagesCount -= pageNum;
                console.log ("Ignore Counting. Page " + pageNum + "Post " + postID);
                checkAllCountExit();
                return;
            }

            for (var each in replies) {
                var reply = replies[each];

                if (each >= firstIndex && checkReplyInRange(reply, startDate, endDate)) {
                    result.addCount(reply.author);//count this reply.
                    //console.log (reply);
                }
            }
            pagesCount --;
            options.pageNum --;
            countPerPost(options, callback);
            console.log ("Post: " + postID + "  Counting page" + pageNum + " of replies finished.");
            checkAllCountExit();
        }
    });
};

var checkReplyInRange = function (reply, startDate, endDate) {
    var postTime = new Date(reply.postTime);
    if (postTime < endDate) {
        return true;
    }
    else {
        return false;
    }
};

//return the index of the first reply whose post time is after startDate.
//so use cycle instead of for .. in
// if no one fulfill, return -1
var checkRepliesBeforeStartDate = function (replies, startDate) {
    for (var i = 0; i < replies.length; i++){
        var reply = replies[i];
        if (new Date(reply.postTime) > startDate) {
            return i;
        }
    }
    return -1;
};

//return true iff all the posts' lastReply time is before startDate.
var checkPageBeforeStartDate = function (posts, startDate) {
    for (var each in posts) {
        var post = posts[each];
        if (post.lastReply > startDate){
            return false;
        }
    }
    return true;
};


//Count replies in one post.
//Can receive 3 - 5 arguments
//params : user, postID, boardID[, startDate[, endDate]]
var countRepliesInOnePost = function () {
    var argumentsNum = arguments.length;
    var user;
    var postID;
    var boardID;
    var startDate = new Date("07/08/1995");
    var endDate = new Date();

    if (argumentsNum < 3 || argumentsNum > 5){
        throw  new Error("arguments must match user, postID, boardID[, startDate[, endDate]]");
    }

    user = arguments[0];
    postID = arguments[1];
    boardID = arguments[2];

    if (argumentsNum > 3) {
        startDate = new Date(arguments[3]);
    }
    if (arguments == 5) {
        endDate = new Date(arguments[4]);
    }

    var cc98 = new _98(user);
    cc98.login(function (date) {
        if (date.status == 1) {
            cc98.getPostInfo(boardID, postID, 1, 1, function(date) {
                if (date != null) {
                    var options = {
                        cc98 : cc98,
                        postID : postID,
                        boardID : boardID,
                        pageNum : Math.ceil(date[0].totalPosts / 10),
                        startDate : startDate,
                        endDate : endDate
                    }
                    pagesCount += options.pageNum;
                    countPerPost(options, null);
                }
            });
        }
    });
}

module.exports = {
    CountAllReplies : startCount,
    CountOnePost : countRepliesInOnePost
};