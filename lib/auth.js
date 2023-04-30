const client = require('./lib/mongo.js');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const database_name = "sponsormatch";

const jwt=require('jsonwebtoken')
const jwt_expiration= 86400000
const jwtsalt='privatekey'

const salt='$2b$10$Imnq7Q2r0RS7DqaKV0rpPe'


app.use(bodyParser.json())
app.use(cookieParser())


async function AUTH (req, res, collection) {
   
        if (collection == 'signin') {
            app.post('/api/auth/signin',(req,res))
        } 
        else{
            app.post('/api/auth/signup',(req,res))
        }
      }
 app.post('/api/auth/signup',(req,res)=>{
	console.log(req.body)
	database_name.collection(collection).find({email:req.body.email},{email:1}).toArray(function(err, result){
		if (err) throw err
		if(result.length>0) res.status(406).json({message:'User already exists'})
		else{
			req.body.password=bcrypt.hashSync(req.body.password,salt).replace(`${salt}.`,'')
			database_name.collection('collection').insertOne(req.body,function(err,result){
				if (err) throw err
				res.status(201).json({message:'User created'})
			})
		}
	})
})
app.post('/api/auth/signin',(req,res)=>{
	database_name.collection(collection).find({email:req.body.email},{_id:1,email:1,password:1}).toArray(function(err, result){
		console.log(result)
		if (err) throw err
		if(result.length==0) res.status(406).json({message:'User is not registered'})
		else{
			if(result[0].password!=bcrypt.hashSync(req.body.password,salt).replace(`${salt}.`,'')) return res.status(406).json({message:'Wrong password'})
			else{
				userId=result[0]._id.toString().replace('New ObjectId("','').replace('")','')
				console.log(userId)
				let token=jwt.sign({id:userId},jwtsalt,{expiresIn:jwt_expiration})
				database_name.collection(collection).updateOne({_id:ObjectId(userId)},{$set:{jwt:token}},function(err,result){
					if (err) throw err
					res.status(200).setHeader('Authorization', `Bearer ${token}`).json({message:'User authenticated'})
				})
			}
		}
	})
})