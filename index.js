var app=require('express')();
var cpuCores=require('os').cpus().length;
var cluster=require('cluster');
var request=require('request');
if(cluster.isMaster)
{
	console.log('Master cluster setting up ' + cpuCores + ' workers...');
	for (var i = 0; i < cpuCores; i++) {
        cluster.fork();
    };
    cluster.on('online',function(worker){
        console.log('Worker ' + worker.process.pid + ' is online');
    });
    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
        cluster.fork();
    });
}else
{
	var urlAadhar="https://ac.khoslalabs.com/hackgate/hackathon/auth/raw";
	var express=require('express')
	var app=express();
	bodyParser   = require('body-parser');
  	app.use(bodyParser.urlencoded({ extended: true }));
  	app.use(bodyParser.json());
  	app.set('view engine', 'ejs');
  	app.use(express.static(__dirname + '/public'));
  	app.set('views', __dirname + '/views');
	routes=require('./routes');
	app.use('/',routes);
	app.use('/submit',routes);
	app.post('/verify',function(req,res){
		var data='{"aadhaar-id":'+req.body.aadhaar+','+'"modality":"demo","device-id":"tarungarg","certificate-type":"preprod","demographics":{"name":{"name-value":'+req.body.Name+'},"address-format":"freetext","address-freetext":{"matching-strategy":"partial","matching-value":"50","address-value":'+req.body.address+'}},"location":{"type":"pincode","pincode":'+req.body.pincode+'}}';
		//res.send(json);
		data=JSON.stringify(data);
		request.post({url:urlAadhar,form:JSON.parse(data)},function(err,httpResponse,responseBody){
  			if(err)
				res.send(err);
			else{
				res.send(responseBody);
			}
  		});
	});	
	app.listen(3000,function(){
        console.log('Process ' + process.pid + ' is listening to all incoming requests');
	});
}
