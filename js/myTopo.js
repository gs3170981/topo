//唯一调用入口
function myTopoCreate(rel){
//---------------------所有对外的接口------------------------------------------------------
//-------------------------初始化----------------------------------------------------------
//p:父类、c:子类、d:数据、l:线、key:id、i:icon字段名、val:值、is:类别、t:文字宽度、s:font-size
//-----------------------------------------------------------------------------------------
	var data={
		klass:{
			p_w:700,
			p_h:500,
			p_k:'',
			c_w:80,
			c_k:'box-shadow:0 0 10px #b7c0c1;border-radius:10px;',
			img_w:50,
			img_h:50,
			fa_s:20,//fa-size
			t_s:13,//smail-size
			l_s:15,//line-number-size
			l_c:'rgba(83,6,155,0.5)',
			l_c_old:'rgba(83,6,155,0.15)',
			append:'body'
		},
		InterFace:{
			img_is:'img',//fa or img
			c_d_x:'x',
			c_d_y:'y',
			c_d_key:'key',
			c_d_i:'src',
			c_d_val:'txt',
			l_d_start:'fromKey',
			l_d_end:'toKey',
			l_d_val:'totalCount'
		},
		data:{
			c_d:rel.data.c_d,
			l_d:rel.data.l_d
		},
		Event:{
			on:'dblclick',//用jq
			e:function(){
				console.log('true')
			}
		}
	}
	data.klass=arrForSubscript(data.klass,rel.klass);
	data.InterFace=arrForSubscript(data.InterFace,rel.InterFace);
	data.Event=arrForSubscript(data.Event,rel.Event);
	//缺省字段处理-数据处理阶段
	function arrForSubscript(def,rel){
		if(!rel)return def;
		for(var i in def){
			if(rel.hasOwnProperty(i)){
				def[i]=rel[i];
			}
		}
		return def;
	}
	myTopoStart(data);
	//执行阶段
	function myTopoStart(data){
		ready(data.klass);
		createDiv(data);
		createLine(data.data.l_d,data.data.c_d,null,data.InterFace,data.klass);
		createNumber(data.data.l_d,data.InterFace,data.klass);
		//部署阶段-DOM父级创建
		function ready(klass){
			var str="<article style='width:"+klass.p_w+"px;height:"+klass.p_h+"px;position:relative;margin:0 auto;"+klass.p_k+";' >"//border:1px solid red;
				+"<hgroup uid='myTopo-number' style='position:absolute;width:100%;height:100%;z-index:1'></hgroup>"
				+"<canvas uid='myTopo-canvas' height='"+klass.p_h+"' width='"+klass.p_w+"' style='position:absolute;'></canvas>"
			+"</article>"
			$(klass.append).append(str);//后期修改位置
		}
		//模块创建
		function createDiv(data){
			var klass=data.klass;
			var inter=data.InterFace;
			var info=data.data.c_d;
			var Event=data.Event;
			for(var i=0;i<info.length;i++){
				var img_fa="<img draggable='false' src="+info[i][inter.c_d_i]+" style='height:"+klass.img_h+"px;width:"+klass.img_w+"px;' />"
				if(inter.img_is=='fa')img_fa="<i class='fa "+info[i][inter.c_d_i]+"' style='width: 100%;font-size:"+klass.fa_s+"px'></i>"
				var str="<div uid="+info[i][inter.c_d_key]+" style='padding:10px 20px;width:"+klass.c_w+"px;text-align:center;position:absolute;cursor:pointer;"+klass.c_k+"background:white;top:"+info[i][inter.c_d_y]+"px;left:"+info[i][inter.c_d_x]+"px;' >"
					+img_fa
					+"<small style='word-break:break-all;float:left;overflow:auto;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;width:100%;font-size:"+klass.t_s+"px;'>"+info[i][inter.c_d_val]+"</small>"
				+"</div>";
				$('hgroup[uid="myTopo-number"]').append(str);
				$("div[uid='"+info[i][inter.c_d_key]+"']").on('mousedown',function(){
					myTopoDrag(event,this);
				});
				$("div[uid='"+info[i][inter.c_d_key]+"']").on(Event.on,function(){
					Event.e();
				});
			}
		}
		//number创建
		function createNumber(data,opt,klass){
			for(var i=0;i<data.length;i++){
				var objMid=mid(lineSubscript(data[i][opt.l_d_start]),lineSubscript(data[i][opt.l_d_end]));
				if(!data[i][opt.l_d_val])data[i][opt.l_d_val]='';//缺省则输出空
				var str="<small uid="+(data[i][opt.l_d_start]+data[i][opt.l_d_end])+" style='position:absolute;top:"+objMid.y+"px;left:"+objMid.x+"px;font-size:"+klass.l_s+"px;'>"+data[i][opt.l_d_val]+"</small>"
				$('hgroup[uid="myTopo-number"]').append(str);
				//输出后校正，否则获取不到宽高
				numberSubscript(data[i],opt);
			}
			//number坐标校正
			function numberSubscript(str,opt){
				var obj=$("small[uid='"+(str[opt.l_d_start]+str[opt.l_d_end])+"']");
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
	function createLine(data,dom,sel,opt,klass){
		var obj=$("canvas[uid='myTopo-canvas']")[0];
		var cav=obj.getContext("2d");
		var cache=0;
	    cav.lineWidth=1;
	    cav.strokeStyle=klass.l_c_old;
	    cav.clearRect(0,0,obj.width,obj.height);//清除重绘
		for(var i=0;i<data.length;i++){
			if(sel)if(cache<sel.length&&i==sel[cache]){
		    	cav.strokeStyle=klass.l_c;
		    	cache++;
		   	}else cav.strokeStyle=klass.l_c_old;
			createLineChild(data[i][opt.l_d_start],data[i][opt.l_d_end])
		}
		//子线的创建
		function createLineChild(come,to){
			var obj={};
			obj.come=lineSubscript(come);
			obj.to=lineSubscript(to);
			cav.beginPath();
	       	cav.moveTo(obj.come.x,obj.come.y);
	       	cav.lineTo(obj.to.x,obj.to.y);
			cav.stroke();
		}
	}
	//坐标校正
	function lineSubscript(obj){
		var z={};
		var dom=data.data.c_d;
		var opt=data.InterFace;
		for(var i=0;i<dom.length;i++){
			if(dom[i][opt.c_d_key]==obj){
				var id=$('div[uid="'+dom[i][opt.c_d_key]+'"]');
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
			var obj_n_b=p_h-obj_n_t-obj_h;
			var obj_n_l=$(obj).position().left;
			var obj_n_r=p_w-obj_n_l-obj_w;

			var e_n_x=event.clientX;//now_X
			var e_n_y=event.clientY;
			//移动偏差
			var e_x_t=obj_t+(e_n_y-e_y);
			var e_y_l=obj_l+(e_n_x-e_x);
			//范围限定
			if(obj_n_b<21){//bottom
				e_x_t=p_h-obj_h-19;//与pading相关
				if(!e_b_c)e_b_c=e_n_y;
				else if(e_n_y<e_b_c){
					e_x_t=e_x_t-2//与pading相关
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
			}if(obj_n_r<41){//right
				e_y_l=p_w-obj_w-39;
				if(!e_r_c)e_r_c=e_n_x;
				else if(e_n_x<e_r_c){
					e_y_l=e_y_l-2
					e_r_c=0;
				}
			}
			var nodeInfo=data.data.c_d;
			var nodeLinkInfo=data.data.l_d;
			var opt=data.InterFace;
			var objIndex=subscript($(obj),nodeInfo,opt);
			nodeInfo[objIndex][opt.c_d_x]=e_y_l;
			nodeInfo[objIndex][opt.c_d_y]=e_x_t;
			//牵动有关系的中央数值
			var sel=getAllNumber($(obj).attr('uid'),nodeLinkInfo,opt);
			//牵动所有线
			createLine(nodeLinkInfo,nodeInfo,sel,opt,data.klass);
	    	$(obj).css({top:e_x_t,left:e_y_l});
		})
	 	$(this).mouseup(function (event){
	    	$(this).unbind("mousemove");
	    	
//	    	松开鼠标并传当前对象key坐标值
	    	
		});
		function subscript(obj,all,opt){
			var id=$(obj).attr('uid');
			for(var i=0;i<all.length;i++)
			if(all[i][opt.c_d_key]==id)return i;
		}
		function getAllNumber(obj,data,opt){
			var arr=[];
			for(var i=0;i<data.length;i++){
				if(data[i][opt.l_d_start]==obj || data[i][opt.l_d_end]==obj){
					var objMid=mid(lineSubscript(data[i][opt.l_d_start]),lineSubscript(data[i][opt.l_d_end]));
					var obj_c=$("small[uid='"+(data[i][opt.l_d_start]+data[i][opt.l_d_end])+"']");
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
}
