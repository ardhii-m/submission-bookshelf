const books = [];
const RENDER_EVENT = 'render-book';
function generateId() {
  return +new Date();
}
function generateBook(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  }
}
function addBook() {
  const bookTitle = document.getElementById('bookFormTitle').value;
  const bookAuthor = document.getElementById('bookFormAuthor').value;
  const bookYear = document.getElementById('bookFormYear').value;
  
  const generatedID = generateId();
  const bookObject = generateBook(generatedID, bookTitle, bookAuthor, bookYear, false)
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
}
function makeBook(bookObject) {
  const {id, title, author, year, isComplete} = bookObject;
  const itemTitle = document.createElement('h3');
  itemTitle.innerText = title;
  const itemAuthor = document.createElement('p');
  itemAuthor.innerText = author;
  const itemYear = document.createElement('p');
  itemYear.innerText = year;
  
  const bookItem = document.createElement('div');
  bookItem.classList.add('inner');
  bookItem.append(itemTitle, itemAuthor, itemYear);
  const container = document.createElement('div');
  // container.classList.add();
  container.append(bookItem);
  container.setAttribute('id', `${id}`);
  return container;
}
document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('bookForm');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
});
document.addEventListener(RENDER_EVENT, function () {
  const unreadBookList = document.getElementById('incompleteBookList');
  unreadBookList.innerHTML = '';
  for (const bookItem of books) {
    const bookElement = addBook(bookItem);
    unreadBookList.append(bookElement);
  }
});
