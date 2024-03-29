window.nuvaView		=	{};
window.nuvaModel	=	{};
window.nuvaList		=	{};

nuvaView.add_new = Backbone.View.extend({
	tagName		:	'div',
	className	:	'add_new',
	template	:	_.template($('#add_new').html()),
	initialize	:	function(){
		this.render();
	},
	events		:	{
		'click .dialog_cancel'	:	'close',
		'click .dialog_close'	:	'close',
		'click .dialog_submit'	:	'submit',
	},
	submit		:	function(){
		console.log(this.model);
		this.model.set({
			name	:	$('#name').val(),
			monitor	:	$('#monitor').val(),
			protocol_layer	:	$('#protocol_layer').val(),
			nodes	:	$('#nodes').val(),
		});
		console.log(this.model);
		this.model.save(this.model.attributes,{url:'/setdata?kind=pool&method=add'});
		var view = new pools_detail({model:this.model});
		console.log(view.el);
		$('#pools_list').prepend(view.el);
		this.close();
	},
	close		:	function(){
		$('.add_new').remove();
	},
	render		:	function(){
		this.$el.html(this.template(this.attributes));
		return this;
	}
});

var pools_detail = Backbone.View.extend({
	tagName		:	'li',
	className	:	'pool_detail',
	template	:	_.template($('#pools_detail').html()),

	initialize	:	function(){
		console.log("detail initial");
		//console.log(this.model.toJSON());
		this.render();
		this.model.bind('change',this.render,this);//use to flash the data change
		this.model.bind('add',this.render,this);
		//TODO!!		
	},
	
	events		:	{
		'click' :	function(){
			this.model.on('all',function(e){
				console.log("this model event = "+ e);
			});
			var view_pool_setting = new nuvaView.pool_setting({model:this.model});
			$('.pool_setting').remove();//remove other setting div
			$('#main_content').append(view_pool_setting.el);
		}
	},
	
	render		:	function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});


nuvaView.pool_setting = Backbone.View.extend({
	tagName		:	'div',
	className	:	'pool_setting',
	template	:	_.template($('#pool_setting').html()),
	events		:	{
		'click .dialog_close'	:	'close',
		'click .dialog_cancel'	:	'close',
		'click .dialog_submit'	:	'submit',
	},
	close		:	function(){
		$('.pool_setting').remove();
	},
	submit		:	function(){
		this.model.set({
			nodes			:	$('#nodes').val(),
			monitor			:	$('#monitor').val(),
			max_reply_time	:	$('#max_reply_time').val(),
			protocol_layer	:	$('#protocol_layer').val()
		});
		this.model.save(this.model.attributes,{url:'/setdata?kind=pool&method=set'});
		this.close();
	},
	initialize	:	function(){
		this.render();
	},
	render		:	function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var pool_model = Backbone.Model.extend({
	defaults	:	{
		name			:	'服务池',
		protocol_layer	:	'undef',
		nodes			:	'undef',
		monitor			:	'ping',
		max_reply_time	:	30
	},
	initialize	:	function(){
		console.log("pool_model initial");
	},
});

var pool_collection = Backbone.Collection.extend({
	model	:	pool_model,
	url		:	'/getdata?kind=pool&method=fetch',
});

var pools = new pool_collection;

var pools_view = Backbone.View.extend({
	tagName		:	'div',
	template	:	_.template($('#pools_div').html()),
	initialize	:	function(){
		this.render();
		pools.bind('reset',this.addAll,this);
		pools.bind('add',this.addOne,this);
		pools.fetch();
	},
	addOne	:	function(one_pool_model){
		var view = new pools_detail({model:one_pool_model});
		console.log(one_pool_model);
		$('#pools_list').append(view.el);		
	},
	events	:	{
		'click .button_add_new'	:	function(){		
				console.log(pools.toJSON());
				var attrs = {
					kind	:	menu,
					title	:	"服务池",
					_name	:	"服务池名称",
					_nodes	:	"服务节点",
					_protocol_layer	:	"protocol_layer",
					_monitor	:	"健康检查",
					name	:	"name",
					nodes	:	"nodes",
					protocol_layer	:	"protocol_layer",
					monitor	:	"monitor",
				};
				var view = new nuvaView.add_new({model:new pool_model(),attributes:attrs});
				$('#main_content').append(view.el);	
		}
	},
	addAll	:	function(){
		pools.each(this.addOne);
	},
	render	:	function(){
		this.$el.html(this.template({
			name		:	'服务池',
			introduction:	"服务池管理服务节点的组。其基于负载平衡和会话保持标准，将流量传递到最适合的服务节点。",
		}));
		return this;
	}
});

window.nuvaRouter = Backbone.Router.extend({
	initialize	:	function(){
		console.log("router initial");
	},

	routes	:	{
		""			:	"index",
		":menu"		:	"poolsFunc",
		//":menu/addnew"	:	"addNewFunc"
	},

	index		: function(){
		console.log("homepage");
	},
	poolsFunc	: function(menu){
		console.log("you click "+menu);
		console.log(pools_view);
		$('#main_content').append(new pools_view().el);
	}
});
new nuvaRouter();
Backbone.history.start();


