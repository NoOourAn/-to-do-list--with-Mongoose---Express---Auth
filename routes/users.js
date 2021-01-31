var express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var router = express.Router()
const {User , Todo} = require('../models/model')
const authMiddleWare = require('../middleware/auth');


/////USERS ROUTES
///Get All Logged in Users 
router.get('/', async (req, res) =>{
  try{
    const LoggedInUsers = await User.find({ loggedIn: true}, 'firstname').exec();
    res.send(LoggedInUsers)

  }catch(err){
    res.status(422).send({message:"no logged in users !"})

  }

  })
  
  ///REGISTER
  router.post('/register', async (req, res) =>{
    try{
      const {username,password,firstname,age,gender} = req.body;
      const FoundUser = await User.findOne({ username }).exec();
      if(FoundUser) throw new Error("username already exists !!")

      ///if username unique
      const HashedPassword = await bcrypt.hash(password, 10);

      if(HashedPassword){
        User.create({ username,password:HashedPassword,firstname ,age ,gender}, function (err, user) {
        if (err) throw new Error("database error !!");

        res.send({message:"user registered successfully !",user:user})
        
      });
      }else throw new Error("please provide password !!")

    }catch(err){
        res.status(422).send({error:err.message})
    }

  })


  ////LOGIN
  router.post('/login', async (req, res) =>{
    try{

      const {username,password} = req.body;
      if(username && password){

        const user  = await User.findOne({ username }).exec(); 
        if(!user) throw new Error("wrong username or password!!")
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) throw new Error("wrong username or password!!");
  
  
        const LoggedUser = await User.findOneAndUpdate({ username }, { loggedIn: true }).exec();
        // console.log(LoggedUser);
        if(LoggedUser){
          //prepare token for user
          var token = await jwt.sign({ id: LoggedUser.id }, 'Awesomeness');
          if(!token) throw new Error("something went wrong !!");
          // res.send({token});
          // population of user -_-
          const FoundTodos = await Todo.find({ user:LoggedUser.id }).populate('user').exec();
          if(FoundTodos){
                const obj = {
                message: "logged in successfully",
                username,
                latestTodos: (FoundTodos.length ? todos : 'no todos'),
              }
              res.send(obj)
          }else throw new Error("something went wrong !!");
        }else throw new Error("invalid credentials !!")
      }else throw new Error("username and password are required !!")

    }catch(err){
        res.status(422).send({error:err.message})
    }

  })
  
  router.use(authMiddleWare);
  
  ///MANIPULATE USER with ID
  router.route('/')
    .delete(async (req, res) => {  ///delete user
      try{        
        const done = await User.findOneAndDelete({_id:req.decodeData.id});
        if(!done) throw new Error("Something went wrong !!")
        res.send({message:"user deleted successfully !"})
      }catch(err){
        res.status(401).send({error:err.message})
      }
  
    })
    .patch(async (req, res) => {  ///edit user
      try {
        const {firstname,age} = req.body;
        if(firstname && age){
          const updatedUser = await User.findOneAndUpdate({ _id: req.decodeData.id }, {firstname ,age},{returnOriginal: false})
          if(!updatedUser) throw new Error("Somthing went wrong !!")
          res.send({message:"user edited successfully !",user:updatedUser})
        }else throw new Error("firstname and age are required !!")
      } catch (err) {
        res.status(401).send({error:err.message})
      }
  })


  
  
  ////LOGOUT
  // router.get('/api/users/logout', (req, res) =>{
  //   const check = logoutUser();
  //   if(check)
  //       res.send("U logged out successfully");
  //   else
  //       res.send("no logged in user !!");
  
  // })

  

  module.exports = router
