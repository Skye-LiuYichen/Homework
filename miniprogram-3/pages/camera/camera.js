// pages/camera/camera.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backFront:true
  },

  switchCamera: function(e){
    var old = this.data.backFront
    this.setData({
      backFront: !old
    })
  },
  /**
   * 拍照
   */
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        // console.log(res);
        var pages = getCurrentPages();
        var prepage = pages[pages.length-2];
        prepage.setData({
          avatar: res.tempImagePath,
          phType: false
        })
        wx.navigateBack({});
      }
    })
  },
})