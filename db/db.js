
const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI

const db = async()=>{
    
    try {
        mongoose.set('strictQuery',false)
        await mongoose.connect(MONGO_URI) 
        console.log("DB connection successful")
    } catch (error) {
        console.log("DB connection Error",error)
        
    }
}

module.exports = db 