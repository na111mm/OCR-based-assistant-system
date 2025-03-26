
const app = getApp()

const address = 'http://127.0.0.1:5001';

Page({
  data: {
    //
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    motto: 'Hi 开发者！',

    userInfo: {},

    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    
    //

    id: null,

    user_login: 0,

    timer: 0,

  },

  //
  
  bindGetUserInfo (e) {
    console.log(e.detail.userInfo)
  },

  onLoad: function() {
    // 查看是否授权
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },

  // Login:function(res)
  
  hehe:function(res){
    
    var app = getApp();
    var that = this;

    wx.authorize({  
      scope: 'scope.userInfo',
      success()
      {
      },
      complete(){
        wx.showToast({title:'登陆中。。。', icon: 'loading', duration:5000})
        
        wx.login({
          success: (res) => {
            console.log(res);
            console.log(res.code);
            wx.request({
              　url: address+'/login', //API地址
              　header: {
              　　'content-type': "application/x-www-form-urlencoded",
              　},
              　data: {
                  code: res.code,
              　},
              　success: function (reg) {
              　  console.log(reg);
                  app.globalData.id = reg.data;
                  console.log(app.globalData.id); 
              　}
            })
          },
        })
        
        setTimeout(function () {
        that.data.id = app.globalData.id;
        console.log(that.data.id);
        that.setData({
            id: that.data.id
        })

        if(that.data.id==null){
          console.log(that.data.id)
          wx.showToast({title:'网络问题，再点击试试？\r\n也可能是跑路了 ~－＝≡ヘ(*・ω・)ノ', icon: 'none',duration:4000})
          return
        }

        console.log(that.data.id);
        console.log(res.detail.userInfo);

        if(res.detail.userInfo){
          //修改userInfo的状态数据
          app.globalData.userInfo = res.detail.userInfo;
          that.setData({
            userInfo: res.detail.userInfo,
          })
        }
        
        wx.hideToast({
          success: (res) => {},
        })
        
        }, 3000)
      }
    })
  },
  


  

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //
  

  getUserInfo: function(e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //
  Showorder(e) {
    wx.request({
      url: address+'/past_strategy', //API地址
      header: {
      　'content-type': "application/x-www-form-urlencoded",
      },
      data: {
        type: "上传",
        user_id: 1,
      },
      success: function (reg) {
      　console.log(reg);
        console.log(reg.data['method']);
        app.globalData.method = reg.data['method'];
        wx.navigateTo({
          url: '/pages/order/order',
        })
        return
      }
    })
    
  },
  
  Showmethod: function(){
    wx.request({
      url: address+'/past_strategy', //API地址
      header: {
      　'content-type': "application/x-www-form-urlencoded",
      },
      data: {
        type: "上传",
        user_id: 1,
      },
      success: function (reg) {
      　console.log(reg);
        console.log(reg.data['method']);
        app.globalData.method = reg.data['method'];
        wx.navigateTo({
          url: '/pages/method/method',
        })
        return
      }
    })
    
  },
  Showreco: function(){
    wx.navigateTo({
      url: '/pages/reco/reco',
    })
    return
  },
  showSettings(e) {
    this.setData({
      modalname4: 1,
    })
  },
  showModal5(e) {
    this.setData({
      modalname5: 1,
    })
  },
  //

})

