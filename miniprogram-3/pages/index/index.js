// index.js
Page({
  
  data:{
    phType:false,
    avatar:"/image/photo.jpg",
    imgPost:'',// 选择图像显示的源
    imgGot:'',// 获取图像显示的源
    message:''
  },

  bindToCamera(e){

    wx.navigateTo({
      url: '/pages/camera/camera',
    })
  },

  selectPhoto(e){
    var that = this;
		wx.chooseMedia({
			count: 1, // 最多可以选择的文件个数
			mediaType: ['image'], // 文件类型
			sizeType: ['original'], // 是否压缩所选文件
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success(result) {
				// console.log(result);
				that.setData({
          imgList: result.tempFiles,
          phType: true
				})
				// console.log(that.data.imgList);
			},

		})
  },

  chooseImage(e){
    var that = this;
    wx.chooseImage({
      count: 1,
      success(res){
        var tempFilePath = res.tempFilePaths[0];
        that.setData({
          avatar:tempFilePath,
        });
      }
    });
  },

  uploadImage(e){
    var that = this;
    var tempFilePath = that.data.avatar;
    wx.uploadFile({
      url:'http://127.0.0.1:8000/upload_image/',
      filePath: tempFilePath,
      name: 'image',
      method:'POST',
      formData:{
        openid:'myopenid',
        timestamp:'20230710170759',
        user:'test'
      },
      success: function(res){
        const data = res.data
        console.log("success上传图片")
        console.log(res)
      },
      fail:(err)=>{
        console.log("fail上传失败")
      }
    })
  },

  getImage(e){
    var that = this;
    wx.request({
      url:'http://127.0.0.1:8000/get_image/',
      responseType:'arraybuffer',
      success: function(res){
        if(res.statusCode === 200){
          that.setData({
            imgGot:'data:image/jpeg;base64,' + wx.arrayBufferToBase64(res.data),
          });
          that.setData({
            avatar:that.data.imgGot,
          });
        }else{
          console.error('Failed to fetch result');
        }
      },
      fail: function(error){
        console.error('Request failed:' + error);
      }
    })
  },

  onMessageInput(e){
    this.setData({
      message: e.detail.value
    });
  },

  encryptedMessage: function(message) {
  // 简单加扰加密，参考jpeg字段 (0x000000F0)
    let encryptedMessage = '';
    for (let i = 0; i < message.length; i++) {
    encryptedMessage += String.fromCharCode(message.charCodeAt(i) ^ 0xF0);
    }
    return encryptedMessage;
    //return message;
},

  sendMessage(e){
    var that = this;
    let message = that.data.message;
    let encryptedMessage = that.encryptedMessage(message);
    var tempFilePath = that.data.avatar;
    //发送加密后的消息和图片
    wx.uploadFile({
      url:'http://127.0.0.1:8000/upload_message_v2/',
      filePath: tempFilePath,
      name: 'image',
      method: 'POST',
      //fromData:{
      //  message:encryptedMessage,
      //},
      formData:{
        openid:'myopenid',
        timestamp:'20230710170759',
        user:'test',
        message: encryptedMessage,
      },
      success:(res)=>{
        console.log("success上传")
        console.log(encryptedMessage)
        // console.log(res)
      },
      fail:(err)=>{
        console.log("上传失败", err);
      }
    })
  }

})