var http	=	require("http");
var fs		=	require("fs");
var url 	=	require("url");
var menu = require("./menu");
var port = 80;
var env = process.env.NUVAHTML;
http.createServer(function(req,res)
{
	var pathname = url.parse(req.url).pathname;
	console.log(pathname);
	/*
	if(req.url.indexOf(".css") == req.url.length - 4)
	{
		console.log(pathname);
		fs.readFile(env+pathname,function(err,data)
		{
			res.writeHead(200,{'Content-Type':'text/css'});
			res.end(data);
		});
	}
	res.writeHead(200,{'Content-Type':'text/html'});
	fs.readFile('index.html',function(err,data)
	{
		res.end(data);
	});
	//res.end("test");
	*/

	if(req.url == "/")
	{
			res.writeHead(302,{'Location':'/index.html'});
			res.end();
	}
	console.log(env + pathname);
	if(pathname == '/data')
	{
			console.log("ask for data");
			menu.router(pathname,function(data)
			{
				res.writeHead(200,{'Content-Type':'text/html'});
				res.end(data);
				return;
			});
	}
	else
	{

	fs.readFile(env + pathname,function(err,data)
	{
		if(err)
		{
			console.log(err);
			res.writeHead(404,{'Content-Type':'text/html'});
			res.end("404 NOT FOUND");
		}
		else if(req.url.indexOf(".css") == req.url.length - 4)
		{
			res.writeHead(200,{'Content-Type':'text/css'});
			res.end(data);
		}
		else if(req.url.indexOf(".js") == req.url.length - 3)
		{
			res.writeHead(200,{'Content-Type':'text/javascript'});
			res.end(data);
		}
		else if(req.url.indexOf(".html") == req.url.length - 5)
		{
			res.writeHead(200,{'Content-Type':'text/html'});
			res.end(data);
		}
		else if(req.url.indexOf(".ico") == req.url.length - 4)
		{
			res.writeHead(200,{'Content-Type':'image/x-icon'});
			res.end(data);
		}
	});
	}

}).listen(port,function(err)
{
	if(!err)
	{
		console.log("Server on " + port);
	}
});


