import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { log } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  fs.readdir('./files', (err, files) => {
    res.render('index', {files: files});
  })
});

app.get('/files/:filename', function(req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
      res.render('show', {filename: req.params.filename, file: filedata});  
    })
})

app.get('/edit/:filename', function(req, res) {
    res.render('edit', {filename: req.params.filename});  
  })

app.post('/edit', function(req, res){    
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function(err){
      res.redirect("/");
    })
})  


app.post('/create', (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function (err) {
        res.redirect('/');
    })
});

app.listen(3000)