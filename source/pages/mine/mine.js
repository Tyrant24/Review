// pages/mine/mine.js
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
  
  onMyShow() {
    var that = this;
     
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
 
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.lianxikefu = content.lianxikefu;
Page(body)