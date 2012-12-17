var fs	=	require('fs'),
	$NUVACONF	=	process.env.NUVAHOME + "/conf/";
	querystring	=	require('querystring');

exports.set = function(path,data){
		console.log(path);
	var query	=	querystring.parse(path.query);
	var	kind	=	query.kind,
		method	=	query.method;

	console.log(query);

	switch(kind)
	{
		case 'pool':
			var dataJson = JSON.parse(data);
			var poolConf = JSON.parse(fs.readFileSync($NUVACONF+'pool.conf'));
			switch(method)
			{
				case 'add':
					console.log('add pool');
					console.log(dataJson);
					if(!dataJson.id)
					{
						dataJson.id = new Date().getTime();
					}
					poolConf.unshift(dataJson);
					//poolConf[dataJson.id] = dataJson;
					//console.log(poolConf);
					fs.writeFile($NUVACONF+'pool.conf',JSON.stringify(poolConf),function(){ console.log("add pool "+dataJson.id+" success");});
					
					break;
				case 'set':
					poolConf[dataJson.id] = dataJson;
					console.log(dataJson.id);
					console.log(dataJson);
					console.log(poolConf[dataJson.id]);
					fs.writeFile($NUVACONF+'pool.conf',JSON.stringify(poolConf),function(){console.log("set pool success");});
					//console.log(dataJson);
					break;
				default:
					console.log("error dataset method");
				break;
			}
			break;
		default	:
			console.log("error dataset kind");
			break;
	}
	//console.log(path);
	//console.log("data = "+data);
}
