import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";
// import {
//   MemberApi
// } from "../../apis/member.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.needauth = true;
  }
  onMyShow() {
    var that = this;
  }
  checkPermission() {

  }

  getUserInfo(e) {
    console.log(666666666);
    AppBase.UserInfo.openid = undefined;

    wx.reLaunch({
      url: '/pages/home/home',
    }); 
    
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.getUserInfo = content.getUserInfo;
Page(body)