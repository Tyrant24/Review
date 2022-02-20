// pages/problem/problem.js
import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  setPageTitle() {
    wx.setNavigationBarTitle({
      title: "常见问题",
    })
  }
  onMyShow() {
    var that = this;
    var instapi=new InstApi();
    instapi.problem({}, (problem)=>{
      this.Base.setMyData({ problem})
    })
  }
  toadd() {
    if (this.Base.getMyData().memberinfo == null) {
      wx.redirectTo({
        url: '/pages/auth/auth',
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/addedvote/addedvote',
    })
  }
  toast() {
    wx.showToast({
      title: '暂未开放',
      icon: 'none'
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;

body.toadd = content.toadd;
body.toast = content.toast;

Page(body)