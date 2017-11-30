

//3.通用函数
function g(selector){
	var method=selector.substr(0,1)=='.'?'getElementsByClassName':'getElementById';
	return document[method](selector.substr(1));
}

//随机生成一个值 支持取值范围。random([min.max])
function random(range){
	var max=Math.max(range[0],range[1]);
	var min=Math.min(range[0],range[1]);
	var diff=max-min;
	var number=Math.round( (Math.random()*diff+min) );
	return number;
	//round是四舍五入，ceil是向上取整
}

//4.输出所有的海报
var data=data;
function addPhotos(){
	var template=g('#wrap').innerHTML;
	var html=[];
	var nav = [];//nnn

	for(s in data){//s=>0~19
		var _html=template.replace('{{index}}',s)
		        .replace('{{img}}',data[s].img)
		        .replace('{{caption}}',data[s].caption)
		        .replace('{{desc}}',data[s].desc);
		html.push(_html);  

		nav.push('<span id="nav_' + s + '" onclick = "turn( g(\'#photo_' + s + '\') )" class="i"></span>'); //nnn    
	}
	html.push('<div class="nav">' + nav.join("") + '</div>');//nnn

	g('#wrap').innerHTML=html.join('');
	rsort(random([0,data.length]));
}
addPhotos();

//6.计算左右分区范围
//{left:{x:[min,max],y:[]} , right:[  ]}
function range(){
	var range={left:{x:[],y:[]} , right:{x:[],y:[]}};

	var wrap={
		w:g('#wrap').clientWidth,
		h:g('#wrap').clientHeight
	}
	var photo={
		w:g('.photo')[0].clientWidth,
		h:g('.photo')[0].clientHeight
	}
	range.wrap=wrap;
	range.photo=photo;

	range.left.x=[0-photo.w/4,wrap.w/2-photo.w/2-150];
	range.left.y=[0-photo.h/4,wrap.h];

	range.right.x=[wrap.w/2+photo.w/2+150,wrap.w+photo.w/2-150];
	range.right.y=range.left.y

	return range;
}
//5.排序海报
function rsort(n){

	//去掉photo-center
	var _photo=g('.photo');
	var photos=[];
	for (s=0;s<_photo.length;s++){
		_photo[s].className=_photo[s].className.replace(/\s*photo_center\s*/,' ');

		//点击点点时，清除当前格式
		_photo[s].className=_photo[s].className.replace(/\s*photo_front\s*/,' ');
		_photo[s].className=_photo[s].className.replace(/\s*photo_back\s*/,' ');
		_photo[s].style.left='';
		_photo[s].style.top='';
		_photo[s].style['-webkit-transform']='rotate(0deg) scale(1.2)';
		//增加初始样式
		_photo[s].className+=' photo_front';

		photos.push( _photo[s] );//保存所有海报的数组
	}
	//添加photo-center
	var photo_center=g('#photo_'+n);
	photo_center.className +=' photo_center';
	//上面的p-c是从data里取的，但photos里还有这个p-c，所以要用splice切掉
	photo_center=photos.splice(n,1)[0];

	//把海报分为左右两部分
	var photos_left=photos.splice(0,Math.ceil(photos.length/2));
	var photos_right=photos;

	var ranges=range();
	for(s in photos_left){
		var photo=photos_left[s];
		photo.style.left=random(ranges.left.x)+'px';
		photo.style.top=random(ranges.left.y)+'px';

		photo.style['-webkit-transform']='rotate('+random([-150,150])+'deg) scale(1)';
	}
	for(s in photos_right){
		var photo=photos_right[s];
		photo.style.left=random(ranges.right.x)+'px';
		photo.style.top=random(ranges.right.y)+'px';
		photo.style['-webkit-transform']='rotate('+random([-150,150])+'deg) scale(1)';
	}

	//控制按钮处理nnn
	var navs=g('.i');
	for (var s = 0; s < navs.length; s++) {
		navs[s].className=navs[s].className.replace(/\s*i_current\s*/, ' ');
		navs[s].className=navs[s].className.replace(/\s*i_back\s*/, ' ');
	}
    g("#nav_" + n).className += " i_current";

	console.log(photos_left,photos_right);

}

//1.翻转控制
function turn(elem){
	var cls=elem.className;
	var n = elem.id.split('_')[1];//拆分出索引编号
	//点击圆圈是翻转
	if (!/photo_center/.test(cls) ) {
		return rsort(n);
	}

	if (/photo_front/.test(cls)) {
		cls=cls.replace(/photo_front/,'photo_back');
		g("#nav_" + n).className+=' i_back';
	}else{
		cls=cls.replace(/photo_back/,'photo_front');
		g("#nav_" + n).className = g("#nav_" + n).className.replace(/\s*i_back\s*/, " ");
	}
	return elem.className=cls;
}