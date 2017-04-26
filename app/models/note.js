var mongoose=require('mongoose')
var NoteSchema=require('../schemas/note.js')
var Note=mongoose.model('Note',NoteSchema)

module.exports=Note