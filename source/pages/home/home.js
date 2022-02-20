// pages/content/content.js
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

    var a=3;
    var a2=4;
    
    var b=parseFloat('0.'+a);
    
    var b2=parseFloat('0.'+a2);
    

    console.log(b+b2,b,b2,'整挺好')
  
  }
 
  
  toadd() {
    // if (this.Base.getMyData().memberinfo == null) {
    //   AppBase.UserInfo.openid = undefined;
    //   return;
    // }
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
body.getUserInfo = content.getUserInfo;
body.toadd = content.toadd;
body.toast = content.toast;

Page(body)