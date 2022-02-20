// pages/newscore/newscore.js 

import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { RankApi } from "../../apis/rank.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=11;
    super.onLoad(options);
    var list = [];

    if (options.id != "" && options.id != undefined) {
      this.Base.setMyData({ num: 0 })
    }
    else {
      this.Base.setMyData({ num: 2 });

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
      list, time: '1小时', xianzhi: 'Y',tishi4:false,mowei:'N', niming: 'N', zhuti: '', miaoshu: '', shuliang: 2, minshu:2,shu: 2, type: '3600', duoxuan: "N",yunxu: 'N',
      kejian:'N', jijie: 'A', jijiename: '平均排名法',tishi:false,
      jiezhi: [{ type: '300', time: '5分钟' },
      { type: '600', time: '10分钟' },
      { type: '900', time: '15分钟' },
      { type: '1800', time: '30分钟' },
      { type: '3600', time: '1小时' },
      { type: '7200', time: '2小时' },
      { type: '21600', time: '6小时' },
      { type: '43200', time: '12小时' },
      { type: '86400', time: '1天' },
      { type: '172800', time: '2天' },
      { type: '259200', time: '3天' },],
      
      jijielist: [{ jijie: 'A', jijiename: '平均排名法' },
        { jijie: 'B', jijiename: '信用加权法' }]
    })

    if (this.Base.options.id != "" && this.Base.options.id != undefined) {
      this.copy();
    }
  }
  onMyShow() {
    var that = this;
    
  }


  copy() {
    var that = this;
    var rankapi = new RankApi();
    var num = this.Base.getMyData().num;
    var list = this.Base.getMyData().list;

    rankapi.rankinginfo({
      id: this.Base.options.id
    }, (rankinginfo) => {
      var rankoptionlist = rankinginfo.rankoptionlist;

      for (var i = 0; i < rankoptionlist.length; i++) {
        num++
        list.push({ id: num, name: rankoptionlist[i].content, img: rankoptionlist[i].img });
        this.Base.setMyData({ num })
      }

      console.log(list, '列表')

      this.Base.setMyData({ rankinginfo, list, zhuti: rankinginfo.theme,yunxu:rankinginfo.yunxu_value,shu:rankinginfo.maxnum,minshu:rankinginfo.minnum,
        kejian:rankinginfo.kejian_value,mowei:rankinginfo.mowei_value, miaoshu: rankinginfo.describe, photo: rankinginfo.img, time: rankinginfo.deadline_name, type: rankinginfo.deadline, jijiename: rankinginfo.jijie_name, jijie: rankinginfo.jijie, duoxuan: rankinginfo.duoxuan_value ,niming: rankinginfo.niming_value, xianzhi: rankinginfo.xianzhi_value })

    })
  }


  addmore(e) { //新增更多选项
    var num = this.Base.getMyData().num;
    var list = this.Base.getMyData().list;
    num++

    list.push({ id: num, name: '', img: '' })

    this.Base.setMyData({ list, num })

  }

  bindtime(e) { //选择时间段
    var that = this;
    var jiezhi = this.Base.getMyData().jiezhi;
    console.log(jiezhi[e.detail.value].time, jiezhi)
    // return
    this.Base.setMyData({
      time: jiezhi[e.detail.value].time, type: jiezhi[e.detail.value].type
    })
  }

  bindjijie(e) {
    var that = this;
    var jijielist = this.Base.getMyData().jijielist;

    this.Base.setMyData({
      jijie: jijielist[e.detail.value].jijie, jijiename: jijielist[e.detail.value].jijiename
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
      this.Base.setMyData({ list })
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

    this.Base.setMyData({ list })

  }

  avatarmiaoshu(e) { //添加描述图片
    var that = this;
    this.Base.uploadOneImage("ranking", (ret) => {

      that.Base.setMyData({
        photo: ret
      });

    }, undefined);
  }

  avatar(e) {
    var that = this;
    var id = e.currentTarget.id;
    var list = this.Base.getMyData().list;
    this.Base.uploadOneImage("rankoption", (ret) => {
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
      duoxuan: duoxuan
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
     // var kejian='Y'
    }
    this.Base.setMyData({
      yunxu: yunxu,kejian:kejian
    })

  }

  mowei(e){
    if (e.detail.value == true) {
      var mowei = 'Y'
    } else {
      var mowei = 'N'
    }
    this.Base.setMyData({
      mowei: mowei
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
    console.log(e, 'll')
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
    this.Base.setMyData({ zhuti: e.detail.value })
  }

  miaoshu(e) {
    this.Base.setMyData({ miaoshu: e.detail.value })
  }

  submit(e) {
    var that = this;

    if (this.Base.getMyData().memberinfo == null || this.Base.getMyData().memberinfo == undefined) {
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

    var rankapi = new RankApi();

    var zhuti = this.Base.getMyData().zhuti;
    var miaoshu = this.Base.getMyData().miaoshu;
    var photo = this.Base.getMyData().photo;
    var niming = this.Base.getMyData().niming;
    var yunxu = this.Base.getMyData().yunxu;
    var kejian = this.Base.getMyData().kejian;
    var mowei = this.Base.getMyData().mowei;
    var xianzhi = this.Base.getMyData().xianzhi;
    var type = this.Base.getMyData().type;
    var duoxuan = this.Base.getMyData().duoxuan; 
    var jijie = this.Base.getMyData().jijie;
    var list = this.Base.getMyData().list;

    
    if (duoxuan == "N") {
      var shu = 2,
      minshu=2
    } else {
      var shu = this.Base.getMyData().shu;
      var minshu = this.Base.getMyData().minshu;
    }
 
    if (zhuti == "") {
      this.Base.info("请填写排名主题");
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
          title: '创建排名',
          content: '您提交的内容我们将进行审核，请确保未涉及色情、赌博等违法有害信息!',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#EE2222',
          confirmText: '确定',
          confirmColor: '#2699EC',
          success: function (res) {
            if (res.confirm) {

              wx.showLoading({
                title: '提交中',
                mask: true
              })

              rankapi.addranking({
                theme: zhuti,
                describe: miaoshu,
                deadline: type,
                duoxuan: duoxuan,
                minnum:minshu,
                maxnum:shu,
                jijie: jijie,
                open_id: that.Base.getMyData().memberinfo.openid,
                member_name: that.Base.getMyData().memberinfo.nickName,
                mobile: that.Base.getMyData().memberinfo.mobile,
                niming: niming,
                yunxu:yunxu,
                mowei:mowei,
                kejian:kejian,
                xianzhi: xianzhi,
                img: photo,
                rankingstatus: 'A',
                status: 'A'
              }, (addranking) => {

                for (var i = 0; i < list.length; i++) {

                  var vlist = {
                    ranking_id: addranking.return,
                    content: list[i].name,
                    img: list[i].img,
                    status: "A"
                  };
                  that.add(vlist, i, list.length, addranking.return);
                }
 
              })


            }
          }
        })

      }
    })





  }

  add(json, i, length, rankid) {
    var rankapi = new RankApi();

    setTimeout(() => {
      rankapi.addrankoption(json, (addrankoption) => {
        this.Base.setMyData({
          addrankoption
        })
      })

      if (i + 1 == length) {
        wx.hideLoading();

        console.log(this.Base.options.id,"看看")

        if (this.Base.options.id != "" && this.Base.options.id != undefined) {
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1];   //当前页面
          var prevPage = pages[pages.length - 2];  //上一个页面 
          prevPage.setData({
            infoid: rankid
          })

          console.log(this.Base.options.id, "噢噢哦看看")

          wx.navigateBack({
          })
        } else {
          console.log(this.Base.options.id, "偶记")

          wx.reLaunch({
            url: '/pages/rankingdetail/rankingdetail?id=' + rankid,
          })
        }
      }

    }, i * 300);
  }

 
  tishi() {
    this.Base.setMyData({ tishi: true })
  }

  tishi4(){
    this.Base.setMyData({ tishi4: true })
  }
  // close() {
  //   this.Base.setMyData({ tishi: false })
  // }

  jian(e) {
    var shuliang = this.Base.getMyData().shuliang;
    var shu = this.Base.getMyData().shu;

    if (shu < 3) {
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

    if (shu < shuliang - 2) {
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
    if (minshu < 3) {
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

    if (minshu < shuliang - 2&&minshu<=shu-1) {
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

body.tishi = content.tishi;
body.tishi4 = content.tishi4;
//body.close = content.close;

body.duoxuan = content.duoxuan;
body.niming = content.niming;
body.yunxu = content.yunxu;
body.kejian = content.kejian;
body.xianzhi = content.xianzhi;
body.mowei = content.mowei;
  
body.zhuti = content.zhuti;
body.miaoshu = content.miaoshu;

body.jian = content.jian;
body.jia = content.jia;
body.minjian = content.minjian;
body.minjia = content.minjia;

body.copy = content.copy;

body.avatarmiaoshu = content.avatarmiaoshu;

body.addmore = content.addmore;
body.deleted = content.deleted;
body.input = content.input;

body.bindtime = content.bindtime;
body.bindjijie = content.bindjijie;

body.submit = content.submit;
body.add = content.add;
Page(body)