// pages/rankingdetail/rankingdetail.js
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
  RankApi
} from "../../apis/rank.api.js";
import {
  ApiUtil
} from "../../apis/apiutil";

class Content extends AppBase {
  constructor() {
    super();
  }

  onLoad(options) {
    this.Base.Page = this;
    //options.id=50;
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
      title: "排名详情",
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

    var rankapi = new RankApi();
    var num = 0;
    var zon = 0;
    var paimingshu = 0;
    var paiminglist = [];

    rankapi.rankinginfo({
      id: this.Base.getMyData().infoid
    }, (rankinginfo) => {
      
      var a=0;
      rankinginfo.timeslot = ApiUtil.Timeslot(rankinginfo.dealline_realtime);
      console.log(rankinginfo, "看一次")

      var rankoptionlist = rankinginfo.rankoptionlist;

      for (var i = 0; i < rankoptionlist.length; i++) {
 
        if(rankoptionlist[i].avgr!='-'){
         a++;
        }

        if (rankinginfo.duoxuan_value == "Y") {
          rankoptionlist[i].check = false;
        } else {
          rankoptionlist[i].check = true;
          paimingshu++
          paiminglist.push({
            id: paimingshu
          });

        }

        rankoptionlist[i].number = 0;
        rankoptionlist[i].rankshow = 0;

        var rankpersonlist = rankoptionlist[i].rankpersonlist;

        for (var j = 0; j < rankpersonlist.length; j++) {

          if(this.Base.getMyData().memberinfo!=null&&this.Base.getMyData().memberinfo!=undefined){
            
          if (rankpersonlist[j].member_id == this.Base.getMyData().memberinfo.id) {
            num++
            rankoptionlist[i].myrank = rankpersonlist[j].rank
          }
        }

          zon++
        }

      }


      for (var j = 0; j < rankoptionlist.length; j++) {
 
        if(rankinginfo.jijie=='A'){

          if(rankoptionlist[j].avgr!='-'){

            rankoptionlist[j].bf=((a-(rankoptionlist[j].avgr-1))/a);
    
            console.log('辣鸡');
    
            }else{
              rankoptionlist[j].bf=0;
          }

        }else{

          if(rankoptionlist[j].rankresult!='-'){

            rankoptionlist[j].bf=((a-(rankoptionlist[j].rankresult-1))/a);
    
            console.log('辣鸡');
    
            }else{
              rankoptionlist[j].bf=0;
          }
          
        }


 
      }

       console.log(a,'总票数')

    

      if (rankinginfo.duoxuan_value == "N") {
        this.Base.setMyData({
          checked: true
        });
      } else {
        this.Base.setMyData({
          checked: false
        });
      }

      this.Base.setMyData({
        info: rankinginfo,
        dx: rankinginfo.duoxuan_value,
        dxmaxnum: rankinginfo.maxnum,
        dxminnum: rankinginfo.minnum,
        rankoptionlist: rankoptionlist,
        paimingshu,
        paiminglist,
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
      path: '/pages/rankingdetail/rankingdetail?id=' + this.Base.getMyData().infoid,
      imageUrl: "https://alioss.app-link.org/alucard263096/review/resource/" + fenxiangtu 
    };

  }
  shuaxin(e) {
    this.onMyShow();
  }
  bindpicker(e){
    console.log(e,'aa')
    var pickerid=e.currentTarget.dataset.num;
    this.Base.setMyData({ pickerid: pickerid})
  }
  bindinput(e) {
    var index = e.currentTarget.id;
    var number = e.currentTarget.dataset.number;
    var pickerid = this.Base.getMyData().pickerid;
    console.log(e.detail.value, 'kkkl', number)

    var paiminglist = this.Base.getMyData().paiminglist;

    var rankoptionlist = this.Base.getMyData().rankoptionlist;

    
 
    rankoptionlist[index].number = paiminglist[e.detail.value].id;
    rankoptionlist[index].rankshow = paiminglist[e.detail.value].id;

    if (pickerid > 0) {
      paiminglist.push({id: pickerid});
      console.log(rankoptionlist[index].number, '砰砰砰');
    }

    paiminglist.splice(e.detail.value, 1);
 

    this.Base.setMyData({
      rankoptionlist,
      paiminglist
    })

  }

  confirm(e) {
    var rankoptionlist = this.Base.getMyData().rankoptionlist;
    var dx=this.Base.getMyData().dx;
    var dxmaxnum = this.Base.getMyData().dxmaxnum;
    var dxminnum = this.Base.getMyData().dxminnum;
    var checked = this.Base.getMyData().checked;
    var paimingshu = 0;
    var paiminglist = [];

    console.log("第一个", this.Base.getMyData().id)
    for (var i = 0; i < rankoptionlist.length; i++) {
      if (rankoptionlist[i].check == true) {
        paimingshu++
        paiminglist.push({
          id: paimingshu
        });
      }
    }
    console.log("第二个", this.Base.getMyData().id)

    if (paimingshu < 2) {
      this.Base.info("请至少选择2个选项");
      return;
    }

    if (dx == 'N' && paimingshu < dxminnum) {
      this.Base.info('请至少选择2个选项')
      return;
    }

    if (dx == 'Y' && paimingshu < dxminnum) {
      this.Base.info('请至少选择' + dxminnum + '个选项')
      return;
    }
 
    if (dx == 'Y' && paimingshu > dxmaxnum) {
      this.Base.info('最多选择' + dxmaxnum + '个选项')
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
    var rankoptionlist = this.Base.getMyData().rankoptionlist;
    var paimingshu = 0;
    var paiminglist = [];
    for (var i = 0; i < rankoptionlist.length; i++) {
      rankoptionlist[i].number = 0;

      if (rankoptionlist[i].check == true) {
        paimingshu++
        paiminglist.push({
          id: paimingshu
        });
      }
    }
    this.Base.setMyData({
      paiminglist,
      rankoptionlist
    })
  }

  againcheck(e) {
    var rankoptionlist = this.Base.getMyData().rankoptionlist;
    for (var i = 0; i < rankoptionlist.length; i++) {
      rankoptionlist[i].number = 0; 
    }

    this.Base.setMyData({
      checked: false,
      paiminglist: [],
      paimingshu: 0,
      rankoptionlist
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

    var rankoptionlist = this.Base.getMyData().rankoptionlist;

    if (dx == 'A') {
      for (var i = 0; i < rankoptionlist.length; i++) {
        rankoptionlist[i].check = false;
      }
    }

    rankoptionlist[index].check = true;

    this.Base.setMyData({
      rankoptionlist,
      id: id
    })


  }

  bindnocheck(e) {
    var index = e.currentTarget.dataset.index;
    var rankoptionlist = this.Base.getMyData().rankoptionlist;

    rankoptionlist[index].check = false;

    this.Base.setMyData({
      rankoptionlist
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
    var paiminglist = this.Base.getMyData().paiminglist;
    var paimingshu=this.Base.getMyData().paimingshu;
    var info = this.Base.getMyData().info;
    var rankoptionlist = this.Base.getMyData().rankoptionlist;
    var rankapi = new RankApi();
    var instapi = new InstApi();
    var xz = 0;
    var membername = this.Base.getMyData().membername; 

  
    rankapi.rankinginfo({
      id: this.Base.getMyData().infoid
    }, (rankinginfo) => {

      if (rankinginfo.rankingstatus != "A") {
       
        wx.showModal({
          title: '提示',
          content: '排名已结束，无法投票',
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
         
      } else if (rankinginfo.status != "A") {
        wx.showModal({
          title: '提示',
          content: '排名已被删除，无法投票',
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


    for (var j = 0; j < rankoptionlist.length; j++) {
      if (rankoptionlist[j].score != "") {
        xz++
      }
      if (rankoptionlist[j].check == false&&info.mowei_value=='Y') {
        rankoptionlist[j].rankshow=paimingshu+1
      }
    }

    if (paiminglist.length != 0) {
      this.Base.info('请确认选项都已进行排名')
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
          content: '确认排名？',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#EE2222',
          confirmText: '确定',
          confirmColor: '#2699EC',
          success: function (res) {
            if (res.confirm) {
              var zonlist=[];
              for (var i = 0; i < rankoptionlist.length; i++) {
 
                var oplist = {
                  ranking_id: that.Base.getMyData().info.id,
                  membername: membername,
                  member_id:that.Base.getMyData().memberinfo.id,
                  rankoption_id: rankoptionlist[i].id,
                  rank: rankoptionlist[i].number,
                  rank_show:rankoptionlist[i].rankshow,
                  status: "A"
                };

                zonlist.push(oplist);
 
              }
              var datajson=JSON.stringify(zonlist);
              that.tijiao(datajson);
 
              rankapi.addmyranking({
                member_id: that.Base.getMyData().memberinfo.id,
                ranking_id: that.Base.getMyData().infoid,
                status: "A"
              }, (addmyranking) => {
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
    var rankapi = new RankApi();

    rankapi.addrankperson({datajson:datajson}, (ret) => {
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
      url: '/pages/newranking/newranking?id=' + this.Base.getMyData().infoid,
    })
  }
  bindend(e) {
    var rankapi = new RankApi();
    var id = e.currentTarget.id;
    var that = this;
    wx.showModal({
      title: '提交',
      content: '确认结束排名？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#EE2222',
      confirmText: '确定',
      confirmColor: '#2699EC',
      success: function(res) {
        if (res.confirm) {
          rankapi.updaterankstatus({
            id: id
          }, (updaterankstatus) => {
            that.Base.setMyData({
              updaterankstatus
            })
            that.onMyShow();
          })
        }
      }
    })

  }

  binddelete(e) {
    var rankapi = new RankApi();
    var id = e.currentTarget.id;
    var that = this;
    wx.showModal({
      title: '提交',
      content: '确认删除排名？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#EE2222',
      confirmText: '确定',
      confirmColor: '#2699EC',
      success: function(res) {
        if (res.confirm) {
          rankapi.deleterank({
            id: id
          }, (deleterank) => {

            wx.navigateBack({

            })

          })
        }
      }
    })
  }

  daochu() {
    var that = this;
    
    if(this.Base.getMyData().info.rankingstatus=="A"){
      wx.showToast({
        title: '排名暂未结束，无法查看',
        icon: 'none'
      })
      return;
    }
    var api = ApiConfig.GetApiUrl() + "export/ranking?rank_id=" + this.Base.options.id;

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