/**
 * Created by ghostflying on 14-8-6.
 */
var _98 = require("cc98-node-api");
var _account = require("./user_config");//read user info from another config file.

var BOARD_ID = 357;//The specified board id, default is "时事新闻"


//main function, startDate is the day farthest from now.
var startCount = function (account, startDate, endDate) {
    var cc98 = new _98(account);

    cc98.login(function(data){
        if (data.status == 1) {
            var options = {
                cc98: cc98,
                pageNum: 1,
                boardID: BOARD_ID,
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
                console.log ("Counting finished.");
                return;
            }

            for (var each in posts) {
                if (posts[each].topicStatus == "开放主题" || posts[each].topicStatus == "保存帖") {
                    var postOptions = {
                        cc98 : cc98,
                        boardID : boardID,
                        postID : posts[each].postId,
                        pageNum : Math.ceil((parseInt(posts[each].replyNum) + 1)/10),
                        startDate : startDate,
                        endDate : endDate
                    }

                    countPerPost(postOptions, null);
                }
            }

            options.pageNum ++;
            countPerPage(options, callback);
        }
    });
};

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
                console.log ("Ignore Counting. Page " + pageNum + "Post " + postID);
                return;
            }

            for (var each in replies) {
                var reply = replies[each];

                console.log (reply);
            }

            options.pageNum --;
            countPerPost(options, callback);
        }
    });
};

var checkReplyInRange = function (reply, startDate, endDate) {

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

startCount(_account, new Date("08/07/2014"), new Date());