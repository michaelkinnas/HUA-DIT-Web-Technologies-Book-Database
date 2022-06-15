const express = require('express')
const app = express();
const parser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const database = new sqlite3.Database('books.sqlite3');
const os = require('os');

app.use(express.static('public'));
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

//GET handle
app.get('/books/:keyword', function(request, response) {
    console.log(`Request type ${request.method}, received from: ${request.hostname}`);
    
    const searchKeyword = request.params.keyword;   
   
    //send all database contents back
    if  (searchKeyword == '!@!@!@!@!') {
        const sqlQuery = 'SELECT * FROM books';
        database.all(sqlQuery, (error, results) => {
            if (error) {
                response.status(500);
                response.send({'error':`Database error ${error.message}`});
            } else {                
                response.send(results);
            }
        });
    //send matching results
    } else {
        const sqlQuery = `SELECT * FROM books WHERE (author LIKE "%${searchKeyword}%") OR (title LIKE "%${searchKeyword}%")`;
        database.all(sqlQuery, (error, results) => {
            if (error) {
                response.status(500);
                response.send({'error':`Database error ${error.message}`});
            } else {               
                response.send(results);
            }
        })
    }
})


//POST handle with return ID
app.post('/books', function (request, response) {
    console.log(`Request type ${request.method}, received from: ${request.hostname}`);
    
    const sqlQuery = `INSERT INTO books (author, title, genre, price)  
                        VALUES ("${request.body.author}", "${request.body.title}", "${request.body.genre}", ${request.body.price})`;
    database.run(sqlQuery, (error) => {
        if (error) {
            response.status(500);
            response.send({'error':`Database error ${error.message}`});
        } else {
            //query databse for the last insert id
            const sqlLastInsertId = `SELECT last_insert_rowid()`;
            database.get(sqlLastInsertId, (error, results) => {
                if (error) {
                    response.status(500);
                    response.send({'error':`Database error ${error.message}`});
                } else {                   
                    response.send(results);
                }
            })
        }
    })
})


app.listen(3000, function() {
    console.log(`Server started at ${os.hostname}`);
})