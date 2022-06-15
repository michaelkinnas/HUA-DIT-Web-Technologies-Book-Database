//HTTP GET from server api
document.getElementById('searchButton').addEventListener('click', async function(event) {    
    let searchBoxValue = document.getElementById('searchBox').value;
    let url = `http://${location.host}/books/${searchBoxValue}`;   
    if (searchBoxValue == '') {
        url = `http://${location.host}/books/!@!@!@!@!`;
    }
    const response = await fetch(url);
    const body = await response.json();
    if (response.status != 200) {
        document.getElementById('statusBar').innerHTML = `Δημιουργήθηκε σφάλμα: ${body['error']}`;
    } else {
        loadDataIntoTable(body);
        document.getElementById('statusBar').innerHTML = `Φρέθηκαν ${body.length} αποτελέσματα`;
    }    
});

//HTTP POST to server api
document.getElementById('submitButton').addEventListener('click', async function(event) {
    const author = document.getElementById('author').value;
    const title = document.getElementById('title').value;
    const genre = document.getElementById('genre').value;
    const price = document.getElementById('price').value;
   
    if (isNaN(price) || price == '') {
        alert('Το πεδίο "Τιμή" πρέπει να περιέχει αριθμό.');
    }
    else if (author == '' || title == '') {
        alert('Τα πεδία "Τίτλος" και "Συγγραφέας" πρέπει να είναι συμπληρωμένα.')    
    } else {
        const payloadJSON = {
            'author': author,
            'title': title,
            'genre': genre,
            'price': price
        }
        const response = await fetch(`http://${location.host}/books`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payloadJSON)
        });
        clearSubmitForm();     
        const body = await response.json();      
        if (response.status != 200) {
            document.getElementById('statusBar').innerHTML = `Δημιουργήθηκε σφάλμα: ${body['error']}`;
        } else {            
            document.getElementById('statusBar').innerHTML = `Το βιβλίο καταχωρήθηκε επιτυχώς με id: ${body['last_insert_rowid()']}`;
        }        
    }
})

//Clear table data and reset search view
document.getElementById('searchClearButton').addEventListener('click', async function(event) {    
    let tableBody = document.getElementById('table-data');
    let dataHTML = '';
    tableBody.innerHTML = dataHTML;
    let statusBar = document.getElementById('statusBar');
    statusBar.innerHTML = '';
    statusBar.style.borderBottomLeftRadius = '12px';
    statusBar.style.borderBottomRightRadius = '12px';
    document.getElementById('results-area').style.display='none';
    document.getElementById('searchBox').value = '';
})

//Clear submit form data and reset submit view
document.getElementById('submitClearButton').addEventListener('click', async function(event) {   
    clearSubmitForm();
})



//Loads JSON data into HTML table
function loadDataIntoTable(books) {
    let tableBody = document.getElementById('table-data');
    let data = '';   
    for (let book of books) {
        data += `<tr><td>${book.id}</td><td>${book.title}</td><td>${book.author}</td><td>${book.genre}</td><td>${book.price} \u20AC</td></tr>`;
    }
    tableBody.innerHTML = data;
    document.getElementById('results-area').style.display='block';
    let statusBar = document.getElementById('statusBar');
    statusBar.style.borderBottomLeftRadius = '0px';
    statusBar.style.borderBottomRightRadius = '0px';    
}


function clearSubmitForm() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('genre').selectedIndex = 0;
    document.getElementById('price').value = '';
};

function setSearchMode() {
    document.getElementById('search-area').style.display = 'block';
    document.getElementById('submit-area').style.display = 'none';
}

function setSubmitMode() {
    document.getElementById('search-area').style.display = 'none';
    document.getElementById('submit-area').style.display = 'block';
}