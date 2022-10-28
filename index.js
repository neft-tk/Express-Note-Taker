//Add server code here!
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const uuid = require('./public/assets/helpers/uuid');
const PORT = process.env.PORT || 3000;

app.use(express.static("public"))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/index.html"))
})

// GET /notes should return the notes.html file
app.get('/notes', (req,res) =>{   
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

// GET /api/notes should read the db.json file
app.get('/api/notes',(req,res)=>{
    fs.readFile("./db/db.json","utf-8",(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                msg:"oh no!",
                err:err
            })
        } else {
            const dataArr = JSON.parse(data);
            res.json(dataArr)
        }
    })
});


// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { title, note } = req.body;
  
    if (title && note) {
      const newNote = {
        title,
        note,
        review_id: uuid(),
      };
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
});
// app.post('/api/notes', (req,res) =>{
//     fs.readFile("./db/db.json", "utf-8", (err,data) => {
//         if(err){
//             console.log(err);
//             res.status(500).json({
//                 msg:"oh no!",
//                 err:err
//             })     
//         } else {
//             const dataArr = JSON.parse(data);
//             dataArr.push(req.body);
//             fs.writeFile("./db/db.json", JSON.stringify(dataArr, null, 4), (err,data)=>{
//                 if(err){
//                     console.log(err);
//                     res.status(500).json({
//                         msg:"oh no!",
//                         err:err
//                     })     
//                 } else {
//                     res.json({
//                         msg:"successfully added!"
//                     })
//                 }
//             })
//         }
//     })
// })
// GET * should return the index.html file
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname, "./public/index.html"))
});

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})