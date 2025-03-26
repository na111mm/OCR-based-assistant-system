

const app = getApp();

const getAppInfo = app.globalData.openid;

const address = 'http://';

var lastTouchPoint = { x: 0, y: 0 };
var newDist = 0;
var oldDist = 0;


Page({
  
  data: {
    
    examplePicture: [],
    pic: [],
    
    card: [{    location:{locationMethod:"",x:"0",y:"0",locationInput1:"",locationInput2:"",locationInput3:""},
                 rowLineCombine:{rowSwitch:"0",rowCharacter:"",rowInput1:"",rowInput2:"",
                 lineSwitch:"0",line_character:"",line_input1:"",line_input2:""},
              change_font:[],
            change_font_off: 1,
            strategy_name: "m",
            card_off: 1,
            }],
    
    
    locationPick: ['位置定位', '正则定位', '相对距离定位'],
    
    nowcard: -1,
    row_line_module: 0,
    row_line_pick: ['无', '空格', '空行'],
    
    list:[{"dingwei":{name:"点",x:"1",y:"2",x:"%",y:"px"},
           "chuli":[{name:"shanchu",value1:",.`~"},{name:"tihuan",before:"a",after:"b"}]}],

    change_font_module: 0,
    del_pick: ['无', '仅数字', '删除字符'],

    ListTouchStart:null,
    ListTouchDirection:null,
    
    picmodule: 1,
    guidemodule: 0,

    upload_pic: 0,

  },

  onReady() {
    const query = wx.createSelectorQuery()
    query.select('#myCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        //getSystemInfoSync
        const dpr = wx.getWindowInfo().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)

        ctx.fillRect(0, 0, 100, 100)
      })
  },

  draw: function(e) {
    this.data.ctx.clearRect(0, 0, 10000, 10000)
    this.data.ctx.drawImage(this.data.image, this.data.stv.offsetX, this.data.stv.offsetY, 
      this.data.image.width*this.data.stv.scale, this.data.image.height*this.data.stv.scale)
  },

  onLoad: function (options) {
    console.log(app.globalData.card);
    console.log(app.globalData.if_download_method);

    //
    console.log(app.globalData.is_preview);
    console.log(app.globalData.preview_pic);
    console.log(app.globalData.txt);
    this.data.txt = app.globalData.txt;
    var that = this;
    that.setData({
      dataimg: "/imageGuide/11.png",  //好像是写出的地址
      txt: this.data.txt,
    })
  
    wx.createSelectorQuery()
    .select('#myCanvas')   // 在 WXML 中填入的 id
    .fields({ node: true, size: true })
    .exec((res) => {
      
      const canvas = res[0].node   // Canvas 对象
      
      this.data.ctx = canvas.getContext('2d')   // 渲染上下文
      let ctx = this.data.ctx
      
      const width = res[0].width   // Canvas 画布的实际绘制宽高
      const height = res[0].height
      
      const dpr = wx.getWindowInfo().pixelRatio   // 初始化画布大小
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
      this.data.image = canvas.createImage()
      
      this.data.image.onload = () => {   // 图片加载完成回调
        ctx.drawImage(this.data.image, this.data.stv.offsetX, this.data.stv.offsetY)   // 将图片绘制到 canvas 上
      }
      
      this.data.image.src = `${wx.env.USER_DATA_PATH}/hello.jpg` // 设置图片src   //好像是图片地址
      console.log(this.data.image.width)
      console.log(this.data.image.height)
    }) 

    if (app.globalData.if_download_method == 1){
      this.data.card = app.globalData.card;
      app.globalData.if_download_method = 0;
    }
    this.data.upload_pic = 0;
    this.setData({
      card: this.data.card,
      upload_pic: this.data.upload_pic,
    })
    wx.request({
      url: address+'/onload', //API地址
      method:'POST',
      header: {
      　'content-type': "application/x-www-form-urlencoded",
      },
      data: {
        upload_time: "",
        user_id: 1,
      },
      success: function (reg) {
        console.log(reg.data["picture_group_id"]);
        app.globalData.picture_group_id = reg.data["picture_group_id"];
      }
    })
  },

  //
  Strategy(e){
    this.data.strategy_module = 0;
    this.setData({
      strategy_module: this.data.strategy_module,
    })
    if (app.globalData.upload_strategy == 1){
      app.globalData.strategy = this.data.card;
    }
    wx.request({
    　url: address+'/strategy', //API地址
    　header: {
    　　'content-type': "application/x-www-form-urlencoded",
    　},
    　data: {
        card: this.data.card,
        user_id: 1,
        login: 0,
        upload_time: "today",
        save_strategy: app.globalData.save_strategy,
        upload_strategy: app.globalData.upload_strategy,
    　},
    　success: function (reg) {
    　  console.log(reg);
        console.log(reg.data["card"]);
    　}
    })
  },
  

  Get_strategy(e){

  },

  //
  Guide() {
    this.data.guidemodule = 1;
    this.setData({
      guidemodule: this.data.guidemodule,
    })
  },
  Hide_guide(e){
    this.data.guidemodule = (this.data.guidemodule + 1) % 2;
    this.setData({
      guidemodule: this.data.guidemodule,
    })
  },

  //
  Preview: function() {

    wx.request({
      url: address + '/preview', //API地址
      method: 'POST',
      header: {
      　'content-type': "application/x-www-form-urlencoded",
      },
      data: {
        user_id: 1,
      },
      success: function (reg) {
        console.log(reg.data);
        app.globalData.preview_pic = reg.data;
        const fs = wx.getFileSystemManager();
        fs.writeFile({
          filePath: `${wx.env.USER_DATA_PATH}/hello.jpg`,
          data: app.globalData.preview_pic,
          encoding: 'base64',
          success(res) {
            wx.navigateTo({
              url: '/pages/preview/preview',
            })
            return
            console.log(res)
            wx.saveImageToPhotosAlbum({
              filePath: `${wx.env.USER_DATA_PATH}/hello.jpg`,
              success: function (res) {
                wx.showToast({
                  title: '保存成功',
                })
                //console.log(res.data)
              },
              fail: function (err) {
                console.log(err)
                //console.error(err)
              },
            })
          },
        })
      }
    })
  },
  Choose_example_pic() {
    wx.chooseImage({
      count: 1, // 设置最多1张
      sizeType: ['original', 'compressed'], //所选的图片的尺寸
      sourceType: ['album', 'camera'], //选择图片的来源
      success: (res) => {
        this.data.examplePicture[0] = res.tempFilePaths[0];
        this.setData({
          examplePicture: this.data.examplePicture
        });
        var team_image = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64"); //将图片进行base64编码。
    　  wx.request({
    　　  url: address+'/example_picture', //API地址
          method:'POST',
    　　  header: {
    　　　  'content-type': "application/x-www-form-urlencoded",
    　　  },
    　　  data: {
            image: team_image,
            upload_time: "",
            user_id: 1,
            picture_group_id: app.globalData.picture_group_id,
    　　  },
    　　  success: function (reg) {
            console.log(reg.data["txt"]);
            app.globalData.txt = reg.data["txt"];
    　　  }
    　  })
      }
    })
  },
  ViewExamplePicture(e) {
    wx.previewImage({
      urls: this.data.examplePicture,
      current: e.currentTarget.dataset.url
    });
  },
  Del_example_pic(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.examplePicture.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            examplePicture: this.data.examplePicture
          })
        }
      }
    })
  },
  
  //
  Upload_pic(){
    this.data.upload_pic = this.data.upload_pic + 1;
    this.setData({
      upload_pic: this.data.upload_pic
    })
    for(var i=0; i<this.data.pic.length; i++){
      var team_image = wx.getFileSystemManager().readFileSync(this.data.pic[i], "base64"); //将图片进行base64编码。
      wx.request({
        url: address+'/picture', //API地址
        method:'POST',
        header: {
          'content-type': "application/x-www-form-urlencoded",
        },
        data: {
          image: team_image,
          pic_length: this.data.pic.length,
          upload_time: "today",
          user_id: 1,
          upload_pic: this.data.upload_pic,
          picture_group_id: app.globalData.picture_group_id,
        },
        success: function (reg) {
          console.log(reg);
          console.log(reg.data["picture_group_id"]);
        }
      })
    }
  },
  Choose_pic() {
    wx.chooseImage({
      count: 100, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.pic.length != 0) {
          this.setData({
            pic: this.data.pic.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            pic: res.tempFilePaths
          })
        }
      }
    });
  },
  View_pic(e) {
    wx.previewImage({
      urls: this.data.pic,
      current: e.currentTarget.dataset.url
    });
  },
  Del_pic(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.pic.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            pic: this.data.pic
          })
        }
      }
    })
  },
  Hide_pic(e) {
    this.data.picmodule = (this.data.picmodule + 1) % 2;
    this.setData({
      picmodule: this.data.picmodule,
    })
  },

  // 
  Addcard(e){
    console.log(e);
    console.log(this.data.card);

    this.data.card.push(
      {location:{locationMethod:"",x:"0",y:"0",locationInput1:"",locationInput2:"",locationInput3:""},
      rowLineCombine:{rowSwitch:"0",rowCharacter:"",rowInput1:"",rowInput2:"",
      lineSwitch:"0",line_character:"",line_input1:"",line_input2:""},
       change_font:[],
       change_font_off: 1,
       strategy_name:"",
       card_off: 1});

    this.setData({
      card: this.data.card,
    })
  },
  Minuscard(e){
    console.log(e);
    this.data.card.splice(e.currentTarget.dataset.indexcard, 1);
    console.log(this.data.card);
    this.setData({
      card: this.data.card,
    })
  },
  Hidecard(e){
    console.log(e);
    this.data.card[e.currentTarget.dataset.indexcard].card_off = 
      (this.data.card[e.currentTarget.dataset.indexcard].card_off + 1) % 2;
    this.setData({
      card: this.data.card,
    })
  },
  
  // 
  LocationPick(e) {
    console.log(e);
    this.data.card[e.currentTarget.dataset.indexcard].location.locationMethod = this.data.locationPick[e.detail.value];
    this.setData({
      indexloc: e.detail.value,
      card: this.data.card,
    })
  },
  Xinput(e) {
    console.log(e);
    this.data.card[e.currentTarget.dataset.indexcard].location.locationInput1 = e.detail.value;
    this.setData({
      card: this.data.card,
    })
  },
  Yinput(e) {
    console.log(e);
    this.data.card[e.currentTarget.dataset.indexcard].location.locationInput2 = e.detail.value;
    this.setData({
      card: this.data.card,
    })
  },
  X(e) {
    console.log(e);
    if (e.detail.value == true){
      this.data.card[e.currentTarget.dataset.indexcard].location.x = 'true'
    }
    if (e.detail.value == false){
      this.data.card[e.currentTarget.dataset.indexcard].location.x = 'false';
    }
    this.setData({
      card: this.data.card,
    })
  },
  Y(e) {
    console.log(e);
    if (e.detail.value == true){
      this.data.card[e.currentTarget.dataset.indexcard].location.y = 'true'
    }
    if (e.detail.value == false){
      this.data.card[e.currentTarget.dataset.indexcard].location.y = 'false';
    }
    this.setData({
      card: this.data.card,
    })
  },
  Keyinput1(e) {
    console.log(e);
    this.data.card[e.currentTarget.dataset.indexcard].location.locationInput1 = e.detail.value;
    this.setData({
      card: this.data.card,
    })
  },
  Keyinput2(e) {
    console.log(e);
    this.data.card[e.currentTarget.dataset.indexcard].location.locationInput2 = e.detail.value;
    this.setData({
      card: this.data.card,
    })
  },
  Relativestart(e){
    console.log(e);
    this.data.card[e.currentTarget.dataset.indexcard].location.locationInput1 = e.detail.value;
    this.setData({
      card: this.data.card,
    })
  },
  Relativeinput1(e){
    console.log(e);
    this.data.card[e.currentTarget.dataset.indexcard].location.locationInput2 = e.detail.value;
    this.setData({
      card: this.data.card,
    })
  },
  Relativeinput2(e){
    console.log(e);
    this.data.card[e.currentTarget.dataset.indexcard].location.locationInput3 = e.detail.value;
    this.setData({
      card: this.data.card,
    })
  },
  
  //
  Show_row_line(e){
    console.log(e);
    this.data.row_line_module = 1;
    this.data.nowcard = e.currentTarget.dataset.indexcard;
    this.setData({
      nowcard: this.data.nowcard,
      row_line_module: this.data.row_line_module,
      })
  },
  Hide_row_line(e){
    console.log(e);
    this.data.row_line_module = 0;
    this.setData({
      row_line_module: this.data.row_line_module,
      })
  },
  Row_switch(e){
    console.log(e);
    if (e.detail.value == true){
      this.data.card[this.data.nowcard].rowLineCombine.rowSwitch = 'true';
    }
    if (e.detail.value == false){
      this.data.card[this.data.nowcard].rowLineCombine.rowSwitch = 'false';
    }
    this.setData({
      card: this.data.card,
      })
  },
  Line_switch(e){
    console.log(e);
    if (e.detail.value == true){
      this.data.card[this.data.nowcard].rowLineCombine.lineSwitch = 'true';
    }
    if (e.detail.value == false){
      this.data.card[this.data.nowcard].rowLineCombine.lineSwitch = 'false';
    }
    this.setData({
      card: this.data.card,
      })
  },
  Row_pick(e) {
    console.log(e);
    this.data.card[this.data.nowcard].rowLineCombine.rowCharacter = this.data.row_line_pick[e.detail.value];
    this.setData({
      card: this.data.card,
    })
  },
  Linepick(e) {
    console.log(e);
    this.data.card[this.data.nowcard].rowLineCombine.line_character = this.data.row_line_pick[e.detail.value];
    this.setData({
      card: this.data.card,
    })
  },
  Row_input1(e){
    console.log(e);
    this.data.card[this.data.nowcard].rowLineCombine.rowInput1 = e.detail.value;
    this.setData({
      card: this.data.card,
    })
  },
  Row_input2(e){
    console.log(e);
    this.data.card[this.data.nowcard].rowLineCombine.rowInput2 = e.detail.value;
    this.setData({
      card: this.data.card,
    })
  },
  Line_input1(e){
    console.log(e);
    this.data.card[this.data.nowcard].rowLineCombine.line_input1 = e.detail.value;
    this.setData({
      card: this.data.card,
    })
  },
  Line_input2(e){
    console.log(e);
    this.data.card[this.data.nowcard].rowLineCombine.line_input2 = e.detail.value;
    this.setData({
      card: this.data.card,
    })
  },
  
  // 
  Show_change_font(e) {
    console.log(e);
    this.data.change_font_module = 1;
    this.data.nowcard = e.currentTarget.dataset.indexcard;
    this.setData({
      change_font_module: this.data.change_font_module,
      nowcard: this.data.nowcard,
      card: this.data.card,
    })
  },
  Hide_change_font(e) {
    console.log(e);
    this.data.change_font_module = 0;
    this.setData({
      change_font_module: this.data.change_font_module,
    })
  },
  change_font_off(e) {
    console.log(e);
    this.data.card[e.currentTarget.dataset.indexcard].change_font_off = 
    (this.data.card[e.currentTarget.dataset.indexcard].change_font_off + 1) % 2;
    this.setData({
      card: this.data.card,
    })
  },
  //
  Add_font(e) {
    console.log(e);
    this.data.card[this.data.nowcard].change_font.push({type:"1", front_behind:"0", change_font_input1:"",
                                                        move_font:null});
    this.data.change_font_module = 0;
    this.setData({
      change_font_module: this.data.change_font_module,
      card: this.data.card,
    })
  },
  Delete_font(e) {
    console.log(e);
    this.data.card[this.data.nowcard].change_font.push({type:"2", delete_font:"0", change_font_input1:"",
                                                        move_font:null});
    this.data.change_font_module = 0;
    this.setData({
      change_font_module: this.data.change_font_module,
      card: this.data.card,
    })
  },
  Replace_font(e) {
    console.log(e);
    this.data.card[this.data.nowcard].change_font.push({type:"3", change_font_input1:"", change_font_input2:"",
                                                        move_font:null});
    this.data.change_font_module = 0;
    this.setData({
      change_font_module:this.data.change_font_module,
      card:this.data.card,
    })
  },
  //
  Add_switch(e) {
    console.log(e);
    if (e.detail.value==true){
      this.data.card[e.currentTarget.dataset.indexcard].change_font[e.currentTarget.dataset.indexfont].front_behind
    = 'front';
    }
    if (e.detail.value==false){
      this.data.card[e.currentTarget.dataset.indexcard].change_font[e.currentTarget.dataset.indexfont].front_behind
    = 'behind';
    }
    this.setData({
      card:this.data.card,
    })
  },
  Add_input1(e) {
    console.log(e);
    this.data.card[e.currentTarget.dataset.indexcard].change_font[e.currentTarget.dataset.indexfont].change_font_input1 
    = e.detail.value;
    this.setData({
      card:this.data.card,
    })
  },
  Del_pick(e){
    console.log(e);
    this.data.card[e.currentTarget.dataset.indexcard].change_font[e.currentTarget.dataset.indexfont].delete_font
    = e.detail.value;
    this.setData({
      indexdel:e.detail.value,
      card:this.data.card,
    })
  },
  Del_input1(e) {
    console.log(e);
    this.data.card[e.currentTarget.dataset.indexcard].change_font[e.currentTarget.dataset.indexfont].change_font_input1
    = e.detail.value;
    this.setData({
      card:this.data.card,
    })
  },
  Rep_input1(e) {
    console.log(e);
    this.data.card[e.currentTarget.dataset.indexcard].change_font[e.currentTarget.dataset.indexfont].change_font_input1 
    = e.detail.value;
    this.setData({
      card:this.data.card,
    })
  },
  Rep_input2(e) {
    console.log(e);
    this.data.card[e.currentTarget.dataset.indexcard].change_font[e.currentTarget.dataset.indexfont].change_font_input2 
    = e.detail.value;
    this.setData({
      card:this.data.card,
    })
  },
  Minus_font(e) {
    console.log(e);
    console.log(e.currentTarget.dataset.indexcard);
    this.data.card[e.currentTarget.dataset.indexcard].change_font.splice(e.currentTarget.dataset.indexfont, 1);
    this.setData({
      card:this.data.card,
    })
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },
  // 设置ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },
  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection =='left'){
      this.data.card[e.currentTarget.dataset.indexcard].change_font[e.currentTarget.dataset.indexfont].move_font = 1;
      this.setData({
        card: this.data.card,
      })
    } 
    else {
      this.data.card[e.currentTarget.dataset.indexcard].change_font[e.currentTarget.dataset.indexfont].move_font = null;
      this.setData({
        card: this.data.card,
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  
  //
  Savestrategy(e){
    this.data.strategy_module = 1;
    app.globalData.save_strategy = 1;
    app.globalData.upload_strategy = 0;
    this.setData({
      strategy_module: this.data.strategy_module,
    })
  },
  Uploadstrategy(e){
    this.data.strategy_module = 1;
    app.globalData.save_strategy = 0;
    app.globalData.upload_strategy = 1;
    this.setData({
      strategy_module: this.data.strategy_module,
    })
  },
  Strategyinput(e){
    this.data.card[0].strategy_name = e.detail.value;
    this.setData({
      card: this.data.card,
    })
  },
  HideStrategy(e){
    this.data.strategy_module = 0;
    this.setData({
      strategy_module: this.data.strategy_module,
    })
  },

  //
  Download_strategy: function(){
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
          url: '/pages/download_method/download_method',
        })
        return
      }
    })
  },

  //
  Get_result(e){

    wx.request({
    　url: address+'/get_result', //API地址
    　header: {
    　　'content-type': "application/x-www-form-urlencoded",
    　},
    　data: {
        strategy: app.globalData.strategy,
        user_id: app.globalData.user_id,
        picture_group_id: app.globalData.picture_group_id,
        strategy_id: app.globalData.strategy_id,
    　},
    　success: function (reg) {
        console.log(reg.data);
        app.globalData.order_id = reg.data["order_id"];
    　}
    })
  },

  Download_result(e){
    wx.request({
      url: address+'/download_result', //API地址
      header: {
      　'content-type': "application/x-www-form-urlencoded",
      },
      data: {

      },
      success: function (reg) {
      　console.log(reg);
        console.log(reg.data['result']);
        app.globalData.result = reg.data['result'];
        wx.navigateTo({
          url: '/pages/result/result',
        })
        return
      }
    })
  },

  Clear(e){
    this.data.card = [{ location:{locationMethod:"",x:"0",y:"0",locationInput1:"",locationInput2:"",locationInput3:""},
    rowLineCombine:{rowSwitch:"0",rowCharacter:"",rowInput1:"",rowInput2:"",
                                  lineSwitch:"0",line_character:"",line_input1:"",line_input2:""},
                        change_font:[],
                        change_font_off: 1,
                        strategy_name: "m",
                        card_off: 1}];
    this.data.pic = [];
    this.data.examplePicture = [];
    this.setData({
      card: this.data.card,
      pic: this.data.pic,
      examplePicture: this.data.examplePicture,
    })
  },

  //
  Test(e){
    wx.request({
      url: address+'/test', //API地址
      header: {
      　'content-type': "application/x-www-form-urlencoded",
      },
      data: {
        strategy: app.globalData.strategy,
        user_id: app.globalData.user_id,
        picture_group_id: app.globalData.picture_group_id,
        strategy_id: app.globalData.strategy_id,
      },
      success: function (reg) {
      　console.log(reg);
        console.log(reg.data['check']);
      }
    })
  },

  Check(e){
    wx.request({
      url: address+'/check', //API地址
      header: {
      　'content-type': "application/x-www-form-urlencoded",
      },
      data: {
        
      },
      success: function (reg) {
      　console.log(reg);
        console.log(reg.data['check']);
        app.globalData.check = reg.data['check'];
        wx.navigateTo({
          url: '/pages/check/check',
        })
        return
      }
    })
  },

  //

})


