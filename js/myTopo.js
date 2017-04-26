//数据层
var data={
	nodeInfo:[
		{
			key:'A',
			x:200,
			y:200,
			src:'img/1.jpg',
			txt:'1231213212313'
		},{
			key:'B',
			x:400,
			y:400,
			src:'img/2.jpg',
			txt:'123123123'
		},{
			key:'C',
			x:600,
			y:200,
			src:'img/3.jpg',
			txt:'123123123'
		}
	],
	nodeLinkInfo:[
		{
			fromKey:'A',
			toKey:'B',
			totalCount:147
		},{
			fromKey:'B',
			toKey:'C',
			totalCount:150
		},{
			fromKey:'C',
			toKey:'A',
			totalCount:100
		}
	]
}
//唯一调用入口
function myTopoCreate(data){
	ready();
	createDiv(data.nodeInfo);
	createLine(data.nodeLinkInfo,data.nodeInfo);
	//部署阶段-DOM父级创建
	function ready(){
		var articleKlass="width:700px;height:500px;position:relative;margin:0 auto;border:1px solid red;";
		var hgroupKlass="position:absolute;width:100%;height:100%;";
		var str="<article style='"+articleKlass+"' >"
			+"<hgroup uid='myTopo-number' style='"+hgroupKlass+"z-index:1'></hgroup>"
			+"<canvas uid='myTopo-canvas' style="+hgroupKlass+"></canvas>"
		+"</article>"
		$('body').append(str);//后期修改位置
	}
	//模块创建
	function createDiv(data){
		var fatDiv="padding:10px 20px;width:80px;text-align:center;position:absolute;cursor:pointer;box-shadow:0 0 3rem #b7c0c1;";
		var img="height: 50px;width: 50px;";
		var txt="word-break:break-all;width:200px;overflow:auto;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;";
		for(var i=0;i<data.length;i++){
			var str="<div uid="+data[i].key+" style='"+fatDiv+"top:"+data[i].y+"px;left:"+data[i].x+"px;' onmousedown='myTopoDrag(event,this)'>"
				+"<div style='width: 100%;'><img draggable='false' src="+data[i].src+" style='"+img+"' /></div>"
				+"<small style='"+txt+"'>"+data[i].txt+"</small>"
			+"</div>";
			$('hgroup[uid="myTopo-number"]').append(str);
		}
	}
}
//line创建
function createLine(data,dom){
	var obj=$("canvas[uid='myTopo-canvas']")[0];
	var cav=obj.getContext("2d");
    cav.lineWidth = 1;
	for(var i=0;i<data.length;i++)createLineChild(data[i].fromKey,data[i].toKey,data[i].totalCount)
	function createLineChild(come,to,number){
		var come_x=subscript(come);
		console.log(come_x)
		
//		cav.beginPath();
//     	cav.moveTo(0+a, 0+b);
//     	cav.lineTo(100+a, 100+b);
//		cav.stroke();
		function subscript(obj){
			var x=[],y=[],z=[x,y],j=0;//不确定有几条，须为数组
			for(var i=0;i<data.length;i++){
				if(dom[i].key==come){
					x[j]=dom[i].x;
					y[j]=dom[i].y;
					j++;
				}
			}
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
				e_y_l=e_y_l-1
				e_r_c=0;
			}
		}

		
		
//		console.log(obj_n_r)
		
    	$(obj).css({top:e_x_t,left:e_y_l})
//      var w=$(window).width()-$('#drag').width();
//      var h=$(window).height()-$('#drag').height();
//      if(t<0){
//          t=0;
//          }
//      else if(t>h){
//          t=h;
//          }  
//       if(l<0){
//           l=0;
//           }
//       else if(l>w){
//            l=w;      
//           }

  		

		
		
		
		
	})
 	$(this).mouseup(function (event){
    	$(this).unbind("mousemove"); 
	});
}



//执行阶段
myTopoCreate(data);
