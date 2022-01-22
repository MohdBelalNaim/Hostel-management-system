const mongoose = require('mongoose')
const Rooms = mongoose.Schema({
    room:{
        type:String,
        required:true
    },
    status:{
        default:"Vaccant",
        type:String,
    },
    occupied_by:[
        {
            name:{type:String},
            student:{type:mongoose.Schema.Types.ObjectId,ref:"Student"},
            occupancy_type:{type:String}
        }
    ]
})

module.exports = mongoose.model('Rooms',Rooms)