// pages/aboutus/aboutus.js 
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";

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
    wx.setNavigationBarTitle({
      title: '我的资料',
    })
    var api = new InstApi();
    api.aboutus({}, (aboutus)=>{
      this.Base.setMyData({ aboutus});
    })
  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;

 


Page(body)