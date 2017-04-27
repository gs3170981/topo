//数据层
var data={
	nodeInfo:[
		{
			key:'A',
			x:200,
			y:200,
			src:'img/1.jpg',
			txt:'1、我是一个Demo'
		},{
			key:'B',
			x:400,
			y:400,
			src:'img/2.jpg',
			txt:'123123123'
		},{
			key:'C',
			x:500,
			y:200,
			src:'img/3.jpg',
			txt:'123123123'
		},{
			key:'D',
			x:300,
			y:300,
			src:'img/3.jpg',
			txt:'123123123'
		}
	],
	nodeLinkInfo:[
		{
			fromKey:'A',
			toKey:'B',
			totalCount:10000
		},{
			fromKey:'B',
			toKey:'C',
			totalCount:150
		},{
			fromKey:'A',
			toKey:'C',
			totalCount:100
		},{
			fromKey:'A',
			toKey:'D',
			totalCount:100
		},{
			fromKey:'D',
			toKey:'C',
			totalCount:100
		},{
			fromKey:'D',
			toKey:'B',
			totalCount:100
		}
	]
}
//唯一调用入口
function myTopoCreate(data){
	ready();
	createDiv(data.nodeInfo);
	createLine(data.nodeLinkInfo,data.nodeInfo);
	createNumber(data.nodeLinkInfo);
	//部署阶段-DOM父级创建
	function ready(){
		var articleKlass="width:700px;height:500px;position:relative;margin:0 auto;border:1px solid red;";
		var hgroupKlass="position:absolute;width:100%;height:100%;";
		var str="<article style='"+articleKlass+"' >"
			+"<hgroup uid='myTopo-number' style='"+hgroupKlass+"z-index:1'></hgroup>"
			+"<canvas uid='myTopo-canvas' height='500' width='700' style='position:absolute;'></canvas>"
		+"</article>"
		$('body').append(str);//后期修改位置
	}
	//模块创建
	function createDiv(data){
		var fatDiv="padding:10px 20px;width:80px;text-align:center;position:absolute;cursor:pointer;box-shadow:0 0 3rem #b7c0c1;border-radius:10px;background:white;";
		var img="height: 50px;width: 50px;";
		var txt="word-break:break-all;width:200px;overflow:auto;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;";
		for(var i=0;i<data.length;i++){
			var str="<div uid="+data[i].key+" style='"+fatDiv+"top:"+data[i].y+"px;left:"+data[i].x+"px;' onmousedown="+"myTopoDrag(event,this)"+" >"
				+"<div style='width: 100%;'><img draggable='false' src="+data[i].src+" style='"+img+"' /></div>"
				+"<small style='"+txt+"'>"+data[i].txt+"</small>"
			+"</div>";
			$('hgroup[uid="myTopo-number"]').append(str);
		}
	}
	//number创建
	function createNumber(data){
		var klass="position:absolute;";
		for(var i=0;i<data.length;i++){
			var objMid=mid(lineSubscript(data[i].fromKey),lineSubscript(data[i].toKey));
			var str="<small uid="+(data[i].fromKey+data[i].toKey)+" style='"+klass+"top:"+objMid.y+"px;left:"+objMid.x+"px;'>"+data[i].totalCount+"</small>"
			$('hgroup[uid="myTopo-number"]').append(str);
			//输出后校正，否则获取不到宽高
			numberSubscript(data[i]);
		}
		//number坐标校正
		function numberSubscript(str){
			var obj=$("small[uid='"+(str.fromKey+str.toKey)+"']");
			var obj_w=$(obj).width();
			var obj_h=$(obj).height();
			var obj_t=$(obj).position().top;
			var obj_l=$(obj).position().left;
			$(obj).css('left',obj_l-obj_w/2);
			$(obj).css('top',obj_t-obj_h/2);
		}
	}
}
//取直线中点
function mid(fromKey,toKey){
	var data={};
	data.x=(fromKey.x+toKey.x)/2;
	data.y=(fromKey.y+toKey.y)/2;
	return data;
}
//canvas-line创建
function createLine(data,dom,sel){
	var obj=$("canvas[uid='myTopo-canvas']")[0];
	var cav=obj.getContext("2d");
	var cache=0;
    cav.lineWidth=1;
    cav.strokeStyle='rgba(83,6,155,0.2)';
    cav.clearRect(0,0,obj.width,obj.height);//清除重绘
	for(var i=0;i<data.length;i++){
		if(sel)if(cache<sel.length&&i==sel[cache]){
	    	cav.strokeStyle='rgba(83,6,155,1)';
	    	cache++;
	   	}else cav.strokeStyle='rgba(83,6,155,0.2)';
		createLineChild(data[i].fromKey,data[i].toKey,data[i].totalCount)
	}
	//子线的创建
	function createLineChild(come,to,number){
		var obj={};
		obj.come=lineSubscript(come);
		obj.to=lineSubscript(to);
		cav.beginPath();
       	cav.moveTo(obj.come.x,obj.come.y);
       	cav.lineTo(obj.to.x,obj.to.y);
		cav.stroke();
	}
}
//line坐标校正
function lineSubscript(obj){
	var z={};
	var dom=data.nodeInfo;
	for(var i=0;i<dom.length;i++){
		if(dom[i].key==obj){
			var id=$('div[uid="'+dom[i].key+'"]');
			z.x=dom[i].x+$(id).width()/2+10;
			z.y=dom[i].y+$(id).height()/2+5;
			return z;
		}
	}
}
//拖动监听
function myTopoDrag(event,obj){
	//初始化-----------------------------------------------------------
	//e:鼠标坐标、obj:当前对象、p:父级对象、n:当前变量、c:临时变量
	//-----------------------------------------------------------------
	var e_x=event.clientX;
	var e_y=event.clientY;
	var obj_t=$(obj).position().top;
	var obj_l=$(obj).position().left;
	var obj_w=$(obj).width();
	var obj_h=$(obj).height();
	var p=$("hgroup[uid='myTopo-number']");
	var p_w=$(p).width();
	var p_h=$(p).height();
	var e_b_c=0,e_t_c=0,e_l_c=0,e_r_c=0;//对四角的兼容
	$(this).mousemove(function(event){
		//初始化
		var obj_n_t=$(obj).position().top;
		var obj_n_b=parseInt($(obj).css('bottom'));
		var obj_n_l=$(obj).position().left;
		var obj_n_r=parseInt($(obj).css('right'));
		var e_n_x=event.clientX;//now_X
		var e_n_y=event.clientY;
		//移动偏差
		var e_x_t=obj_t+(e_n_y-e_y);
		var e_y_l=obj_l+(e_n_x-e_x);
		//范围限定
		if(obj_n_b<0){//bottom
			e_x_t=p_h-obj_h-19;//与pading相关
			if(!e_b_c)e_b_c=e_n_y;
			else if(e_n_y<e_b_c){
				e_x_t=e_x_t-1//与pading相关
				e_b_c=0;
			}
		}if(obj_n_t<0){//top
			e_x_t=-1;
			if(!e_t_c)e_t_c=e_n_y;
			else if(e_n_y>e_t_c){
				e_x_t=e_x_t+1
				e_t_c=0;
			}
		}if(obj_n_l<0){//left
			e_y_l=-1;
			if(!e_l_c)e_l_c=e_n_x;
			else if(e_n_x>e_l_c){
				e_y_l=e_y_l+1
				e_l_c=0;
			}
		}if(obj_n_r<0){//right
			e_y_l=p_w-obj_w-38;
			if(!e_r_c)e_r_c=e_n_x;
			else if(e_n_x<e_r_c){
				e_y_l=e_y_l-2
				e_r_c=0;
			}
		}
		//*data为全局

		var nodeInfo=data.nodeInfo;
		var nodeLinkInfo=data.nodeLinkInfo;
		
		
		var objIndex=subscript($(obj),nodeInfo);
		nodeInfo[objIndex].x=e_y_l;
		nodeInfo[objIndex].y=e_x_t;

		//牵动有关系的中央数值
		var sel=getAllNumber($(obj).attr('uid'),nodeLinkInfo);

		//牵动所有线
		createLine(nodeLinkInfo,nodeInfo,sel);
		


    	$(obj).css({top:e_x_t,left:e_y_l});
		

	})
 	$(this).mouseup(function (event){
    	$(this).unbind("mousemove"); 
	});
	function subscript(obj,all){
		var id=$(obj).attr('uid');
		for(var i=0;i<all.length;i++)
		if(all[i].key==id)return i;
	}
	function getAllNumber(obj,data){
		var arr=[];
		for(var i=0;i<data.length;i++){
			if(data[i].fromKey==obj || data[i].toKey==obj){
				var objMid=mid(lineSubscript(data[i].fromKey),lineSubscript(data[i].toKey));
				var obj_c=$("small[uid='"+(data[i].fromKey+data[i].toKey)+"']");
				var obj_w=$(obj_c).width();
				var obj_h=$(obj_c).height();
				$(obj_c).css({
					top:objMid.y-obj_h/2,
					left:objMid.x-obj_w/2
				});
				arr.push(i);
			}
		}
		return arr;
	}
}



//执行阶段
myTopoCreate(data);
