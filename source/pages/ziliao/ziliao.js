// pages/mine/mine.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { MemberApi } from "../../apis/member.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  
  }

  
  onMyShow() {
    wx.setNavigationBarTitle({
      title: '个人资料',
    })
    var that = this;
    this.Base.setMyData({
      name: this.Base.getMyData().memberinfo.name,
      picker: ['男', '女', '保密'],
      index: this.Base.getMyData().memberinfo.gender,

      shouji: this.Base.getMyData().memberinfo.mobile,

      danwei: this.Base.getMyData().memberinfo.danwei,

      zhichen: this.Base.getMyData().memberinfo.zhichen,

      zhiwu: this.Base.getMyData().memberinfo.zhiwu,

      zhuanye: this.Base.getMyData().memberinfo.zhuanye,


    })
  }

  lianxikefu() {

    var instinfo = this.Base.getMyData().instinfo;
    console.log(instinfo);
    wx.showActionSheet({
      itemList: ["拨打电话"],
      success(e) {
        if (e.tapIndex == 0) {
          wx.makePhoneCall({
            phoneNumber: instinfo.instmobile
          })
        }
      }
    })


  }
  PickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  }
  danwei(e){

    this.Base.setMyData({
      danwei: e.detail.value
    })
  }
  zhuanye(e) {

    this.Base.setMyData({
      zhuanye: e.detail.value
    })
  }
  zhiwu(e) {

    this.Base.setMyData({
      zhiwu: e.detail.value
    })
  }
  zhichen(e) {

    this.Base.setMyData({
      zhichen: e.detail.value
    })
  }
  name(e) {

    this.Base.setMyData({
      name: e.detail.value
    })
  }

  // getPhoneNumber(e) {
  //   this.Base.getPhoneNo(e);
 
  // }
   
  tijiao() {
    var name = this.Base.getMyData().name;
    var xinbie = this.Base.getMyData().index;
    var danwei = this.Base.getMyData().danwei;
    var zhichen = this.Base.getMyData().zhichen;
  
    var zhiwu = this.Base.getMyData().zhiwu;
    var zhuanye = this.Base.getMyData().zhuanye;
    var json = {
      id: this.Base.getMyData().memberinfo.id, 
      name: name,
      gender: xinbie,
      danwei: danwei,
      zhichen: zhichen,
      zhiwu: zhiwu,
      zhuanye:zhuanye
    }

    var api = new MemberApi;
    api.xiugai(json, (ret) => {
      console.log(ret)
      if (ret.code = "0") {
        wx.showToast({
          title: '修改成功',
          icon: 'none',
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/my/my',
          })
        }, 2000)

      }
    })

  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.lianxikefu = content.lianxikefu;
body.danwei = content.danwei;
body.zhichen = content.zhichen;
body.zhiwu = content.zhiwu;
body.zhuanye = content.zhuanye;
body.PickerChange = content.PickerChange;
body.phonenoCallback = content.phonenoCallback;
body.getPhoneNumber = content.getPhoneNumber;
body.tijiao = content.tijiao;
body.name = content.name;
Page(body)