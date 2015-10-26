var mongoose=require('mongoose');
var keys=require('./../keys/keys.json');
mongoose.connect(keys.mongoose.url);
var async=require('async');
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
var db=mongoose.connection;
var userSchema=mongoose.Schema({
	Name:{
		type:String,
		default:null
	},
	emailId:{
		type:String,
		default:null
	},
	phoneNumber:{
		type:Number,
		default:0
	},
	address:{
		type:String,
		default:null
	},
	cityName:{
		type:String,
		default:null
	},
	loc: { 
		type: { type: String },
		coordinates: [ ] 
	},
	posts:[{
		Name:{
			type:String,
			default:null
		},
		date:{
			type:Date,
			default:Date.now
		},
		Status:{
			type:Number,
			default:0
		},
		loc: { 
			type: { type: String },
			coordinates: [ ] 
		},
		contactNumber:{
			type:Number,
			default:0
		},
		contactMail:{
			type:String,
			default:null
		},
		Notice:{
			type:String,
			default:null
		},
		posterURL:{
			type:String,
			default:null
		}
	}]
});
var users=mongoose.model('users',userSchema);
db.on('error',console.error.bind(console,"connection error"));
db.on('open',function(){
	console.log('Connected to DB');
});
exports.getStatsForMonth=function(req,res){
	var yr=req.params.yr;
	var month=req.params.month;
	users.find({posts:{"$in":[{date:new Date(yr,month,1)}]}},function(err,doc){
		console.log(doc);
		if(err)
			res.send(err);
		else
			res.render('statsByTime',{data:doc});
	});
}
var finalMail,finalNumber;
exports.getStatsForLocation=function(req,res){
	var lat=req.params.latitude;
	var lng=req.params.longitude;
	users.find({loc:{
		$nearSphere: msg.loc.coordinates,
        $maxDistance: 50
	}},function(err,docs){
		if (err) {
          res.send(err);
        }
        res.render('statsForLocation',{data:doc});
	});
}
/*exports.submitData=function(req,res){
	users.find({emailId:req.params.youremail},function(err,doc){
		if(!doc)
		{
			var obj={};
			obj.name=req.params.fullname;
			obj.status='false';
			obj.loc={
				type:'Point',
				coordinates:[parseFloat(req.params.lng), parseFloat(req.params.latt)]
			};
			obj.contactNumber=req.params.contactNumber;
			obj.contactMail=req.params.contactMail;
			doc.posts.push(obj);
			doc.save();
		}
		else
		{
			console.log('In else');
			var temp={};
			temp.Name=req.params.yourname;
			temp.emailId=req.params.youremail;
			temp.phoneNumber=req.params.contactNumber;
			temp.loc={
				type:'Point',
				coordinates:[parseFloat(req.params.lng), parseFloat(req.params.latt)]
			};
			var obj={};
			obj.Name=req.params.fullname;
			obj.Status=0;
			obj.loc={
				type:'Point',
				coordinates:[parseFloat(req.params.lng), parseFloat(req.params.latt)]
			};
			obj.contactNumber=req.params.contactNumber;
			obj.contactMail=req.params.contactMail;
			temp.posts=[obj];
			var dc=new users(temp);
			//dc.save();
			dc.save(function (err, msg) {
	    			if (err) {
	      				res.send(err);
	    			} else {
					console.log('Saved');
					users.find({loc:{
							$nearSphere: obj.loc.coordinates,
	        				$maxDistance: 50
						}
					},
					function(err,docs){
						if (err)
						{
		          			res.send(err);
		        		}
		        		var len=docs.length;
		        		finalMail=docs[0].emailId;
		        		finalNumber=docs[0].phoneNumber;
		        		for(var idx=1;idx<len;idx++)
		        		{
		        			finalMail+=','+docs.emailId;
		        			finalNumber+=','+docs.phoneNumber;
		        		}
		        		console.log(finalMail);
		        		console.log(finalNumber);
		        		async.parallel([
							function(done){
								//twitter
								twitter.post('statuses/update',
					             {'status' : 'Awesome '},
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
								    to: 'goyal.rahul030@gmail.com,vipinkhushu@hotmail.com', // list of receivers
								    subject: 'Lost Lost ✔', // Subject line
								    text: 'Following child has been lost✔', // plaintext body
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
						            body: 'Hello!' // body of the SMS message
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
									console.log('canvas');
						});
					});
				}
			});
			
		}
		
	});
}*/