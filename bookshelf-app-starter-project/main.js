const books = [];
const RENDER_EVENT = "render-book";

function generateBook(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

// Create book on submitting form
function createBook() {
  const generatedID = Number(new Date());
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const bookYear = Number(document.getElementById("bookFormYear").value);
  const bookComplete = document.getElementById("bookFormIsComplete").checked;

  const bookObject = generateBook(
    generatedID,
    bookTitle,
    bookAuthor,
    bookYear,
    bookComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBook(bookObject) {
  // Create book container
  const newBook = document.createElement("div");
  newBook.setAttribute("data-bookid", `${bookObject.id}`);
  newBook.setAttribute("data-testid", `bookItem`);

  // Create book title, author, year
  const itemTitle = document.createElement("h3");
  itemTitle.innerText = bookObject.title;
  itemTitle.setAttribute("data-testid", `bookItemTitle`);

  const itemAuthor = document.createElement("p");
  itemAuthor.innerText = `Penulis: ${bookObject.author}`;
  itemAuthor.setAttribute("data-testid", `bookItemAuthor`);

  const itemYear = document.createElement("p");
  itemYear.innerText = `Tahun: ${bookObject.year}`;
  itemYear.setAttribute("data-testid", `bookItemYear`);

  // Create buttons (Selesai dibaca / Belum selesai dibaca, Hapus buku, Edit buku)
  const checkButton = document.createElement("button");
  checkButton.innerText = "Selesai Dibaca"; // isComplete === false
  checkButton.setAttribute("data-testid", `bookItemIsCompleteButton`);

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Hapus Buku";
  deleteButton.setAttribute("data-testid", `bookItemDeleteButton`);

  // Create button container
  const actionButtons = document.createElement("div");
  if (bookObject.isComplete === true) {
    checkButton.innerText = "Belum Selesai Dibaca";
  }

  // wrap buttons
  actionButtons.append(checkButton, deleteButton);
  // wrap everything to container
  newBook.append(itemTitle, itemAuthor, itemYear, actionButtons);

  checkButton.addEventListener("click", function () {
    changeReadStatus(bookObject.id);
  });

  deleteButton.addEventListener("click", function () {
    deleteBook(bookObject.id);
  });

  return newBook;
}

// find by id, used for complete-uncomplete, remove
function findBook(bookId) {
  for (const booksItem of books) {
    if (booksItem.id === bookId) {
      return booksItem;
    }
  }
  return null;
}

// find index used for deleting
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

// Cari buku, used for search by title
function searchBook(bookTitle) {
  for (const booksItem of books) {
    if (booksItem.title.toLowerCase() === bookTitle.toLowerCase()) {
      return booksItem;
    }
  }
  return null;
}

// Toggle "Selesai dibaca" <-> "Belum selesai dibaca"
function changeReadStatus(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget === null) return;
  if (bookTarget.isComplete === true) {
    // Toggle isComplete
    bookTarget.isComplete = false;
  } else {
    bookTarget.isComplete = true;
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const searchBookTitle = document.getElementById("searchBookTitle");
  const searchResult = document.getElementById("searchResult");

  // load local storage
  if (checkStorage() === true) {
    loadData();
  }
  // submit form
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    createBook();
  });

  // search form
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = searchBookTitle.value.trim();

    //clear previous search
    searchResult.innerHTML = "";
    //display hidden div (searchResult)
    searchResult.style.display = "block";
    if (title !== "") {
      const foundBook = searchBook(title);
      if (foundBook !== null) {
        // Create h2 for header search container
        const searchTitle = document.createElement("h2");
        searchTitle.innerText = "Hasil Pencarian";
        searchResult.append(searchTitle);

        const searchedBook = addBook(foundBook);
        searchResult.append(searchedBook);
      } else {
        searchResult.innerHTML = "<h2>Buku tidak ditemukan.</h2>";
      }
    } else {
      searchResult.innerHTML = "<h2>Tolong masukkan judul buku.</h2>";
    }
  });
});

document.addEventListener(RENDER_EVENT, function () {
  const unreadBookList = document.getElementById("incompleteBookList");
  const completedBookList = document.getElementById("completeBookList");
  unreadBookList.innerHTML = "";
  completedBookList.innerHTML = "";

  console.log(books);
  for (const booksItem of books) {
    const bookElement = addBook(booksItem);
    if (booksItem.isComplete === false) {
      unreadBookList.append(bookElement);
    } else {
      completedBookList.append(bookElement);
    }
  }
});

// Toggle read button based on checkbox
document.addEventListener("change", function () {
  const isCompleteCheckbox = document.getElementById("bookFormIsComplete");
  const submitFormButton = document.getElementById("bookFormSubmit");
  if (isCompleteCheckbox.checked) {
    submitFormButton.innerHTML =
      "Masukkan Buku ke rak <span>Selesai dibaca</span>";
  } else {
    submitFormButton.innerHTML =
      "Masukkan Buku ke rak <span>Belum selesai dibaca</span>";
  }
});

function checkStorage() {
  if (typeof Storage === undefined) {
    alert("Browser tidak mendukung local storage.");
    return false;
  }
  return true;
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_SHELF";

function saveData() {
  if (checkStorage() === true) {
    const parses = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parses);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadData() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
