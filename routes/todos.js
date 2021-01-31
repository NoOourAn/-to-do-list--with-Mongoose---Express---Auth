var express = require('express')
var router = express.Router()
const {User , Todo} = require('../models/model')



///create TODO
router.post('/' , async(req, res)=> { //create
  try{
    const{title,body,tags} = req.body;
      const createdTodo = await Todo.create({user: req.decodeData.id,title,body,tags});
      if(!createdTodo) throw new Error("cannot create todo")  
      res.send({message:"Todo was added successfully !",createdTodo})
  }catch (err) {
    res.status(422).send({error:err.message})

  }  

  })
  
  ///api to get all Todos (of specific user)
  router.get('/', async (req, res) =>{
    try {
      const todos = await Todo.find({user: req.decodeData.id})
      if(!todos) throw new Error('sth went wrong !!')
      res.send(todos)
    } catch (err) {
      console.error(err)
    }
  })
  
  
  ///api to read all todos of specific user (with filters)
  router.get('/', async (req, res) =>{
    try {
      let L = 5,S = 0;
      const {limit,skip} = req.query;
      if(limit) L = limit;
      if(skip) S = S;
  
      const todos = await Todo.find({user: req.decodeData.id}, null, {skip: parseInt(S) ,limit: parseInt(L)}).exec();
      if(todos.length)
        res.send(todos)
      else
        res.send({message:"no available todos"})
    
    } catch (err) {
      console.error(err)
    }
  })
  
  
  
  ///MANIPULATE Todo with ID
  router.route('/:id')
    .delete((req, res) => {  ///delete todo
      const {id} = req.params;
      Todo.findOneAndDelete({_id:id,user: req.decodeData.id},(err)=>{
        if(err)
          res.send({message:"Todo not found"})
        else
          res.send({success:true});
      });
    })
    .patch((req, res) => {  ///edit todo
      const {id} = req.params;
      const {title,body,tags} = req.body;
      Todo.findOneAndUpdate({ _id: id ,user: req.decodeData.id}, {title,body,tags},{returnOriginal: false},(err,doc)=>{
        if(err || doc === null){
          res.send({message:"Todo not found"});
        }
        else{
          const obj = {
            message:"Todo was edited successfully",
            user: doc
          }
          res.send(obj);
        }
          
      });
    })
  

module.exports = router
