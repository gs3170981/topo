//唯一调用入口
function myTopoCreate(rel){
//---------------------所有对外的接口------------------------------------------------------
//-------------------------初始化----------------------------------------------------------
//p:父类、c:子类、d:数据、l:线、key:id、i:icon字段名、val:值、is:类别、t:文字宽度、s:font-size
//-----------------------------------------------------------------------------------------
	var data={//默认输出项
		klass:{
			p_w:700,
			p_h:500,
			p_k:'',
			c_w:80,
			c_k:'box-shadow:0 0 10px #b7c0c1;border-radius:10px;',
			c_list_s:10,
			img_w:50,
			img_h:50,
			fa_s:20,//fa-size
			t_s:14,//smail-size
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
			c_id:'locationId',
			c_list:[],
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
			on:'dblclick',//对dom双击
			e:function(){
//				console.log('true');
			},
			up:function(data,obj){//松开
//				console.log('true');
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
			$(klass.append).append(str);
		}
		//模块创建
		function createDiv(data){
			var klass=data.klass;
			var inter=data.InterFace;
			var info=data.data.c_d;
			var Event=data.Event;
			for(var i=0;i<info.length;i++){
				var img_fa="<img draggable='false' src='./images/icons/"+info[i][inter.c_d_i]+".png' style='height:"+klass.img_h+"px;width:"+klass.img_w+"px;' />"
				if(inter.img_is=='fa')img_fa="<i class='fa "+info[i][inter.c_d_i]+"' style='width: 100%;font-size:"+klass.fa_s+"px'></i>"
				var list=inter.c_list;
				var listSum='';
				if(list.length)
					for(var j=0;j<list.length;j++)
						listSum+="<p style='word-break:break-all;width:100%;text-align:left;font-size:"+klass.c_list_s+"px;'>"+list[j].title+":<span style='float:right'>"+info[i][list[j].value]+"</span></p>"
				var str="<div locatId="+info[i][inter.c_id]+" uid="+info[i][inter.c_d_key]+" style='padding:10px 20px;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;min-width:"+klass.c_w+"px;text-align:center;position:absolute;cursor:pointer;"+klass.c_k+";top:"+info[i][inter.c_d_y]+"px;left:"+info[i][inter.c_d_x]+"px;' >"
					+img_fa
					+"<p style='word-break:break-all;width:100%;font-size:"+klass.t_s+"px;'>"+info[i][inter.c_d_val]+"</p>"
					+listSum
				+"</div>";
				$('hgroup[uid="myTopo-number"]').append(str);
				var obj=$("div[uid='"+info[i][inter.c_d_key]+"']");
				$(obj).on('mousedown',function(){
					myTopoDrag(event,this);
				});
				$(obj).on(Event.on,function(){
					Event.e(data,this);
				});
			}
		}
		//number创建
		function createNumber(data,opt,klass){
			for(var i=0;i<data.length;i++){
				var objMid=mid(lineSubscript(data[i][opt.l_d_start]),lineSubscript(data[i][opt.l_d_end]));
				if(!objMid){
					layer.msg('线与节点不匹配！');
					return false;
				}
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
		if(!fromKey || !toKey)return false;
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
			createLineChild(data[i][opt.l_d_start],data[i][opt.l_d_end],klass.l_c_old);
		}
		//子线的创建
		function createLineChild(come,to,color){
			var obj={};
			obj.come=lineSubscript(come);
			obj.to=lineSubscript(to);
			if(!obj.come || !obj.to)return false;//如果对应线则返回
			cav.beginPath();
	       	cav.moveTo(obj.come.x,obj.come.y);
	       	
	       	//come会触发两遍--目前暂时没问题
	       	var succTo=segReturn(obj.come,obj.to,rectFour(to,obj.to));

	       	cav.lineTo(succTo.x,succTo.y);
			cav.stroke();
			
			var angle=getAngle(obj.come.x,obj.come.y,succTo.x,succTo.y);
			console.log(angle,come,to);
//			draw(,color,'fill');
			//绘画三角
			var draw = function(one,two,three,color,type){
			    cav.beginPath();
			    cav.moveTo(one.x,one.y);
			    cav.lineTo(two.x,two.y);
			    cav.lineTo(three.x,three.y);
			    cav[type + 'Style'] = color;
			    cav.closePath();
			    cav[type]();
			}
			//计算角度
			function getAngle(px1, py1, px2, py2) {
		        x=px2-px1;
		        y=py2-py1;
		        hypotenuse = Math.sqrt(Math.pow(x, 2)+Math.pow(y, 2));
		        cos=x/hypotenuse;
		        radian=Math.acos(cos);
		        angle=180/(Math.PI/radian);
		        if(y<0)
	            	angle=-angle;
	            else if((y==0) && (x<0))
	            	angle=180;
		        return angle;
			}
			
			
			//获取四点
			function rectFour(obj,to){
				var obj=$("div[uid='"+obj+"']");
				var o_w=($(obj).width()+40)/2;
				var o_h=($(obj).height()+20)/2;
				var four={
					t_l:{
						x:to.x-o_w,
						y:to.y+o_h
					},t_r:{
						x:to.x+o_w,
						y:to.y+o_h
					},b_l:{
						x:to.x-o_w,
						y:to.y-o_h
					},b_r:{
						x:to.x+o_w,
						y:to.y-o_h
					}
				}
				return four;
			}
			//两条线段计算交点
			function segmentsIntr(a,b,c,d){
				var area_abc=(a.x-c.x)*(b.y-c.y)-(a.y-c.y)*(b.x-c.x);
				var area_abd=(a.x-d.x)*(b.y-d.y)-(a.y-d.y)*(b.x-d.x);
				if(area_abc*area_abd>=0)return false;
				var area_cda=(c.x-a.x)*(d.y-a.y)-(c.y-a.y)*(d.x-a.x);
				var area_cdb=area_cda+area_abc-area_abd;
				if(area_cda*area_cdb>=0)return false;
				var t=area_cda/(area_abd-area_abc);
				var dx=t*(b.x-a.x),dy=t*(b.y-a.y);
				return{x:a.x+dx,y:a.y+dy};
			}
			//获取正确的相交点
			function segReturn(come,to,four){
				var top=segmentsIntr(come,to,four.t_l,four.t_r);
				if(top)return top;
				var right=segmentsIntr(come,to,four.t_r,four.b_r);
				if(right)return right;
				var bottom=segmentsIntr(come,to,four.b_r,four.b_l);
				if(bottom)return bottom;
				var left=segmentsIntr(come,to,four.t_l,four.b_l);
				if(left)return left;
			}
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
				z.x=dom[i].x+$(id).width()/2+20;
				z.y=dom[i].y+$(id).height()/2+10;
				return z;
			}
		}
	}
	//拖动监听
	function myTopoDrag(event,obj){
		//初始化-----------------------------------------------------------
		//e:鼠标坐标、obj:当前对象、p:父级对象、n:当前变量、c:临时变量
		//-----------------------------------------------------------------
		var is=true;
		var data_self=data;//data传参
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
	 	$(this).mouseup(function(event){
	 		if(is){
	 			$(this).unbind("mousemove");
//	    		松开鼠标绑定事件
				myTopoRelease(obj,data_self);
	    		is=false;
	 		}
		});
		//用户绑定事件
		function myTopoRelease(obj,data){
			var x=$(obj).position().left;
			var y=$(obj).position().top;
			var name=$(obj).attr('uid');
			var locatId=$(obj).attr('locatId');
			data.Event.up(x,y,name,locatId);
		}
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
