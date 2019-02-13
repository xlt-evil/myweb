 var typeWriter = {
    msg: function(msg){
     return msg;
    },
    len: function(){
     return this.msg.length;
    },
    seq: 0,
    speed: 150,//打字时间(ms)
    type: function(){
     var _this = this;
     document.getElementById("msg").innerHTML = _this.msg.substring(0, _this.seq);
     if (_this.seq == _this.len()) {
      _this.seq = 0;
       clearTimeout(t);
     }
     else {
      _this.seq++;
      var t = setTimeout(function(){_this.type()}, this.speed);
     }
    }
   }
   window.onload = function(){
  
    var msg = "琴叔饭吃了没有呢(〃'▽'〃) ,我正在吃呢，不是很好吃哭唧唧o(╥﹏╥)o";
    function getMsg(){
     return msg;
    }
    typeWriter.msg = getMsg(msg);
    typeWriter.type();
   }