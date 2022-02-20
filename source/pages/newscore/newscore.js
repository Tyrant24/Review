// pages/newscore/newscore.js 

import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { GradeApi } from "../../apis/grade.api.js";

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
      list, time: '1小时', xianzhi: 'Y', niming: 'N', zhuti: '', miaoshu: '', shuliang: 1, shu: 1, type: '3600', duoxuan: "N",yunxu: 'N',
      kejian:'N', dsntype: 'E', dsnname: '百分制', jijie: 'A', jijiename: '平均得分法',  
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
      { type: '259200', time: '3天' }],

      dimensionlist: [{ dsntype: 'A', name: '两分制' },
        { dsntype: 'B', name: '三分制' },
        { dsntype: 'C', name: '五分制' },
        { dsntype: 'D', name: '十分制' },
        { dsntype: 'E', name: '百分制' }],

      jijielist: [{ jijie: 'A', jijiename: '平均得分法' },
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
    var gradeapi = new GradeApi();
    var num = this.Base.getMyData().num;
    var list = this.Base.getMyData().list;

    gradeapi.gradeinfo({
      id: this.Base.options.id
    }, (gradeinfo) => {
      var gradeoptionlist = gradeinfo.gradeoptionlist;

      for (var i = 0; i < gradeoptionlist.length; i++) {
        num++
        list.push({ id: num, name: gradeoptionlist[i].content, img: gradeoptionlist[i].img });
        this.Base.setMyData({ num })
      }
 
      console.log(list, '列表')

      this.Base.setMyData({ gradeinfo, list, zhuti: gradeinfo.theme, miaoshu: gradeinfo.describe,yunxu:gradeinfo.yunxu_value,
        kejian:gradeinfo.kejian_value, photo: gradeinfo.img, time: gradeinfo.deadline_name, type: gradeinfo.deadline,  duoxuan: gradeinfo.duoxuan_value, dsnname: gradeinfo.dimension_name, dsntype: gradeinfo.dimension, jijiename: gradeinfo.jijie_name, jijie: gradeinfo.jijie,niming: gradeinfo.niming_value, xianzhi: gradeinfo.xianzhi_value })

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

  binddimension(e){
    var that = this;
    var dimensionlist = this.Base.getMyData().dimensionlist;
    
    this.Base.setMyData({
      dsnname: dimensionlist[e.detail.value].name, dsntype: dimensionlist[e.detail.value].dsntype
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
    this.Base.uploadOneImage("grade", (ret) => {

      that.Base.setMyData({
        photo: ret
      });

    }, undefined);
  }

  avatar(e) {
    var that = this;
    var id = e.currentTarget.id;
    var list = this.Base.getMyData().list;
    this.Base.uploadOneImage("gradeoption", (ret) => { 
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
      //var yunxu='N'
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

    var gradeapi = new GradeApi();

    var zhuti = this.Base.getMyData().zhuti;
    var miaoshu = this.Base.getMyData().miaoshu;
    var photo = this.Base.getMyData().photo;
    var niming = this.Base.getMyData().niming;
    var yunxu = this.Base.getMyData().yunxu;
    var kejian = this.Base.getMyData().kejian;
    var xianzhi = this.Base.getMyData().xianzhi;
    var type = this.Base.getMyData().type; 
    var duoxuan = this.Base.getMyData().duoxuan;
    var dsntype = this.Base.getMyData().dsntype;
    var jijie = this.Base.getMyData().jijie;
    //return;



    var list = this.Base.getMyData().list;

    if (zhuti == "") {
      this.Base.info("请填写评分主题");
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
    // return;
    var tmplids = ['-UNxDLpJPR8KZ28jW5p86WDRL5sgpCQJ929TrkGmqo4'];
    wx.requestSubscribeMessage({
      tmplIds: tmplids,
      success(res) {
        var tmp = res[tmplids];
        wx.showModal({
          title: '创建评分',
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

              gradeapi.addgrade({
                theme: zhuti,
                describe: miaoshu,
                dimension: dsntype,
                deadline: type,
                open_id: that.Base.getMyData().memberinfo.openid,
                member_name: that.Base.getMyData().memberinfo.nickName,
                duoxuan: duoxuan,
                mobile: that.Base.getMyData().memberinfo.mobile,
                jijie: jijie,
                niming: niming,
                yunxu:yunxu,
                kejian:kejian,
                xianzhi: xianzhi,
                img: photo,
                gradestatus: 'A',
                status: 'A'
              }, (addgrade) => {

                for (var i = 0; i < list.length; i++) {

                  var vlist = {
                    grade_id: addgrade.return,
                    content: list[i].name,
                    img: list[i].img,
                    status: "A"
                  };
                  that.add(vlist, i, list.length, addgrade.return);
                }
 
              })


            }
          }
        })
        
      }
    })




  }

  add(json, i, length, gradeid) {
    var gradeapi = new GradeApi();

    setTimeout(() => {
      gradeapi.addgradeoption(json, (addgradeoption) => {
        this.Base.setMyData({
          addgradeoption
        })
      })

      if (i + 1 == length) {
        wx.hideLoading();

        if (this.Base.options.id != "" && this.Base.options.id != undefined) {
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1];   //当前页面
          var prevPage = pages[pages.length - 2];  //上一个页面 
          prevPage.setData({
            infoid: gradeid
          })
          wx.navigateBack({
          })
        }else{
          wx.reLaunch({
            url: '/pages/scoredetail/scoredetail?id=' + gradeid,
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
    this.Base.setMyData({ shu })

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
    this.Base.setMyData({ shu })
  }


}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.avatar = content.avatar;


body.duoxuan = content.duoxuan;
body.niming = content.niming;
body.yunxu = content.yunxu;
body.kejian = content.kejian;
body.xianzhi = content.xianzhi;

body.jian = content.jian;
body.jia = content.jia;

body.zhuti = content.zhuti;
body.miaoshu = content.miaoshu;

body.copy = content.copy;

body.avatarmiaoshu = content.avatarmiaoshu;

body.addmore = content.addmore;
body.deleted = content.deleted;
body.input = content.input;

body.bindtime = content.bindtime; 
body.binddimension = content.binddimension; 
body.bindjijie = content.bindjijie;

body.submit = content.submit;
body.add = content.add;
Page(body)