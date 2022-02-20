// pages/ballotdetail/ballotdetail.js 
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
  BallotApi
} from "../../apis/ballot.api.js";
import {
  ApiUtil
} from "../../apis/apiutil";

class Content extends AppBase {
  constructor() {
    super();
  }

  onLoad(options) {
    this.Base.Page = this;
   //  options.id=6;
    super.onLoad(options);
    this.Base.setMyData({
      nm: false,
      show: false,
      clock:false,
      infoid: this.Base.options.id,
      checked: false
    })

  }

  setPageTitle() {
    wx.setNavigationBarTitle({
      title: "表决详情",
    })
  }

  onMyShow() {
    wx.showLoading({
      title: '数据加载中',
    })
    var that = this;

    if (AppBase.InstInfo.switch_value == "Y") {
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
    var ballotapi = new BallotApi();
    var num = 0;
    var zon = 0;
    var paimingshu = 0;
    var paiminglist = [];

 

    ballotapi.ballotinfo({
      id: this.Base.getMyData().infoid
    }, (ballotinfo) => {


      if (ballotinfo.optionmode=="A"){
     this.Base.setMyData({
       biaojuelist: [{ jisuan: 'A', ballotcontent: '同意' },
         { jisuan: 'B', ballotcontent: '不同意' },
         { jisuan: 'C', ballotcontent: '弃权' }]
     })
      } else if (ballotinfo.optionmode == "B"){
        this.Base.setMyData({
          biaojuelist: [{ jisuan: 'A', ballotcontent: '赞成' },
            { jisuan: 'B', ballotcontent: '反对' },
            { jisuan: 'C', ballotcontent: '弃权' }]
        })
      } else{
        this.Base.setMyData({
          biaojuelist: [{ jisuan: 'A', ballotcontent: '通过' },
            { jisuan: 'B', ballotcontent: '不通过' },
          { jisuan: 'C', ballotcontent: '弃权' }]
        })
      }

      ballotinfo.timeslot = ApiUtil.Timeslot(ballotinfo.dealline_realtime);

      var ballotoptionlist = ballotinfo.ballotoptionlist;


      for (var i = 0; i < ballotoptionlist.length; i++) {
        ballotoptionlist[i].ballotcontent = '';
        ballotoptionlist[i].jisuan = 'D';

        var balloterlist = ballotoptionlist[i].balloterlist;

        for (var j = 0; j < balloterlist.length; j++) {

          if(this.Base.getMyData().memberinfo!=null&&this.Base.getMyData().memberinfo!=undefined){
          if (balloterlist[j].member_id == this.Base.getMyData().memberinfo.id) {
            num++
            ballotoptionlist[i].ballotcontent = balloterlist[j].ballotcontent
          }
           }
          zon++
        }

      }



      this.Base.setMyData({
        info: ballotinfo,
        dx: ballotinfo.duoxuan_value, 
        ballotoptionlist: ballotoptionlist,
        num,
        zon
      });
      
      wx.hideLoading();

    })

  }

  onShareAppMessage(e) {
    var that = this;
    var fenxiangtu = this.Base.getMyData().res.fenxiangtu;
    return {
      title: this.Base.getMyData().memberinfo.nickName + "邀请您参加评审\n" + "【" + this.Base.getMyData().info.theme + "】",
      path: '/pages/ballotdetail/ballotdetail?id=' + this.Base.getMyData().infoid,
      imageUrl: "https://alioss.app-link.org/alucard263096/review/resource/" + fenxiangtu  
    };

  }
  shuaxin(e) {
    this.onMyShow();
  }
 
  bindinput(e) {
    var index = e.currentTarget.id; 
    var biaojuelist = this.Base.getMyData().biaojuelist; 
    var ballotoptionlist = this.Base.getMyData().ballotoptionlist; 
    ballotoptionlist[index].jisuan = biaojuelist[e.detail.value].jisuan;
    ballotoptionlist[index].ballotcontent = biaojuelist[e.detail.value].ballotcontent;
   
    this.Base.setMyData({
      ballotoptionlist 
    })

  }

  confirm(e) {
    var ballotoptionlist = this.Base.getMyData().ballotoptionlist;
    var checked = this.Base.getMyData().checked;
    var paimingshu = 0;
    var paiminglist = [];

    console.log("第一个", this.Base.getMyData().id)
    for (var i = 0; i < ballotoptionlist.length; i++) {
      if (ballotoptionlist[i].check == true) {
        paimingshu++
        paiminglist.push({
          id: paimingshu
        });
      }
    }
    console.log("第二个", this.Base.getMyData().id)

    if (paimingshu < 2) {
      this.Base.info("请至少选择两个选项");
      return;
    }

    // checked = true;
    this.Base.setMyData({
      paimingshu,
      paiminglist,
      checked: true
    }) 
  }

  reset(e) {
    var ballotoptionlist = this.Base.getMyData().ballotoptionlist;
    var paimingshu = 0;
    var paiminglist = [];
    for (var i = 0; i < ballotoptionlist.length; i++) {
      ballotoptionlist[i].number = 0;

      if (ballotoptionlist[i].check == true) {
        paimingshu++
        paiminglist.push({
          id: paimingshu
        });
      }
    }
    this.Base.setMyData({
      paiminglist,
      ballotoptionlist
    })
  }

  againcheck(e) {
    this.Base.setMyData({
      checked: false,
      paiminglist: [],
      paimingshu: 0
    })
  }

  niming(e) {
    this.Base.setMyData({
      niming: e.detail.value
    })
  }


  bindcheck(e) {
    var dx = this.Base.getMyData().dx;
    var dxnum = this.Base.getMyData().dxnum;
    console.log(dx, dxnum);

    // return;
    var index = e.currentTarget.dataset.index;

    var id = e.currentTarget.id;

    var ballotoptionlist = this.Base.getMyData().ballotoptionlist;

    if (dx == 'A') {
      for (var i = 0; i < ballotoptionlist.length; i++) {
        ballotoptionlist[i].check = false;
      }
    }

    ballotoptionlist[index].check = true;

    this.Base.setMyData({
      ballotoptionlist,
      id: id
    })


  }

  bindnocheck(e) {
    var index = e.currentTarget.dataset.index;
    var ballotoptionlist = this.Base.getMyData().ballotoptionlist;

    ballotoptionlist[index].check = false;

    this.Base.setMyData({
      ballotoptionlist
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

    var ballotapi = new BallotApi();

    var nm = this.Base.getMyData().niming;
    var dx = this.Base.getMyData().dx;
 
    var info = this.Base.getMyData().info;
    var ballotoptionlist = this.Base.getMyData().ballotoptionlist;
   
    var instapi = new InstApi();
    var xz = 0;
    var membername = this.Base.getMyData().membername; 
    ballotapi.ballotinfo({
      id: this.Base.getMyData().infoid
    }, (ballotinfo) => {

      if (ballotinfo.ballotstatus != "A") {

        wx.showModal({
          title: '提示',
          content: '表决已结束，无法投票',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#2699EC',
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/home/home',
              })
            }
          }
        })

        return;

      } else if (ballotinfo.status != "A") {
        wx.showModal({
          title: '提示',
          content: '表决已被删除，无法投票',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#2699EC',
          success: function (res) {
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
 
    if (nm == false) {
      var nm = 'N';
    } else {
      var nm = 'Y'
    }


    for (var j = 0; j < ballotoptionlist.length; j++) {
      if (ballotoptionlist[j].jisuan != "D") {
        xz++
      }
    }

    if (dx == 'N' && xz != ballotoptionlist.length) {
      this.Base.info('请确认所有选项都已表决')
      return;
    }

    if (dx == "Y" && xz == 0) {
      this.Base.info('请至少对一个选项表决')
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
      } else if (this.Base.getMyData().memberinfo.mobile == "" && this.Base.getMyData().phone == "") {
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

    var tmplids = ['-UNxDLpJPR8KZ28jW5p86WDRL5sgpCQJ929TrkGmqo4'];
    wx.requestSubscribeMessage({
      tmplIds: tmplids,
      success(res) {
        var tmp = res[tmplids];
        var theme = that.Base.getMyData().info.theme;
        wx.showModal({
          title: '提交',
          content: '确认表决？',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#EE2222',
          confirmText: '确定',
          confirmColor: '#2699EC',
          success: function (res) {
            if (res.confirm) {
               
              var zonlist=[];
              for (var i = 0; i < ballotoptionlist.length; i++) { 
                var oplist = {
                  ballot_id: that.Base.getMyData().info.id,
                  membername: membername,
                  member_id:that.Base.getMyData().memberinfo.id,
                  ballotoption_id: ballotoptionlist[i].id,
                  ballotcontent: ballotoptionlist[i].ballotcontent,
                  jisuan: ballotoptionlist[i].jisuan,
                  status: "A"
                };
                zonlist.push(oplist); 
              }

              var datajson=JSON.stringify(zonlist);
              that.tijiao(datajson);

              ballotapi.addmyballot({
                member_id: that.Base.getMyData().memberinfo.id,
                ballot_id: that.Base.getMyData().infoid,
                status: "A"
              }, (addmyballot) => {
                wx.hideLoading();
              })


            }
          }
        })

      },
      fail(res) { }
    })



  }

 

  tijiao(datajson) {
    var that=this;
    var ballotapi = new BallotApi();

    ballotapi.addballoter({datajson:datajson}, (ret) => {
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

  toadd(e) {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  }

  toupdate(e) {
    wx.navigateTo({
      url: '/pages/newballot/newballot?id=' + this.Base.getMyData().infoid,
    })
  }
  bindend(e) {
    var ballotapi = new BallotApi();
    var id = e.currentTarget.id;
    var that = this;
    wx.showModal({
      title: '提交',
      content: '确认结束表决？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#EE2222',
      confirmText: '确定',
      confirmColor: '#2699EC',
      success: function (res) {
        if (res.confirm) {
          ballotapi.updateballotstatus({
            id: id
          }, (updateballotstatus) => {
            that.Base.setMyData({
              updateballotstatus
            })
            that.onMyShow();
          })
        }
      }
    })

  }

  binddelete(e) {
    var ballotapi = new BallotApi();
    var id = e.currentTarget.id;
    var that = this;
    wx.showModal({
      title: '提交',
      content: '确认删除表决？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#EE2222',
      confirmText: '确定',
      confirmColor: '#2699EC',
      success: function (res) {
        if (res.confirm) {
          ballotapi.deleteballot({
            id: id
          }, (deleteballot) => {

            wx.navigateBack({

            })

          })
        }
      }
    })
  }

  daochu() {
    var that = this;

    if(this.Base.getMyData().info.ballotstatus=="A"){
      wx.showToast({
        title: '表决暂未结束，无法查看',
        icon: 'none'
      })
      return;
    }
    var api = ApiConfig.GetApiUrl() + "export/ballot?ballot_id=" + this.Base.options.id;

      console.log(api,'ius')
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
            success: function (res) {
              if (res.confirm) {
                wx.setClipboardData({
                  data: api
                })
              } else {
                that.download(api, () => { }, true);
              }
            }
          })

        } else {
          that.download(api, () => { }, true);
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

body.shuaxin = content.shuaxin;
body.bindpicker = content.bindpicker;

body.niming = content.niming;
body.bindinput = content.bindinput;

body.bindname = content.bindname;
body.setname = content.setname;

body.binddelete = content.binddelete;
body.bindend = content.bindend;

body.confirm = content.confirm;
body.reset = content.reset;
body.againcheck = content.againcheck;

body.submit = content.submit;
body.tijiao = content.tijiao;

body.toadd = content.toadd;
body.toupdate = content.toupdate;

body.bindcheck = content.bindcheck;

body.bindnocheck = content.bindnocheck;
body.daochu = content.daochu;

Page(body)