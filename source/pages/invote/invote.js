// pages/invote/invote.js 
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

    this.vote();

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
    voteapi.myvotelist({}, (myvotelist) => {

      for (var i = 0; i < myvotelist.length; i++) {
        //console.log(ApiUtil.Timeslot(myvotelist[i].vote_dealline_realtime), '实际');
       myvotelist[i].timeslot = ApiUtil.Timeslot(myvotelist[i].vote_dealline_realtime);
      }

      this.Base.setMyData({
        myvotelist
      });
    })
  }

  grade(e) {
    var gradeapi = new GradeApi();
    gradeapi.mygradelist({}, (mygradelist) => {

      for (var i = 0; i < mygradelist.length; i++) {
        console.log(mygradelist[i].vote_dealline_realtime,'噗噗噗噗噗')
      //  console.log(ApiUtil.Timeslot(mygradelist[i].vote_dealline_realtime), '实际');
     mygradelist[i].timeslot = ApiUtil.Timeslot(mygradelist[i].grade_dealline_realtime);
      }

      this.Base.setMyData({
        mygradelist
      });
    })
  }

  ranking(e) {
    var rankapi = new RankApi();
    
    rankapi.myrankinglist({}, (myrankinglist) => { 
      for (var i = 0; i < myrankinglist.length; i++) { 
       myrankinglist[i].timeslot = ApiUtil.Timeslot(myrankinglist[i].ranking_dealline_realtime);
      } 
      this.Base.setMyData({
        myrankinglist
      });

    })
  }

  ballot(e) {
    var ballotapi = new BallotApi();
    ballotapi.myballotlist({}, (myballotlist) => {
      for (var i = 0; i < myballotlist.length; i++) {
        //console.log(ApiUtil.Timeslot(myballotlist[i].dealline_realtime), '实际');
        myballotlist[i].timeslot = ApiUtil.Timeslot(myballotlist[i].ballot_dealline_realtime);
      }
      this.Base.setMyData({
        myballotlist
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

body.ballot = content.ballot;

body.ranking = content.ranking;

Page(body)