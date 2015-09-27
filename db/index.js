var mongoose=require('mongoose');
mongoose.connect('mongodb://cfinoida:cfinoida@ds051923.mongolab.com:51923/cfinoida');
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
	district:{
		type:String,
		default:null
	},
	posts:[{
		name:{
			type:String,
			default:null
		},
		date:{
			type:Date,
			default:Date.now
		},
		status:{
			type:Number,
			default:0
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
	console.log('Yo Yo!');
});