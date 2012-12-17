var fs = require('fs');
var querystring = require('querystring');
var $NUVACONF = process.env.NUVAHOME + '/conf/';

exports.router = function(path,callback)
{
	//console.log(path);
	var query = querystring.parse(path.query);
	console.log(query);
	var kind = query.kind;
	var method = query.method;

	switch(kind)
	{

	case 'pool':
		var poolConfPath = $NUVACONF + 'pool.conf';
		var poolConfStr = fs.readFileSync(poolConfPath);
		var poolConf = JSON.parse(poolConfStr);
		//console.log(poolConf);

		switch(method)
		{
				
			case 'fetch':
	
				var resultArr = [];
				for(var key in poolConf)
				{
					poolConf[key].id = key;
					resultArr.push(poolConf[key]);
				}
				var result = JSON.stringify(resultArr);
				//fs.writeFile($NUVACONF+'pool.conf',result,function(){console.log("add id");})
				callback(result);
				
				//console.log(resultArr);

			/*
			poolConf = {};
			var jsonArr = [];
			var CONFPATH = process.env.NUVACONF || "./conf";
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
				poolConf[dirList[key]] = json;
				//console.log(json);
			}
			var str = JSON.stringify(jsonArr);
			var poolConfStr = JSON.stringify(poolConf);
			fs.writeFile('./conf/pool.conf',poolConfStr,function(){
				console.log("write OK");
			});
			//console.log(str);
			callback(str);
			
			break;

			case 'add':
				
			break;
			*/
		}
		break;

	case 'other':
	   break;	

	}
}
