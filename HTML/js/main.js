window.nuvaRouter = Backbone.Router.extend({
	initialize	:	function(){
		console.log("router initial");
	},

	routes	:	{
		""			:	"index",
		":menu"		:	"poolsFunc",
		":menu/addnew"	:	"addNewFunc"
	},

	index		: function(){
		console.log("homepage");
	},
	addNewFunc	:	function(menu){
		switch(menu){
			case "pools"	:
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
				//console.log(new nuvaView.add_new());
			break;
		}
	},
	poolsFunc	: function(menu){
		console.log("you click "+menu);
		$('#main_content').append(new pools_view().el);
	}
});
new nuvaRouter();
Backbone.history.start();

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
		//console.log(this.model.toJSON());
		console.log(this.model);
		this.model.save(this.model.attributes,{url:'/setdata?kind=pool&method=add'});
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
	template	:	_.template($('#pools_detail').html()),

	initialize	:	function(){
		console.log("detail initial");
		//console.log(this.model.toJSON());
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
		$('#pools_list').append(view.el);		
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

