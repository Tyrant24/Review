// pages/votedetail/votedetail.js
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
  ApiUtil
} from "../../apis/apiutil";
import {
  MemberApi
} from "../../apis/member.api.js";
import {
  ExampleApi
} from "../../apis/example.api.js";
class Content extends AppBase {
  constructor() {
    super();
  }

  onLoad(options) {
    this.Base.Page = this;
    // options.id = 1;
    super.onLoad(options);
    this.Base.setMyData({
      nm: false,
      show: false,
      clock:false,
      infoid: this.Base.options.id, 
      aga: 0
    })
  }

  setPageTitle() {
    wx.setNavigationBarTitle({
      title: "投票详情",
    })
  }
  onMyShow() {
    var that = this;
    wx.showLoading({
      title: '数据加载中',
    })

    if (AppBase.InstInfo.switch_value=="Y"){
      wx.showModal({
        title: '提示',
        content: '您提交的内容正在审核，请耐心等候？',
        showCancel: false,  
        confirmText: '确定',
        confirmColor: '#2699EC',
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({
            })
          }
        }
      })
    }

    var voteapi = new VoteApi();
    var num = 0;
    var zon = 0;
    voteapi.voteinfo({
      id: this.Base.getMyData().infoid
    }, (voteinfo) => {
      voteinfo.timeslot = ApiUtil.Timeslot(voteinfo.dealline_realtime);
      var optionlist = voteinfo.optionlist;

      for (var i = 0; i < optionlist.length; i++) {
        console.log(voteinfo.optionlist[i].content, '===')
        optionlist[i].check = false;
        optionlist[i].checked = false;
        var voterlist = optionlist[i].voterlist;

        optionlist[i].peoplenum = optionlist[i].voterlist.length;

        for (var j = 0; j < voterlist.length; j++) {



          if(this.Base.getMyData().memberinfo!=null&&this.Base.getMyData().memberinfo!=undefined){

            if (voterlist[j].member_id == this.Base.getMyData().memberinfo.id) {
              num++
              optionlist[i].checked = true
            }

          }
           
          zon++
        }

      }


      this.Base.setMyData({
        info: voteinfo,
        dx: voteinfo.duoxuan,
        dxnum: voteinfo.num,
        dxminnum: voteinfo.minnum,
        optionlist: optionlist,
        num,
        aga: 0,
        zon: zon
      });

       wx.hideLoading();
    })
  }

  onShareAppMessage(e) {
    var that = this;
    var fenxiangtu = this.Base.getMyData().res.fenxiangtu;
    return {
      title: this.Base.getMyData().memberinfo.nickName + "邀请您参加评审\n" + "【" + this.Base.getMyData().info.theme +"】",
      path: '/pages/votedetail/votedetail?id=' + this.Base.getMyData().infoid,
      imageUrl: "https://alioss.app-link.org/alucard263096/review/resource/" + fenxiangtu
    };
  }

  shuaxin(e) {
    this.onMyShow();
  }

  niming(e) {
    this.Base.setMyData({
      niming: e.detail.value
    })
  }


  bindcheck(e) {
    var dx = this.Base.getMyData().dx; 
    var index = e.currentTarget.dataset.index;

    var id = e.currentTarget.id;

    var optionlist = this.Base.getMyData().optionlist;

    if (dx == 'A') {
      for (var i = 0; i < optionlist.length; i++) {
        optionlist[i].check = false;
      }
    }



    optionlist[index].check = true;

    this.Base.setMyData({
      optionlist,
      id: id
    })


  }

  bindnocheck(e) {
    var index = e.currentTarget.dataset.index;
    var optionlist = this.Base.getMyData().optionlist;

    optionlist[index].check = false;

    this.Base.setMyData({
      optionlist
    })

  }

  bindname(e) {
    this.Base.setMyData({
      membername: e.detail.value
    })
  }
  setname(e) {
    console.log("来看看六角恐龙")
    this.Base.setMyData({
      show: false
    })
  }

  submit(e) { 
    var that = this;
    var clock=this.Base.getMyData().clock;
    if(clock==true){
      console.log('返回');
      return;
    }
    var nm = this.Base.getMyData().niming;
    var dx = this.Base.getMyData().dx;
    var dxnum = this.Base.getMyData().dxnum;
    var dxminnum = this.Base.getMyData().dxminnum;
    var optionlist = this.Base.getMyData().optionlist;
    var id = this.Base.getMyData().id;
    var voteapi = new VoteApi();
    var instapi = new InstApi();
    var xz = 0;
    var membername = this.Base.getMyData().membername;

    var info = this.Base.getMyData().info;

    voteapi.voteinfo({
      id: this.Base.getMyData().infoid
    }, (voteinfo) => {

      if (voteinfo.votestatus != "A") {
 
        wx.showModal({
          title: '提示',
          content: '投票已结束，无法投票',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#2699EC',
          success: function(res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/home/home',
              })
            }
          }
        })
        return;
      } else if (voteinfo.status != "A") {
        wx.showModal({
          title: '提示',
          content: '投票已被删除，无法投票',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#2699EC',
          success: function(res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/home/home',
              })
            }
          }
        })
        return;

      }

    })


    for (var j = 0; j < optionlist.length; j++) {
      if (optionlist[j].check == true) {
        xz++
      }
    }


    if (dx == 'A' && xz < dxnum) {
      this.Base.info('请至少选择1个选项')
      return;
    }

    if (dx == 'B' && xz < dxminnum) {
      this.Base.info('请至少选择' + dxminnum + '个选项')
      return;
    }
 
    if (dx == 'B' && xz > dxnum) {
      this.Base.info('最多选择' + dxnum + '个选项')
      return;
    }
     
 
 

    if (this.Base.getMyData().info.niming_value == 'N') {

      if ((membername == null || this.Base.getMyData().memberinfo.mobile == "" || this.Base.getMyData().phone == "") && this.Base.getMyData().show == false) {
        this.Base.setMyData({
          show: true
        })
        return;
      } else if (membername == null && this.Base.getMyData().show == true) {
        this.Base.info("请填写名字");
        return;
      } else if (this.Base.getMyData().memberinfo.mobile == "" && this.Base.getMyData().phone == ""){
        this.Base.info("请获取手机号码");
        return;
      } else {
        this.Base.setMyData({
          show: false
        })
      }
   
    } else {
      var membername = "匿名评委";
    }
   
    // console.log(membername, "aaaa")

  
    var tmplids = ['-UNxDLpJPR8KZ28jW5p86WDRL5sgpCQJ929TrkGmqo4'];

    wx.requestSubscribeMessage({
      tmplIds: tmplids,
      success(res) {
        var tmp = res[tmplids];
        var theme = that.Base.getMyData().info.theme;

        var length = 0;
        wx.showModal({
          title: '提交',
          content: '确认投票？',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#EE2222',
          confirmText: '确定',
          confirmColor: '#2699EC',
          success: function(res) {
            if (res.confirm) {
              
              var zonlist=[]; 
              for (var i = 0; i < optionlist.length; i++) {

                if (optionlist[i].check == true) {
                   
                  var oplist = {
                    vote_id: that.Base.getMyData().info.id,
                    membername: membername,
                    member_id:that.Base.getMyData().memberinfo.id,
                    option_id: optionlist[i].id,
                    piao:1,
                    status: "A"
                  };
                  zonlist.push(oplist);
  
                }

              }

              var datajson=JSON.stringify(zonlist);
              that.tijiao(datajson); 
 
              voteapi.addmyvote({ 
                member_id: that.Base.getMyData().memberinfo.id,
                vote_id: that.Base.getMyData().infoid,
                status: "A"
              }, (addmyvote) => {
                wx.hideLoading();
              })


            }
          }
        })

      },
      fail(res) {}
    })


  }
  tijiao(datajson) {
    var that=this;
    var voteapi = new VoteApi();

    voteapi.addvoter({datajson:datajson}, (ret) => {
      console.log(ret)
      if(ret.code==0){
        this.clock(); 
        this.onMyShow();
        wx.showToast({
          title: '提交成功!',
          icon:'none'
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '提交失败，请重试!',
          showCancel: false,
          cancelText: '取消',
          cancelColor: '#EE2222',
          confirmText: '确定',
          confirmColor: '#2699EC',
          success: function(res) {
            if (res.confirm) {
              that.onMyShow();
            }
          } 
     })
      
    }
  })
 }

  again() {
    this.Base.setMyData({
      aga: 1,
      num: 0
    })
  }

  againvote(e) {
    var voteapi = new VoteApi();
    voteapi.againsubmit({
      id: this.Base.getMyData().infoid
    }, (againsubmit) => {
      this.submit();
    })
  }


  toadd(e) {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  }

  toupdate(e) {
    wx.navigateTo({
      url: '/pages/addedvote/addedvote?id=' + this.Base.getMyData().infoid,
    })
  }
  bindend(e) {
    var that = this;
    var voteapi = new VoteApi();
    var id = e.currentTarget.id;

    wx.showModal({
      title: '提交',
      content: '确认结束投票？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#EE2222',
      confirmText: '确定',
      confirmColor: '#2699EC',
      success: function(res) {
        if (res.confirm) {
          voteapi.updatevotestatus({
            id: id
          }, (updatevotestatus) => {
            that.onMyShow();
          })
        }
      }
    })

  }

  binddelete(e) {
    var voteapi = new VoteApi();
    var id = e.currentTarget.id;
    var that = this;
    wx.showModal({
      title: '提交',
      content: '确认删除投票？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#EE2222',
      confirmText: '确定',
      confirmColor: '#2699EC',
      success: function(res) {
        if (res.confirm) {
          voteapi.deletevote({
            id: id
          }, (deletevote) => {

            wx.navigateBack({})

          })
        }
      }
    })

  }

  daochu() {
    var that = this;
    if(this.Base.getMyData().info.votestatus=="A"){
      wx.showToast({
        title: '投票暂未结束，无法查看',
        icon: 'none'
      })
      return;
    }
    var api = ApiConfig.GetApiUrl() + "export/vote?vote_id=" + this.Base.getMyData().infoid;
    wx.getSystemInfo({
      success(res) {
        if (res.platform == 'ios') {

          wx.showModal({
            title: '提示',
            content: '请复制链接至浏览器中打开下载',
            cancelText: '预览',
            cancelColor: '#EE2222',
            confirmText: '复制',
            confirmColor: '#2699EC',
            success: function(res) {
              if (res.confirm) {
                wx.setClipboardData({
                  data: api
                })
              } else {
                that.download(api, () => {}, true);
              }
            }
          })


        } else {
          that.download(api, () => {}, true);
        }

      }
    })

  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;

body.onMyShow = content.onMyShow;
body.onShareAppMessage = content.onShareAppMessage;

body.niming = content.niming;

body.daochu = content.daochu;

body.phonenoCallback = content.phonenoCallback;
body.getPhoneNumber = content.getPhoneNumber;

body.shuaxin = content.shuaxin;

body.bindname = content.bindname;
body.setname = content.setname;

body.submit = content.submit;
body.tijiao = content.tijiao;
body.againvote = content.againvote;
body.again = content.again;

body.binddelete = content.binddelete;
body.bindend = content.bindend;

body.toadd = content.toadd;
body.toupdate = content.toupdate;

body.bindcheck = content.bindcheck;

body.bindnocheck = content.bindnocheck;

Page(body)