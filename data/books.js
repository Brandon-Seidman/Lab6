const mongoCollections = require('../config/mongoCollections');
const connection = require('../config/mongoConnection');
const movies = mongoCollections.movies;
const ObjectID = require("mongodb").ObjectID;
let { ObjectId } = require('mongodb');


const spaceChecker = function spaceChecker(str){
  for(var i = 0;i < str.length; i++){
    if(str.charAt(i) != ' '){
      return true;
    }
  }
  return false;
}


const create = async function create(title, author, genre, datePublished, summary, reviews){
  var finalObj = {};
  if(title == null || author == null || genre == null || datePublished == null || summary == null || reviews == null)
    throw "One or more items is null.";
  if(!(typeof title == 'string') || !(typeof author == 'object') || !(Array.isArray(genre)) || !(genre == []) || isNaN(Date.parse(datePublished)) || !(typeof summary == 'string') || !(Array.isArray(reviews)))
    throw "Error: TIncorrect type somewhere.";
  if(!spaceChecker(title) || !spaceChecker(summary) || title == "" || summary == "")
    throw "Title or Summary is just spaces or empty.";
  if(Array.isArray(genre)){
    for(var i = 0; i < genre.length; i++){
      if(typeof genre[i] != 'string')
        throw "Non-string in genre.";
      if(genre[i] == "" || !spaceChecker(genre[i]))
        throw "Empty string in genre.";
    }
  }
  else
    throw "Genre is no good.";
  if(author["authorFirstName"] == null || author["authorLastName"] == null || !(typeof author["authorFirstName"] == "string") || !(typeof author["authorLastName"] == "string") || author["authorFirstName"] == "" || author["authorLastName"] == "" || !spaceChecker(author["authorFirstName"]) || !spaceChecker(author["authorFirstName"]))
    throw "Problem with author.";
  finalObj.title = title;
  finalObj.author = author;
  finalObj.genre = genre;
  finalObj.datePublished = datePublished;
  finalObj.summary = summary;
  finalObj.reviews = reviews;

  const bookCollection = await books();


  const insertInfo = await bookCollection.insertOne(finalObj);
  if (insertInfo.insertedCount === 0) throw 'Could not add book';

  const newId = insertInfo.insertedId;
  const book = await this.getBookById(newId);
  book.id = book.id.toString();

  return finalObj;
  // return movie;
}


const getBookById = async function getBookById(id){
    var parsedID;
    if (!id) throw 'You must provide an id to search for';
    if(!(typeof id == 'string') || id == "") throw "Id must be a valid string."
    // var ObjID = require('mongodb').Types.ObjectId;
    // if (!ObjId.isValid(id)) throw "Not valid object id."
    try{
      parsedID = ObjectID(id);
    }
    catch(e){
      throw "Not a valid ID.";
    }
    const bookCollection = await books();
    const novel = await bookCollection.findOne({ _id: parsedID });
    if (novel === null) throw 'No book with that id';
    novel.id = novel.id.toString();

    return novel;
}


const getAll = async function getAll(){
  const bookCollection = await books();

  const bookList = await bookCollection.find({}).toArray();

  for(var i = 0; i < bookList.length; i++){
    bookList[i].id.toString();
  }

  return bookList;
}


const remove = async function remove(id){
  var parsedID;
  if (!id)
    throw 'You must provide an id to search for';
  if(!(typeof id == 'string') || id == "")
    throw "Id must be a valid string."
  try{
    parsedID = ObjectID(id);
  }
  catch(e){
    throw "Not a valid ID.";
  }
  const bookCollection = await books();
  const novel = await bookCollection.findOne({ _id: parsedID });
  const deletionInfo = await bookCollection.deleteOne({ _id: parsedID });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete movie with id of ${id}`;
  }
  return novel["title"] + " has been successfully deleted";
}

//-------TODOTODOTODOTODO-------
// const rename = async function rename(id, newTitle) {
//   var parsedId;
//   const movieCollection = await movies();
//   if(!id || !newTitle)
//     throw "No id or newTitle provided."
//   if(!(typeof id == 'string') || id == "" || !(typeof newTitle == 'string') || newTitle == "")
//     throw "Id and newTitle must be a valid string."
//   try{
//     parsedId = ObjectID(id);
//   }
//   catch(e){
//     throw "Not a valid ID.";
//   }
//   const film = await movieCollection.findOne({ _id: parsedId });
//   if (film === null) throw 'No movie with that id';
//
//   const updatedMovie = {
//     title: newTitle
//   };
//
//   const updatedInfo = await movieCollection.updateOne(
//     { _id: parsedId },
//     { $set: updatedMovie }
//   );
//   if (updatedInfo.modifiedCount === 0) {
//     throw 'could not update movie successfully';
//   }
//
//   return await this.get(id);
// }


module.exports = {create,getBookById,getAll,remove,rename};
