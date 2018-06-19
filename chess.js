	// 基本变量
	var mychess = document.getElementById('myCanvas')//取到元素
	var context = mychess.getContext('2d') //生成一个2维的画布
	var type = true //黑棋先手
	var chessBox = []//记录棋盘状态
	var step = 0 //步数
	var alive1 = 5 //活1
	var alive2 = 14//活2
	var alive3 = 50//活3
	var alive4 = 100//活4
	var die1 = 1//死1
	var die2 = 8//死2
	var die3 = 12//死3
	var die4 = 60//死4
	var killpoint = 55 //可以成为的绝杀点
	var exist = -1//存在子
	var blackweight = []//黑棋的权重
	var whiteweight = []//白棋的权重
	var wp = [] //定义白棋的最优落子点
	var bp = [] //定义黑子的最优落子点
	function init(){//棋盘及游戏属性的初始化
		for(var i=0;i<15;i++){
			context.strokeStyle = "green"//设置笔触颜色
			context.moveTo(15+i*30,15) //画竖线与棋盘边缘保持15的边距
			context.lineTo(15+i*30,435)//线之间的距离是30
			context.stroke()
			context.moveTo(15,15+i*30)
			context.lineTo(435,15+i*30)
			context.stroke()
		}
		for (var  i= 0;i<15;i++){
			chessBox[i] = []
			for (var j = 0;j<15;j++){
				chessBox[i][j] = 0
			}
		}
		for (var  i= 0;i<15;i++){
			whiteweight[i] = []
			for (var j = 0;j<15;j++){
				whiteweight[i][j] = 0
			}
		}
		for (var  i= 0;i<15;i++){
			blackweight[i] = []
			for (var j = 0;j<15;j++){
				blackweight[i][j] = 0
			}
		}
	}
	//落子
	function dochess(i,j,type){//坐标以及棋子的类型
		context.beginPath()//重置之前的路径
		context.arc(15+j*30,15+i*30,13,0,2*Math.PI)//
		
		if (type){
			context.fillStyle = "black"	
		}else {
			context.fillStyle = "white"
		}
		// 有子的位置权重上置为最小
		blackweight[i][j] = exist
		whiteweight[i][j] = exist
		context.fill()
		context.closePath()
	}

	//记录步数
	function SignStep(i,j,type){
		context.font = "5px";
		if (type){
			context.fillStyle = "white";
		}else {
			context.fillStyle = "black";
		}
		var offset = step/10+2
		context.fillText(step, 13-offset+j*30, 17+i*30);
	}

	//是否赢了
	function iswin(count,type){
		if (count == 5){
			var result = ""
			if (type == 1){
				result = "黑棋赢了！"
				
			}else{
				result = "白棋赢了！"
			}
			context.font = "30px Courier New"
			context.fillStyle = "blue"
			context.fillText(result, (450-15)/2-30, (450-15)/2);
			mychess.onclick = function(){}//置空该方法
			return true
		}
		if (step == 15*15){
			context.font = "30px Courier New"
			context.fillStyle = "blue"
			context.fillText("和棋", (450-15)/2-30, (450-15)/2);
		}
		return false
	}

	//是否越界是否有棋
	function isout(i,j){
		if (i<0||i>14||j<0||j>14){
			return true
		}
		if (chessBox[i][j] != 0){
			return true
		}
		if (whiteweight[i][j] == -1 || blackweight[i][j] ==-1){
			return true
		}
		return false
	}

	// 特殊棋型判断
	// todo
	function SpecicalType(value){
		if (value == alive2 ){ //该点可以成为33点
			return killpoint
		}
		// }else if(value ==  die3){//该点可以成为四三点
		// 	return killpoint 
		// }
		// }else if (value = alive1){//该点可以成活三点
		// 	return alive3
		// }else if(value == die2){//该点可以成为四
		// 	return die4 
		// }
		return alive2
	}

	//设置权重
	function setWeight(i,j,count,flag,type){
		var myweight = []
		for (var  x= 0;x<15;x++){
			myweight[x] = []
			for (var y = 0;y<15;y++){
				myweight[x][y] = 0
			}
		}
		if (type) {
			myweight = blackweight
		}else {
			myweight = whiteweight
		}
		if (count == 1 && flag){//活1
			myweight[i][j] = (myweight[i][j] == 0)?alive1:alive1+1
		}else if(count == 1){
			myweight[i][j] = die1
		}
		if (count == 2 &&flag){//活2
			myweight[i][j] = SpecicalType(myweight[i][j])
		}else if(count == 2){
			myweight[i][j] = die2
		}
		if (count == 3 &&flag){//活3
			myweight[i][j] = (myweight[i][j] == 0)?alive3:alive3+1
		}else if(count == 3){
			myweight[i][j] = die3
		}
		if (count == 4 &&flag){//活4
			myweight[i][j] = (myweight[i][j] == 0)?alive4:alive4+1
		}else if(count == 4){
			myweight[i][j] = die4
		}
		if (type){
			blackweight = myweight
		}else{
			whiteweight = myweight
		}
	}

	// 形式判断
	function judge(i,j){
		var value = chessBox[i][j]
		var count = 0//连子数
		var up = (i-5>=0)?i-5:0//上边界
		var down = (i+5<=14)?i+5:14//下边界
		var left = (j-5>=0)?j-5:0//边界
		var right = (j+5>=14)?j+5:14//右边界
		var newpositioni = 0//最后连子的纵坐标
		var newpositionj = 0//最后连子的很坐标
		var newspositioni = 0
		var newspositionj = 0
		var flag = false //死活状态
		// 判断竖线的连子状态
		for (var p=i;p>=up;p--){
			if(chessBox[p][j] == value){
				newpositioni = p
				newpositionj = j
				count++
			}else{
				break;
			}
		}
		if (iswin(count,type)){
			return true
		}
		if (!isout(newpositioni-1,newpositionj)){
			setWeight(newpositioni-1,newpositionj,count,flag,type)
			flag = true
		}
		count--
		for (var p=i;p<=down;p++){
			if(chessBox[p][j] == value){
				newspositioni = p
				newspositionj = j
				count++
			}else{
				break;
			}
		}
		if (iswin(count,type)){
			return true
		}
		if (!isout(newspositioni+1,newspositionj)){
			setWeight(newspositioni+1,newspositionj,count,flag,type)
		}
	
		if (!isout(newpositioni-1,newpositionj)){//再一次更新
			setWeight(newpositioni-1,newpositionj,count,flag,type)
		}
		flag = false
		count = 0
		// 判断横线上的连棋状态
		for (var p = j;p>=left;p--){
			if (chessBox[i][p] == value){
				newpositioni = i
				newpositionj = p
				count++
			}else {
				break
			}	
		}
		if (iswin(count,type)){
			return true
		}
		if (!isout(newpositioni,newpositionj-1)){
			setWeight(newpositioni,newpositionj-1,count,flag,type)
			flag = true
		}
		count--
		for (var p = j;p<=right;p++){
			if (chessBox[i][p] == value){
				newspositioni = i
				newspositionj = p
				count++
			}else {
				break
			}	
		}
		if (iswin(count,type)){
			return true
		}
		if (!isout(newspositioni,newspositionj+1)){
			setWeight(newspositioni,newspositionj+1,count,flag,type)
		}
		if (!isout(newpositioni,newpositionj-1)){
			setWeight(newpositioni,newpositionj-1,count,flag,type)
		}
		flag = false
		count = 0
		// 判断左边斜线的状态
		for(var p=i,s=j;p>=up&&s>=left;p--,s--){
			if (chessBox[p][s] == value){
				newpositioni = p
				newpositionj = s
				count++
			}else {
				break;
			}
		}
		if (iswin(count,type)){
			return true
		}
		if (!isout(newpositioni-1,newpositionj-1)){
			setWeight(newpositioni-1,newpositionj-1,count,flag,type)
			flag = true
		}
		count--
		for(var p=i,s=j;p<=down&&s<=right;p++,s++){
			if (chessBox[p][s] == value){
				newspositioni = p
				newspositionj = s
				count++
			}else {
				break;
			}
		}
		if (iswin(count,type)){
			return true
		}
		if (!isout(newspositioni+1,newspositionj+1)){
			setWeight(newspositioni+1,newspositionj+1,count,flag,type)
		}
		if (!isout(newpositioni-1,newpositionj-1)){
			setWeight(newpositioni-1,newpositionj-1,count,flag,type)
		}
		flag = false
		count = 0
		// 判断右边斜线的状态
		for(var p=i,s=j;p>=up&&s<=right;p--,s++){
			if (chessBox[p][s] == value){
				newpositioni = p
				newpositionj = s
				count++
			}else {
				break;
			}
		}
		if (iswin(count,type)){
			return true
		}
		if (!isout(newpositioni-1,newpositionj+1)){
			setWeight(newpositioni-1,newpositionj+1,count,flag,type)
			flag = true
		}
		count--
		for(var p=i,s=j;p<=down&&s>=left;p++,s--){
			if (chessBox[p][s] == value){
				newspositioni = p
				newspositionj = s
				count++
			}else {
				break;
			}
		}
		if (iswin(count,type)){
			return true
		}
		if (!isout(newspositioni+1,newspositionj-1)){
			setWeight(newspositioni+1,newspositionj-1,count,flag,type)
		}
		if (!isout(newpositioni-1,newpositionj+1)){
			setWeight(newpositioni-1,newpositionj+1,count,flag,type)
		}
	}

	//点对象
	function Point(i,j){
		this.i = i
		this.j = j
	}

	//找到最优走法
	function FindBestPosition(){
		// console.log(blackweight)
		var WMAX = 0
		var BMAX = 0
		var count = 0
		for (var i=0;i<14;i++){
			for (var j = 0;j<14;j++){
				if (WMAX < whiteweight[i][j]){
					WMAX = whiteweight[i][j]
					wp = []
					var p = new Point(i,j)
					count = 0
					wp[count] = p
				}
				if (WMAX == whiteweight[i][j]){
					var p = new Point(i,j)
					wp[count++] = p
				}
			}
		}
		count = 0
		for (var i=0;i<14;i++){
			for (var j = 0;j<14;j++){
				if (BMAX < blackweight[i][j]){
					BMAX = blackweight[i][j]
					bp = []
					var p = new Point(i,j)
					count = 0
					bp[count] = p
				}
				if (BMAX == blackweight[i][j]){
					var p = new Point(i,j)
					bp[count++] = p
				}
			}
		}
		console.log("黑棋的最大值",BMAX)
		var bestpoint = new Point()
		if (WMAX >= BMAX){
			bestpoint = BestAttack()
		}else {
			bestpoint = BestDefense()
		}
		return bestpoint
	}

	// 寻找最有效的防御点
	function BestDefense(){
		var score = 0
		var max = 0
		var bestpoint = new Point(0,0)
		for(var i =0;i<bp.length;i++){
				var p = bp[i]
				var bscore = blackweight[p.i][p.j]
				var ascore = whiteweight[p.i][p.j]
				score = bscore + ascore
				if (max < score){
					max = score
					bestpoint.i = p.i
					bestpoint.j = p.j
				}
		}
		return bestpoint
	}

	// 最佳进攻点
	function BestAttack(){
		var score = 0
		var max = 0
		var bestpoint = new Point(0,0)
		for(var i =0;i<wp.length;i++){
				var p = wp[i]
				var bscore = blackweight[p.i][p.j]
				var ascore = whiteweight[p.i][p.j]
				score = bscore + ascore
				if (max < score){
					max = score
					bestpoint.i = p.i
					bestpoint.j = p.j
				}
		}
		return bestpoint
	}

	//人机 
	function autoplay(){
		var p = FindBestPosition()
		var i = p.i
		var j = p.j
		if (chessBox[i][j] == 0){
			chessBox[i][j] = 2
			step++
			dochess(i,j,type)
			SignStep(i,j,type)
			judge(i,j)
			type = !type
			return
		}
		alert("该点已bug存在",i,j)
	}

	init()
	$(".btns").click(function(event) {
		var flag = $(this).attr("value")
		$(".close").click()
		if (flag == 2){
			alert("玩家先手，当前人机棋力lv_1，敢不敢让我三子(*/ω＼*)")
		}
		// $(this).text("重新开始")
		step = 0
		type = true
		context.beginPath();   
		context.clearRect(0,0,mychess.width,mychess.height); 
		context.font = "15px Courier New"
		context.closePath();
		init()
		mychess.onclick = function(e){
			// 获取落子点的位置
			var i = Math.floor(e.offsetY/30)
			var j = Math.floor(e.offsetX/30)
			if (!chessBox[i][j]){
				dochess(i,j,type)
				step++
				if (type){
					chessBox[i][j] = 1
				}else {
					chessBox[i][j] = 2
				}
				SignStep(i,j,type)
				if (judge(i,j)){
					return
				}
				type = !type//换棋
				if (flag == 1){

				}else {
					autoplay()
				}
			}
		}
	});