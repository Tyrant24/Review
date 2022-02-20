// pages/scoredetail/scoredetail.js
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
  GradeApi
} from "../../apis/grade.api.js";
import {
  ApiUtil
} from "../../apis/apiutil";

class Content extends AppBase {
  constructor() {
    super();
  }

  onLoad(options) {
    this.Base.Page = this;
    //options.id = 5;
    super.onLoad(options);
    this.Base.setMyData({
      nm: false,
      show: false,
      clock:false,
      infoid: this.Base.options.id
    })
  }
  setPageTitle() {
    wx.setNavigationBarTitle({
      title: "评分详情",
    })
  }
  onMyShow() {
    var that = this;
    wx.showLoading({
      title: '数据加载中',
    })
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

    var gradeapi = new GradeApi();
    var num = 0;
    var zon = 0; 
    gradeapi.gradeinfo({
      id: this.Base.getMyData().infoid
    }, (gradeinfo) => {

      if (gradeinfo.dimension == "A") {
        var zonfen = 2
      }
      if (gradeinfo.dimension == "B") {
        var zonfen = 3
      }
      if (gradeinfo.dimension == "C") {
        var zonfen = 5
      }
      if (gradeinfo.dimension == "D") {
        var zonfen = 10
      }
      if (gradeinfo.dimension == "E") {
        var zonfen = 100
      }

      gradeinfo.timeslot = ApiUtil.Timeslot(gradeinfo.dealline_realtime);
      var gradeoptionlist = gradeinfo.gradeoptionlist;
      for (var i = 0; i < gradeoptionlist.length; i++) {
        console.log(gradeinfo.gradeoptionlist[i].content, '===')
 
        gradeoptionlist[i].score = 0;
        var graderlist = gradeoptionlist[i].graderlist;
        for (var j = 0; j < graderlist.length; j++) {

          if(this.Base.getMyData().memberinfo!=null&&this.Base.getMyData().memberinfo!=undefined){
          if (graderlist[j].member_id == this.Base.getMyData().memberinfo.id) {
            num++
            gradeoptionlist[i].score = graderlist[j].grade
          }
        }
          zon++
        }

      }
 
      this.Base.setMyData({
        info: gradeinfo,
        dx: gradeinfo.duoxuan_value,
        //dxnum: gradeinfo.num,
        gradeoptionlist: gradeoptionlist,
        num,
        zon,
        zonfen
      });
      wx.hideLoading();

    })
  }

  onShareAppMessage(e) {
    var that = this;
    var fenxiangtu = this.Base.getMyData().res.fenxiangtu;
    return {
      title: this.Base.getMyData().memberinfo.nickName + "邀请您参加评审\n" + "【" + this.Base.getMyData().info.theme + "】",
      path: '/pages/scoredetail/scoredetail?id=' + this.Base.getMyData().infoid,
      imageUrl: "https://alioss.app-link.org/alucard263096/review/resource/" + fenxiangtu 
    };

  }

  shuaxin(e) {
    this.onMyShow();
  }
  bindinput(e) {
    var that = this;
    var index = e.currentTarget.id;
    var number = e.detail.value;
    var dimension = this.Base.getMyData().info.dimension;
    var gradeoptionlist = this.Base.getMyData().gradeoptionlist;
    var maxnum = 0;
    if (dimension == "A") {
      maxnum = 2
    }
    if (dimension == "B") {
      maxnum = 3
    }
    if (dimension == "C") {
      maxnum = 5
    }
    if (dimension == "D") {
      maxnum = 10
    }
    if (dimension == "E") {
      maxnum = 100
    }

    console.log(dimension);
    // return;
    //  var zz=/^([1-5])$/;


    if ((0 < number && number <= maxnum) || number == undefined || number == "") {
      console.log('正确')

      if (number == "") {
        gradeoptionlist[index].score = 0;
      } else {
        gradeoptionlist[index].score = e.detail.value;
      }

      this.Base.setMyData({
        gradeoptionlist: gradeoptionlist
      })
    } else {
      console.log('错误')
      wx.showModal({
        title: '提示',
        content: '评分值超出范围,请重新输入',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#2699EC',
        success: function(res) {
          if (res.confirm) {
            gradeoptionlist[index].score = 0;

            that.Base.setMyData({
              gradeoptionlist: gradeoptionlist
            })
          }
        }
      })

    }




  }

  niming(e) {
    this.Base.setMyData({
      niming: e.detail.value
    })
  }


  bindcheck(e) {
    var dx = this.Base.getMyData().dx;
    //var dxnum = this.Base.getMyData().dxnum;
    //console.log(dx, dxnum);

    // return;
    var index = e.currentTarget.dataset.index;

    var id = e.currentTarget.id;

    var gradeoptionlist = this.Base.getMyData().gradeoptionlist;

    if (dx == 'A') {
      for (var i = 0; i < gradeoptionlist.length; i++) {
        gradeoptionlist[i].check = false;
      }
    }

    gradeoptionlist[index].check = true;

    this.Base.setMyData({
      gradeoptionlist,
      id: id
    })


  }

  bindnocheck(e) {
    var index = e.currentTarget.dataset.index;
    var gradeoptionlist = this.Base.getMyData().gradeoptionlist;

    gradeoptionlist[index].check = false;

    this.Base.setMyData({
      gradeoptionlist
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
    //var dxnum = this.Base.getMyData().dxnum;
    console.log(dx)
    // return;

    var gradeoptionlist = this.Base.getMyData().gradeoptionlist;
    var id = this.Base.getMyData().id;
    var gradeapi = new GradeApi();
    var instapi = new InstApi();
    var xz = 0;
    var membername = this.Base.getMyData().membername;
    var info = this.Base.getMyData().info;

    gradeapi.gradeinfo({
      id: this.Base.getMyData().infoid
    }, (gradeinfo) => {

      if (gradeinfo.gradestatus != "A") {
        this.Base.info("评分已结束，无法投票");
        wx.showModal({
          title: '提示',
          content: '评分已结束，无法投票',
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
      } else if (gradeinfo.status != "A") {
        wx.showModal({
          title: '提示',
          content: '评分已被删除，无法投票',
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


    if (nm == false) {
      var nm = 'N';
    } else {
      var nm = 'Y'
    }


    for (var j = 0; j < gradeoptionlist.length; j++) {
      if (gradeoptionlist[j].score != "") {
        xz++
      }
    }

    if (dx == 'N' && xz != gradeoptionlist.length) {
      this.Base.info('请确认所有选项都已进行评分')
      return;
    }
    if (dx == "Y" && xz == 0) {
      this.Base.info('请至少对一个选项进行评分')
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
          content: '确认评分？',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#EE2222',
          confirmText: '确定',
          confirmColor: '#2699EC',
          success: function(res) {
            if (res.confirm) {
 
              var zonlist=[];
              for (var i = 0; i < gradeoptionlist.length; i++) {

                var oplist = {
                  grade_id: that.Base.getMyData().info.id,
                  membername: membername,
                  member_id:that.Base.getMyData().memberinfo.id,
                  gradeoption_id: gradeoptionlist[i].id,
                  grade: gradeoptionlist[i].score,
                  status: "A"
                };

                zonlist.push(oplist);
                 
              }

              var datajson=JSON.stringify(zonlist);
              that.tijiao(datajson); 
 
              gradeapi.addmygrade({
                member_id: that.Base.getMyData().memberinfo.id,
                grade_id: that.Base.getMyData().infoid,
                status: "A"
              }, (addmygrade) => {
                wx.hideLoading();
              })
            }
          }
        })



      },
      //       fail(res) { 

      //       }
    })



  }

 

  tijiao(datajson) {
    var that=this;
    var gradeapi = new GradeApi();

    gradeapi.addgrader({datajson:datajson}, (ret) => {
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
      url: '/pages/newscore/newscore?id=' + this.Base.getMyData().infoid,
    })
  }
  bindend(e) {
    var gradeapi = new GradeApi();
    var id = e.currentTarget.id;
    var that = this;
    wx.showModal({
      title: '提交',
      content: '确认结束评分？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#EE2222',
      confirmText: '确定',
      confirmColor: '#2699EC',
      success: function(res) {
        if (res.confirm) {
          gradeapi.updategradestatus({
            id: id
          }, (updategradestatus) => {

            that.onMyShow();
          })
        }
      }
    })

  }

  binddelete(e) {
    var gradeapi = new GradeApi();
    var id = e.currentTarget.id;
    var that = this;
    console.log(id, '来来来')

    wx.showModal({
      title: '提交',
      content: '确认删除评分？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#EE2222',
      confirmText: '确定',
      confirmColor: '#2699EC',
      success: function(res) {
        if (res.confirm) {
          gradeapi.deleltegrade({
            id: id
          }, (deleltegrade) => {
            wx.navigateBack({})
            // this.Base.setMyData({ deleltegrade})
          })
        }
      }
    })
  }

  dataexport() {
    var that = this;
    if(this.Base.getMyData().info.gradestatus=="A"){
      wx.showToast({
        title: '评分暂未结束，无法查看',
        icon: 'none'
      })
      return;
    }
    var api = ApiConfig.GetApiUrl() + "export/grade?grade_id=" + this.Base.options.id;
     
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

body.binddelete = content.binddelete;
body.bindend = content.bindend;

body.bindname = content.bindname;
body.setname = content.setname;

body.niming = content.niming;
body.bindinput = content.bindinput;

body.submit = content.submit;
body.tijiao = content.tijiao;

body.toadd = content.toadd;
body.toupdate = content.toupdate;

body.shuaxin = content.shuaxin;

body.bindcheck = content.bindcheck;

body.bindnocheck = content.bindnocheck;
body.dataexport = content.dataexport;

Page(body)