
import express from "express"
import { AdminRoute, VandorRoute, } from "./routes"
import bodyParser  from 'body-parser'
import mongoose, { ConnectOptions } from "mongoose"
import { MONGO_LOCAL_URL, MONGO_REMOTE_URL } from "./config"



const app = express()


//before reading from the body must use body-parser to parse to body of the request into some convenient format to dealwith  (depend of request content type) 
//exp : if content-type application/json => the request body will be parsed into js object 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true,limit:5*1024*1024 }))
// parse application/json
app.use(bodyParser.json())
//set static folder
/* app.use(express.static('images'));
 */
app.use('/admin',AdminRoute)
app.use('/vandor', VandorRoute)
app.use('*',(req,res,next)=>{
    res.json('this route is not supported for now ')
})

mongoose.connect(MONGO_LOCAL_URL)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.listen(8000,()=>{
    console.log('start listen on port 8000')
})

