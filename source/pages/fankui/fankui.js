// pages/fankui/fankui.js 
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
    this.Base.setMyData({ lianxi:""})
  }
  onMyShow() {
    wx.setNavigationBarTitle({
      title: '我的资料',
    })
    var that = this;
  }
  bindinput(e) {
    this.Base.setMyData({
      content: e.detail.value
    })
  } 
  bindlianxi(e) {
    this.Base.setMyData({
      lianxi: e.detail.value
    })
  }
  submit(e) {
    var content = this.Base.getMyData().content;
    var lianxi = this.Base.getMyData().lianxi;
    console.log(content);
    var api = new InstApi();

    if (content == "" || content==null){
      this.Base.info('请填写您的反馈意见');
      return;
    }
    api.addfankui({
      member_id: this.Base.getMyData().memberinfo.id,
      lianxi: lianxi,
      content: content,
      status: 'A'
    }, (addfankui) => {

      wx.showToast({
        title: '意见提交成功',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack({})
      }, 1000)

    


  
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;

body.submit = content.submit;

body.bindinput = content.bindinput;

body.bindlianxi = content.bindlianxi;

Page(body)