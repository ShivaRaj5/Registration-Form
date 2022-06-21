const monoose=require('mongoose');
monoose.connect('mongodb://localhost:27017/youtube-registration')
.then(()=>{
    console.log("Connected to the database")
}).catch((err)=>{
    console.log(err)
})