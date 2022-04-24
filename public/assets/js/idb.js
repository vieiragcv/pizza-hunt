
/*-------------------------------------------------
-       IndexedDB - CREATING THE CONNECTION
--------------------------------------------------*/

let db;

/*- Firstly we establish a connection to IndexedDB called 'pizza_hunt' and set it to version 1 --*/

const request = indexedDB.open('pizza_hunt', 1);

/*-------------------------------------------------
-       IndexedDB - ADDING THE OBJECT STORE
--------------------------------------------------*/

/*- The next event will emit if the database version changes (nonexistant to v1, v1 to v2, etc.) -*/

request.onupgradeneeded = function(event) {

  const db = event.target.result; // saves a reference to the database 

  db.createObjectStore('new_pizza', { autoIncrement: true }); //create an object (table) called `new_pizza`
};

request.onsuccess = function(event) { // when db is successfully created with its object store

  db = event.target.result;

  if (navigator.onLine) { //check if app is online,
    // uploadPizza(); uploadPizza() function to send all local db data to api
  }
};

request.onerror = function(event) {
  console.log(event.target.errorCode);
};

/*-------------------------------------------------
-       IndexedDB - SAVE DATA TO IndexedDB
--------------------------------------------------*/

function saveRecord(record) { //if we attempt to submit a new pizza and there's no internet connection
  
  const transaction = db.transaction(['new_pizza'], 'readwrite'); // open a new transaction with the database with read and write permissions 
  
  const pizzaObjectStore = transaction.objectStore('new_pizza'); // access the object store for `new_pizza`

  pizzaObjectStore.add(record);  // add record to your store with add method
}

/*-------------------------------------------------
-       IndexedDB - UPLOAD DATA TO IndexedDB
--------------------------------------------------*/

function uploadPizza() {
  // open a transaction on your db
  const transaction = db.transaction(['new_pizza'], 'readwrite');

  // access your object store
  const pizzaObjectStore = transaction.objectStore('new_pizza');

  // get all records from store and set to a variable
  const getAll = pizzaObjectStore.getAll();

  getAll.onsuccess = function() {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      fetch('/api/pizzas', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(['new_pizza'], 'readwrite');
          // access the new_pizza object store
          const pizzaObjectStore = transaction.objectStore('new_pizza');
          // clear all items in your store
          pizzaObjectStore.clear();

          alert('All saved pizza has been submitted!');
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
}

// listen for app coming back online
window.addEventListener('online', uploadPizza);