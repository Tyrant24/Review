export class ApiConfig {

  static GetApiUrl() { 
    return "https://api.wujunpla.net/api/"; 
  }
  static GetUploadPath() { 
    return "http://review-1301290517.cos.ap-guangzhou.myqcloud.com/"; 
  }
  static GetFileUploadAPI() {
    return "https://api.wujunpla.net/fileupload"; 
  }


  // static GetApiUrl() {
     
  // return "https://cmsdev.app-link.org/alucard263096/review/api/";
  // }
  // static GetUploadPath() {
  // return "https://alioss.app-link.org/alucard263096/review/";
 
  // }
  // static GetFileUploadAPI() {
  //  return "https://cmsdev.app-link.org/alucard263096/review/fileupload"; 
  // }

  static GetHeader() {
    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'UNICODE': ApiConfig.UNICODE,
      'TOKEN': ApiConfig.TOKEN
    };
    return headers;
  }
  static UNICODE = "";
  static SetUnicode(unicode) {
    ApiConfig.UNICODE = unicode;
  }
  static TOKEN = "";
  static SetToken(token) {
    ApiConfig.TOKEN = token;
  }

  static showLoadingCounter = 0;
  static ShowLoading = function () {
    return;
    if (ApiConfig.showLoadingCounter == 0) {
      wx.showLoading({
        title: '加载中',
      });
    }
    ApiConfig.showLoadingCounter = ApiConfig.showLoadingCounter + 1;
  }

  static CloseLoading = function () {
    return;
    ApiConfig.showLoadingCounter = ApiConfig.showLoadingCounter - 1;
    if (ApiConfig.showLoadingCounter == 0) {
      console.log(ApiConfig.showLoadingCounter);
      wx.hideLoading();
    }
  }




}