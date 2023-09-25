
import express from "express"

const app = express()
app.use('/',(req,res)=>{
    res.json('hello from Monolithics backend')

})

app.listen(8000,()=>{
    console.log('start listen on port 8000')
})