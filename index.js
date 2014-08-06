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
                countEachPostsInPage (posts[each], startDate, endDate);
            }
            options.pageNum = pageNum + 1;
            checkPageBeforeStartDate(options, callback);
        }
    });
}

var checkPageBeforeStartDate = function (posts, startDate) {
    for (var each in posts) {
        var post = posts[each];
        if (post.lastReply > startDate){
            return false;
        }
    }
    return true;
}

startCount(_account, new Date("08/07/2014"), new Date());