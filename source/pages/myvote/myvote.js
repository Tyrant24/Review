// pages/myvote/myvote.js
import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";
import {
  VoteApi
} from "../../apis/vote.api.js";
import {
  GradeApi
} from "../../apis/grade.api.js";
import {
  RankApi
} from "../../apis/rank.api.js";
import {
  ApiUtil
} from "../../apis/apiutil";
import {
  BallotApi
} from "../../apis/ballot.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({
      order: "A"
    });

    //this.vote();

  }
  onMyShow() {
    var that = this;
    var voternumber = 0;
    this.vote();
    this.grade();
    this.ranking();
    this.ballot();
  }

  vote(e) {
    var voteapi = new VoteApi();
    voteapi.votelist({}, (votelist) => {


      for (var i=0;i<votelist.length;i++){
        console.log(ApiUtil.Timeslot(votelist[i].dealline_realtime),'实际');
        votelist[i].timeslot = ApiUtil.Timeslot(votelist[i].dealline_realtime);
      }

      this.Base.setMyData({
        votelist
      });
    })
  }
  grade(e) {
    var gradeapi = new GradeApi();
    gradeapi.gradelist({}, (gradelist) => {

      for (var i = 0; i < gradelist.length; i++) {
        console.log(ApiUtil.Timeslot(gradelist[i].dealline_realtime), '实际');
        gradelist[i].timeslot = ApiUtil.Timeslot(gradelist[i].dealline_realtime);
      }

      this.Base.setMyData({
        gradelist
      });
    })
  }
  ranking(e) {
    var rankapi = new RankApi();
    rankapi.rankinglist({}, (rankinglist) => {
      for (var i = 0; i < rankinglist.length; i++) {
        console.log(ApiUtil.Timeslot(rankinglist[i].dealline_realtime), '实际');
        rankinglist[i].timeslot = ApiUtil.Timeslot(rankinglist[i].dealline_realtime);
      }
      this.Base.setMyData({
        rankinglist
      });
    })
  }

  ballot(e) {
    var ballotapi = new BallotApi();
    ballotapi.ballotlist({}, (ballotlist) => {
      for (var i = 0; i < ballotlist.length; i++) {
        console.log(ApiUtil.Timeslot(ballotlist[i].dealline_realtime), '实际');
        ballotlist[i].timeslot = ApiUtil.Timeslot(ballotlist[i].dealline_realtime);
      }
      this.Base.setMyData({
        ballotlist
      });
    })
  }

  bindorder(e) {
    var orderid = e.currentTarget.dataset.order;
    //console.log(orderid, "选中的节点值");

    if (orderid == "A") {
      this.vote();
    }
    if (orderid == "B") {
      this.grade();
    }
    if (orderid == "C") {
      this.ranking();
    }
    if (orderid == "D") {
      this.ballot();
    }


    this.Base.setMyData({
      order: orderid
    });
    //this.onMyShow();
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.bindorder = content.bindorder;

body.vote = content.vote;

body.grade = content.grade;

body.ranking = content.ranking; 

body.ballot = content.ballot;

Page(body)