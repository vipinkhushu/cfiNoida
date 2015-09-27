var app=require('express')();
var cpuCores=require('os').cpus().length;
var cluster=require('cluster');
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
	var app=require('express')();
	require('./config/server')(app);
	app.get('/',function(err,res){
		res.render('index');
	})
	app.listen(3000,function(){
        console.log('Process ' + process.pid + ' is listening to all incoming requests');
	});
}
