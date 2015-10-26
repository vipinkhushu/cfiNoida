var express = require('express');
var router = express.Router();
var async=require('async');
var db=require('../db');
var bodyParser=require('body-parser');
var keys=require('./../keys/keys.json');
var client = require('twilio')(keys.twilio.key1,keys.twilio.key2);
var twitter = require('simple-twitter');
 twitter = new twitter(keys.twitter.consumerKey, //consumer key from twitter api
                       keys.twitter.consumerSecretKey, //consumer secret key from twitter api
                       keys.twitter.token, //acces token from twitter api
                       keys.twitter.secretToken//acces token secret from twitter api
                       );
 var nodemailer = require('nodemailer');
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: keys.gmail.user,
        pass: keys.gmail.password
    }
});
// middleware specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/submit',function(req,res){
	async.parallel([
			function(done){
				//twitter
				twitter.post('statuses/update',
	             {'status' : 'CheckOut someone has lost '},
	                function(error, data) {
	                	if(error)
	                		return done(error);
	                	else
	                    	console.log("Successfully Tweeted");
	            		done();
	                    //res.send(data);
	                }
	            );
			},
			function(done){
				//mail
				var mailOptions = {
				    from: 'Tarun Garg <tarungarg546@gmail.com>', // sender address
				    to: 'vipinkhushu@hotmail.com', // list of receivers
				    subject: 'Hello ✔', // Subject line
				    text: 'Hello world ✔', // plaintext body
				    html: 'Embedded image: <img src="cid:unique@kreata.ee"/>',
	    			attachments: [{
	        			filename: 'image.jpg',
	        			path: 'images/test.jpg',
	        			cid: 'unique@kreata.ee' //same cid value as in the html img src
	    			}]
				};
	    		// send mail with defined transport object
				transporter.sendMail(mailOptions, function(error, info){
				    if(error){
				        return done(error);
				    }
				    console.log('Message sent: ' + info.response);
				    done();
				});

			},
			function(done){
				//msg
				client.sendMessage({
		            to:'+919802893707', // Any number Twilio can deliver to
		            from: '+16572208653', // A number you bought from Twilio and can use for outbound communication
		            body: 'Check out someone has lost!' // body of the SMS message
		        }, function(err, responseData) { //this function is executed when a response is received from Twilio
		            if(err)
		             return done(err);
		            if (!err) { // "err" is an error received during the request, if any
		                // "responseData" is a JavaScript object containing data received from Twilio.
		                // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
		                // http://w...content-available-to-author-only...o.com/docs/api/rest/sending-sms#example-1
		                console.log("From "+responseData.from+ " To "+responseData.to); // outputs "+14506667788"
		                console.log(responseData.body); // outputs "word to your mother.
		                done();
		            }
		        });
			}
		],function(err){
			if(err)
				console.log(err);
			else
				res.render('index');
		});
});
var db=require('../db');
// define the about route
router.get('/submitReport',function(req,res){
	res.render('submitReport');
});
router.get('/canvas',function(req,res){
	res.render('canvas');
})
router.get('/check',function(req,res){
	res.render('checkfb');
});
router.post('/sendUserData',function(req,res){
    console.log(" int the  user" , req.body);
	res.render('submitReport',{data:req.body});
});/*
routes.post('/submit',function(req,res){
	var 
});*/
module.exports = router;
