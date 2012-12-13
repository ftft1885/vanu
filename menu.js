var fs = require('fs');
var querystring = require('querystring');

exports.router = function(path,callback)
{
	var query = querystring.parse(path.query);
	var kind = query.kind;
	var method = query.method;

	switch(kind)
	{

	case 'pool':
		switch(method)
		{
			case 'fetch':
			var jsonArr = [];
			var CONFPATH = process.env.NUVACONF || "./conf/";
			console.log(CONFPATH);
			var POOLPATH = CONFPATH + "/pools";
			var dirList = fs.readdirSync(POOLPATH);
			for(var key in dirList)
			{
				var filePath = POOLPATH + "/" + dirList[key];
				console.log(dirList[key]);
				if(fs.statSync(filePath).isDirectory() || dirList[key].indexOf('.')==0)
				{
					continue;
				}
				var data = fs.readFileSync(filePath) + "";
				var json = querystring.parse(data,"\n","\t");
				jsonArr.push(json);
				//console.log(json);
			}
			var str = JSON.stringify(jsonArr);
			//console.log(str);
			callback(str);
			break;

			case 'add':
				
			break;
		}
		break;

	case 'other':
	   break;	

	}
}
