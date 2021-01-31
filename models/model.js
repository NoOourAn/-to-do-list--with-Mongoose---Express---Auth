const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/TodoApp',
                {useNewUrlParser: true, 
                 useUnifiedTopology: true , 
                 useFindAndModify:false});



const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> {
console.log("connected!")

});

const Schema = mongoose.Schema;
  ////users schema
  const usersSchema = new Schema({
    username: { type: String ,required:true, unique: true,index: true}, ////have created index cuz i will search by it
    password: { type: String,required:true},  ///((?=.*[a-z])(?=.*[0-9]))
    firstname: { type: String,required:true, match: /[a-z]/,minlength:3,maxlength:15},
    age: {type:Number,min:13},
    gender: {type:String, enum :["male","female"]},
    todos: [{ type: Schema.Types.ObjectId, ref: 'Todo' }],
    loggedIn: {type:Boolean, default:false}
  });

  ////todos schema
  const todosSchema = new Schema({
    // userId: mongoose.ObjectId,
    user: { type: Schema.Types.ObjectId, ref: 'User' }, /// it was just userid but i will populate it to be a whole
    title: { type: String ,required:[true, 'enter valid title : 10 to 20 letters'],minlength:10,maxlength:20},
    body: { type: String ,required:[true, 'enter valid body : 10 to 500 letters'],minlength:10,maxlength:500},
    tags: { type: [String],enum :["todo","in-progress","done"]},
  },{ timestamps: {} });

    

  const User = mongoose.model('User', usersSchema);
  const Todo = mongoose.model('Todo', todosSchema);
    
module.exports = {User,Todo}



