// pages/addedvote/addedvote.js 
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

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=11;
    super.onLoad(options);
    var list = [];

    console.log(this.Base.options.id, "看看这个ID")
    if (this.Base.options.id != "" && this.Base.options.id != undefined) {
      this.Base.setMyData({
        num: 0
      })
      console.log("啊啊啊")
    } else {
      this.Base.setMyData({
        num: 2
      });
      console.log("哦哦哦")
      list.push({
        id: 1,
        name: '',
        img: ''
      }, {
        id: 2,
        name: '',
        img: ''
      })
    }
    this.Base.setMyData({
      list,
      time: '1小时',
      check: 'A',
      checkname: '至少选',
      xianzhi: 'Y',
      niming: 'N',
      yunxu: 'N',
      kejian:'N',
      zhuti: '',
      miaoshu: '',
      shuliang: 1,
      shu: 1,
      minshu:1,
      type: '3600',
      checklist: [{
          check: 'B',
          name: '至少选'
        },
        {
          check: 'C',
          name: '最多选'
        },
        {
          check: 'D',
          name: '必须选'
        }
      ],
      jiezhi: [{
          type: '300',
          time: '5分钟'
        },
        {
          type: '600',
          time: '10分钟'
        },
        {
          type: '900',
          time: '15分钟'
        },
        {
          type: '1800',
          time: '30分钟'
        },
        {
          type: '3600',
          time: '1小时'
        },
        {
          type: '7200',
          time: '2小时'
        },
        {
          type: '21600',
          time: '6小时'
        },
        {
          type: '43200',
          time: '12小时'
        },
        {
          type: '86400',
          time: '1天'
        },
        {
          type: '172800',
          time: '2天'
        },
        {
          type: '259200',
          time: '3天'
        },
      ]
    })


    if (this.Base.options.id != "" && this.Base.options.id != undefined) {
      console.log('离开家')
      //return;
      this.copy();
    }
  }
  onMyShow() {
    var that = this;

  }


  copy() {
    var that = this;
    var voteapi = new VoteApi();
    var num = this.Base.getMyData().num;
    var list = this.Base.getMyData().list;

    voteapi.voteinfo({
      id: this.Base.options.id
    }, (voteinfo) => {
      var optionlist = voteinfo.optionlist;

      for (var i = 0; i < optionlist.length; i++) {
        num++
        list.push({
          id: num,
          name: optionlist[i].content,
          img: optionlist[i].img
        });
        this.Base.setMyData({
          num
        })
      }

      if (voteinfo.duoxuan == "A") {
        this.Base.setMyData({
          duoxuan: 'N',
          shu: 1,
          minshu:1
        })
      } else {
        this.Base.setMyData({
          duoxuan: 'Y',
          check: voteinfo.duoxuan,
          checkname: voteinfo.duoxuan_name,
          shu: voteinfo.num,
          minshu: voteinfo.minnum
        })
      }

      console.log(list, '列表')

      this.Base.setMyData({
        voteinfo,
        list,
        zhuti: voteinfo.theme,
        miaoshu: voteinfo.describe,
        photo: voteinfo.img,
        time: voteinfo.deadline_name,
        type: voteinfo.deadline,
        niming: voteinfo.niming_value,
        yunxu:voteinfo.yunxu_value,
        kejian:voteinfo.kejian_value,
        xianzhi: voteinfo.xianzhi_value
      })

    })
  }

  deleteimg(e) {
    var that = this;
    var seq = e.currentTarget.id;
    var images = that.Base.getMyData().images;
    var imgs = [];
    for (var i = 0; i < images.length; i++) {
      if (seq != i) {
        imgs.push(images[i]);
      }
    }
    that.Base.setMyData({
      images: imgs
    });
  }

  addmore(e) { //新增更多选项
    var num = this.Base.getMyData().num;
    var list = this.Base.getMyData().list;
    num++

    list.push({
      id: num,
      name: '',
      img: ''
    })

    this.Base.setMyData({
      list,
      num
    })

  }

  bindtime(e) { //选择时间段
    var that = this;
    var jiezhi = this.Base.getMyData().jiezhi;
    console.log(jiezhi[e.detail.value].time, jiezhi)
    // return
    this.Base.setMyData({
      time: jiezhi[e.detail.value].time,
      type: jiezhi[e.detail.value].type
    })
  }

  bindcheck(e) { //允许多选状态选择
    var that = this;
    var checklist = this.Base.getMyData().checklist;

    // return
    this.Base.setMyData({
      checkname: checklist[e.detail.value].name,
      check: checklist[e.detail.value].check
    })
  }

  deleted(e) { //删除新增的选项
    var idx = e.currentTarget.id;
    console.log(idx, 'idx');
    //return;
    var list = this.Base.getMyData().list;
    if (list.length > 2) {


      for (var i = 0; i < list.length; i++) {
        if (list[i].id == idx) {
          list.splice(i, 1);
          break;
        }
      }
      //list.splice(idx, 1)
      this.Base.setMyData({
        list
      })
    } else {
      // this.Base.toast('ssss')
    }

  }

  input(e) { //给选项填充选项内容

    console.log(e);
    //return;
    var id = e.currentTarget.id;

    var list = this.Base.getMyData().list;

    list[id].name = e.detail.value;

    this.Base.setMyData({
      list
    })

  }

  avatarmiaoshu(e) { //添加描述图片
    var that = this;
    this.Base.uploadOneImage("vote", (ret) => {

      that.Base.setMyData({
        photo: ret
      });

    }, undefined);
  }

  avatar(e) {
    var that = this;
    var id = e.currentTarget.id;
    var list = this.Base.getMyData().list;
    this.Base.uploadOneImage("option", (ret) => {

      list[id].img = ret;

      that.Base.setMyData({
        list
      });

    }, undefined);
  }

  duoxuan(e) {
    console.log(e, 'll')
    if (e.detail.value == true) {
      var duoxuan = 'Y'
    } else {
      var duoxuan = 'N'
    }
    this.Base.setMyData({
      duoxuan: duoxuan,
      check: 'B',
      shu: 1,
      minshu: 1
    })

  }

  niming(e) {
    console.log(e, 'll')
    if (e.detail.value == true) {
      var niming = 'Y'
    } else {
      var niming = 'N'
    }
    this.Base.setMyData({
      niming: niming
    })

  }
  yunxu(e) { 
    if (e.detail.value == true) {
      var yunxu = 'Y';
      var kejian='N'
    } else {
      var yunxu = 'N';
      //var kejian='Y'
    }
    this.Base.setMyData({
      yunxu: yunxu,kejian:kejian
    })

  }
  kejian(e) { 
    if (e.detail.value == true) {
      var kejian = 'Y';
      var yunxu='N';
    } else {
      var kejian = 'N';
     // var yunxu='Y'
    }
    this.Base.setMyData({
      kejian: kejian,yunxu:yunxu
    })

  }

  xianzhi(e) { 
    if (e.detail.value == true) {
      var xianzhi = 'Y' 

    } else {
      var xianzhi = 'N'
    }
    this.Base.setMyData({
      xianzhi: xianzhi
    })

  }

  zhuti(e) {
    this.Base.setMyData({
      zhuti: e.detail.value
    })
  }

  miaoshu(e) {
    this.Base.setMyData({
      miaoshu: e.detail.value
    })
  }

  submit(e) {
    var that = this;
    var voteapi = new VoteApi();

    if (this.Base.getMyData().memberinfo == null || this.Base.getMyData().memberinfo ==undefined){
      wx.showModal({
        title: '提示',
        content: '您暂未授权无法创建评审，请先获取授权',
        showCancel: false,
        cancelText: '取消',
        cancelColor: '#EE2222',
        confirmText: '确定',
        confirmColor: '#2699EC',
        success: function (res) {
          if (res.confirm) {
             wx.reLaunch({
               url: '/pages/mine/mine',
             })
          }
        }
      })
      return;
    }

    var zhuti = this.Base.getMyData().zhuti;
    var miaoshu = this.Base.getMyData().miaoshu;
    var photo = this.Base.getMyData().photo;
    var niming = this.Base.getMyData().niming;
    var yunxu = this.Base.getMyData().yunxu;
    var kejian = this.Base.getMyData().kejian;
    var xianzhi = this.Base.getMyData().xianzhi;
    var type = this.Base.getMyData().type;
    console.log(type, "时间段");

    //return;
    //console.log(check,shu);

    if (this.Base.getMyData().duoxuan == "N") {
      var check = "A"
    } else {
      var check = this.Base.getMyData().check;
    }

    if (check == "A") {
      var shu = 1,
      minshu=1
    } else {
      var shu = this.Base.getMyData().shu;
      var minshu = this.Base.getMyData().minshu;
    }

    var list = this.Base.getMyData().list;

    if (zhuti == "") {
      this.Base.info("请填写投票主题");
      return;
    }

    for (var j = 0; j < list.length; j++) {
      if (list[j].name == "") {
        this.Base.info("请填写足够的选项内容");
        return;
      }
    }

    if (this.Base.getMyData().memberinfo.mobile == "") {
      this.Base.info("请先授权获取手机号码");
      return;
    }
    var tmplids = ['-UNxDLpJPR8KZ28jW5p86WDRL5sgpCQJ929TrkGmqo4'];
    wx.requestSubscribeMessage({
      tmplIds: tmplids,
      success(res) {
        var tmp = res[tmplids];
        wx.showModal({
          title: '创建投票',
          content: '您提交的内容我们将进行审核，请确保未涉及色情、赌博等违法有害信息!',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#EE2222',
          confirmText: '确定',
          confirmColor: '#2699EC',
          success: function(res) {
            if (res.confirm) {

              wx.showLoading({
                title: '提交中',
                mask: true
              })

              voteapi.addvote({
                theme: zhuti,
                describe: miaoshu,
                deadline: type,
                num: shu,
                minnum:minshu,
                types: that.Base.getMyData().checkname,
                open_id: that.Base.getMyData().memberinfo.openid,
                member_name: that.Base.getMyData().memberinfo.nickName,
                duoxuan: check,
                niming: niming,
                yunxu:yunxu,
                kejian:kejian,
                xianzhi: xianzhi,
                img: photo,
                mobile: that.Base.getMyData().memberinfo.mobile,
                votestatus: 'A',
                status: 'A'
              }, (addvote) => {

                for (var i = 0; i < list.length; i++) {

                  var vlist = {
                    vote_id: addvote.return,
                    content: list[i].name,
                    img: list[i].img,
                    status: "A"
                  };
                  that.add(vlist, i, list.length, addvote.return);
                }

              })

            }
          }
        })
      }
    })




  }



  add(json, i, length, voteid) {
    var voteapi = new VoteApi();

    setTimeout(() => {
      voteapi.addoption(json, (addoption) => {
        this.Base.setMyData({
          addoption
        })
      })

      if (i + 1 == length) {
        wx.hideLoading();

        // console.log(this.Base.options.id,"哦哦哦")

        if (this.Base.options.id != "" && this.Base.options.id != undefined) {

          // console.log('看了好久考虑')
          //return;
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1]; //当前页面
          var prevPage = pages[pages.length - 2]; //上一个页面 
          prevPage.setData({
            infoid: voteid
          })
          wx.navigateBack({})
        } else {
          //   console.log("UI与就i");
          //return;
          wx.reLaunch({
            url: '/pages/votedetail/votedetail?id=' + voteid,
          })
        }

      }

    }, i * 300);
  }

  jian(e) {
    var shuliang = this.Base.getMyData().shuliang;
    var shu = this.Base.getMyData().shu;

    if (shu < 2) {
      this.Base.toast('不能再少了')
    } else {
      shu--
    }
    this.Base.setMyData({
      shu
    })

  }
  jia(e) {
    var list = this.Base.getMyData().list;
    var shuliang = this.Base.getMyData().shuliang;
    var shu = this.Base.getMyData().shu;
    for (var i = 0; i < list.length; i++) {
      if (list[i].name != "") {
        shuliang++
      }
    }

    if (shu < shuliang - 1) {
      shu++
    } else {
      this.Base.toast('超过上限')
    }
    this.Base.setMyData({
      shu
    })
  }

  minjian(e) { 
    var minshu = this.Base.getMyData().minshu; 
    if (minshu < 2) {
      this.Base.toast('不能再少了'); 
    } else {
      minshu--
    }
    this.Base.setMyData({
      minshu
    })

  }
  minjia(e) {
    var list = this.Base.getMyData().list;
    var shuliang = this.Base.getMyData().shuliang;
    var shu = this.Base.getMyData().shu;
    var minshu = this.Base.getMyData().minshu;

    for (var i = 0; i < list.length; i++) {
      if (list[i].name != "") {
        shuliang++
      }
    }

    if (minshu < shuliang - 1&&minshu<=shu-1) {
      minshu++
    }else if(minshu>shu-1){
      this.Base.toast('不能大于最多选个数');
    } 
    else {
      this.Base.toast('超过上限');
    }
    this.Base.setMyData({
      minshu
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.avatar = content.avatar;
body.deleteimg = content.deleteimg;

body.duoxuan = content.duoxuan;
body.niming = content.niming;
body.yunxu = content.yunxu;
body.kejian = content.kejian;
body.xianzhi = content.xianzhi;

body.jian = content.jian;
body.jia = content.jia;
body.minjian = content.minjian;
body.minjia = content.minjia;

body.zhuti = content.zhuti;
body.miaoshu = content.miaoshu;

body.copy = content.copy;

body.avatarmiaoshu = content.avatarmiaoshu;

body.addmore = content.addmore;
body.deleted = content.deleted;
body.input = content.input;

body.bindtime = content.bindtime;
body.bindcheck = content.bindcheck;

body.submit = content.submit;
body.add = content.add;
Page(body)