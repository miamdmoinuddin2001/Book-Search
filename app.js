var timeOut;
const result = document.getElementById('result');
const favourites = document.getElementById('favourites');
const topnav = document.getElementById('topnav');

result.onclick = function (event) { //eventos na página de resultados
  if (event.target.className == "far fa-star") { //quando faz click na estrela vazia, altera para cheia e também o título
    event.target.className = "fas fa-star favourite-icon";
    event.target.title = "Remove from favourites"

    addFavourites(event.target.id); //também adiciona o livro aos favoritos já com a estrela preenchida (importante para passar o html completo aos favoritos)
  }
  else if (event.target.className == "fas fa-star favourite-icon") {
    removeFavourites(event.target.id); //quando faz click numa estrela cheia, remove dos favoritos e para estrela vazia e também o título

    event.target.className = "far fa-star";
    event.target.title = "Add to favourites";
  }
}

favourites.onclick = function (event) { //evento na página dos favoritos
  if (event.target.className == "fas fa-star favourite-icon") { //quando faz click na estrela cheia, remove dos favoritos
    removeFavourites(event.target.id)
    renderFavourites(); //apresenta novamente os resultados, sem o que acabou de ser excluído
  }
}

topnav.onclick = function (event) { //evento na barra de navegação de topo
  if (event.target.parentNode.id == "goToSearch") { //click em Search, mostra barra de pesquisa e área de resultados e esconde o resto

    var home = document.getElementById('home');
    home.style.display = "none";

    var search = document.getElementById('search');
    search.style.display = "block";

    var result = document.getElementById('result');
    result.style.display = "block";

    var favourites = document.getElementById('favourites');
    favourites.style.display = "none";

    var modal02 = document.getElementById('id02');
    modal02.style.display = "none";

    document.getElementById("goToSearch").style.color = "#882F27"; //altera o estilo de Search e Favourites na barra de navegação
    document.getElementById("goToFavourites").style.color = "black";

    if (document.getElementById("books").value !== "") { //impede que apareça a mensagem de pesquisa vazia logo que se entra na Search
      findBooks();
    }

  }
  else if (event.target.parentNode.id == "goToFavourites") { //click em Favourites, mostra a área de favoritos, renderiza favoritos e esconde o resto

    var home = document.getElementById('home');
    home.style.display = "none";

    var search = document.getElementById('search');
    search.style.display = "none";

    var result = document.getElementById('result');
    result.style.display = "none";

    var favourites = document.getElementById('favourites');
    favourites.style.display = "block";
    renderFavourites();

    var modal02 = document.getElementById('id02');
    modal02.style.display = "none";

    document.getElementById("goToFavourites").style.color = "#882F27"; //altera o estilo de Search e Favourites na barra de navegação
    document.getElementById("goToSearch").style.color = "black";
  }
}

function registerNewUser() { //chamada no botão signup
  var formUsername = document.forms["registerForm"]["username"].value;
  var formEmail = document.forms["registerForm"]["email"].value;
  var formPsw = document.forms["registerForm"]["psw"].value;
  registerUser(formUsername, formEmail, formPsw);
}

function registerUser(inputUsername, inputEmail, inputPsw) {

  var tempMap = new Map(); //Map onde vai ficar guardado uma chave (id do livro) e um valor (HTML do resultado)

  var user = { username: inputUsername, email: inputEmail, psw: inputPsw, lastAcess: new Date(), favourites: JSON.stringify([...tempMap]) };

  if (localStorage.getItem(inputEmail) != null) { //validar se o email já está registado
    alert("This login email already exists. Please try a different email address to register, or login to your existing account.");
    return; //faz return porque não importa correr o resto das validações
  }

  var valid = true; //vai ser true quando as validações estiverem ok

  if (inputUsername == "") { //validar que insere um username
    document.getElementById("username-alert").innerHTML = "**What's your name?";
    valid = false;
  }
  else {
    document.getElementById("username-alert").innerHTML = "";
  }

  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(inputEmail)) { //validar e-mail
    document.getElementById("email-alert").innerHTML = "**Please enter a valid e-mail.";
    valid = false;
  }
  else {
    document.getElementById("email-alert").innerHTML = "";
  }

  if (inputPsw == "") { //validar que escreve uma senha
    document.getElementById("psw-alert").innerHTML = "**Please fill in the password.";
    valid = false;
  }
  else {
    document.getElementById("psw-alert").innerHTML = "";
  }

  if (inputPsw.length < 4 || inputPsw.length > 8) { //validar que a senha tem no mínimo 4 e no máximo 8 caracteres
    document.getElementById("psw-alert").innerHTML = "**Password length must be between 4 and 8 characters.";
    valid = false;
  }
  else {
    document.getElementById("psw-alert").innerHTML = "";
  }

  if (document.getElementById("psw-repeat").value !== inputPsw) { //validar que as senhas são iguais
    document.getElementById("psw-rpt-alert").innerHTML = "**Passwords don't match."
    valid = false;
  }
  else {
    document.getElementById("psw-rpt-alert").innerHTML = "";
  }
  if (valid) { //passou nas validações
    localStorage.setItem(inputEmail, JSON.stringify(user)); //transforma objecto em string 

    var modal01 = document.getElementById('id01'); //fecha modal de registo, abre modal de login e limpa os campos do registo
    modal01.style.display = "none";

    document.getElementById("register-success").innerHTML = "User Registration Successful! Please Login.";

    var modal02 = document.getElementById('id02');
    modal02.style.display = "block";

    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    document.getElementById("psw").value = "";
    document.getElementById("psw-repeat").value = "";
  }
}

function login() {
  var emailLogin = document.getElementById("emailLogin").value; //buscar email e senha inseridos no login
  var pswLogin = document.getElementById("pswLogin").value;
  var user = JSON.parse(localStorage.getItem(emailLogin)); //vai buscar o user refrente ao email inserido no login (transforma string em objeto)

  if (user == null) { //valida se o email do login não existe na local storage
    document.getElementById("emailLogin-alert").innerHTML = "**Email not found. Please create an account.";
    return;
  }
  else {
    document.getElementById("emailLogin-alert").innerHTML = "";
  }

  if (user.psw !== pswLogin) { //valida se a senha guardada no local storage é igual a senha inserida no login
    document.getElementById("pswLogin-alert").innerHTML = "**Password not correct.";

  }
  else {
    sessionStorage.setItem("userPreviousAccess", user.lastAcess);
    sessionStorage.setItem("userUsername", user.username);
    sessionStorage.setItem("userEmail", user.email);

    user.lastAcess = new Date();
    localStorage.setItem(emailLogin, JSON.stringify(user));

    startTimeout();
    showCurrentTime();
    setInterval(showCurrentTime, 1000); //incrementa a hora atual a cada 1s, como um relógio
    welcome();

    var home = document.getElementById('home'); //mostrar apenas a área da pesquisa e esconder o restante
    home.style.display = "none";

    var inicial = document.getElementById('initial');
    initial.style.display = "block";

    var search = document.getElementById('search');
    search.style.display = "block";

    var favourites = document.getElementById('favourites');
    favourites.style.display = "none";

    document.getElementById("goToSearch").style.color = "#882F27"; //alterar o estilo do Search e do Favourite na barra de navegação
    document.getElementById("goToFavourites").style.color = "black";

    document.getElementById("register-success").innerHTML = ""; //limpar os campos do login
    document.getElementById("emailLogin").value = "";
    document.getElementById("pswLogin").value = "";
  }
}

function formatDate(varDate) { //formatar datas
  var d = varDate,
    minutes = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes(),
    hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours(),
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[d.getDay()] + "," + ' ' + months[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ',' + ' ' + hours + ':' + minutes;
}

function showCurrentTime() { //mostrar a data e hora atuais de acesso
  var d = formatDate(new Date());

  document.getElementById("showCurrentTime").innerHTML = "<b>Today is </b>" + d + ".";
}

function welcome() { //mostrar user e último acesso
  var username = sessionStorage.getItem("userUsername"); //buscar o username à session storage
  document.getElementById("showUsername").innerHTML = "<i class='fas fa-user'></i> " + username;

  var previousAccess = new Date(sessionStorage.getItem("userPreviousAccess")); //buscar o último acesso à session storage
  previousAccess = formatDate(previousAccess);

  document.getElementById("showPreviousAccess").innerHTML = "<b>Your last access was on </b>" + previousAccess + ".";
}

function logOut() { //sair da pesquisa/favoritos e mostrar apenas a página de registo e login

  var home = document.getElementById('home');
  home.style.display = "flex";

  var inicial = document.getElementById('initial');
  initial.style.display = "none";

  var favourites = document.getElementById('favourites');
  favourites.style.display = "none";

  var modal02 = document.getElementById('id02');
  modal02.style.display = "none";

  document.getElementById("books").value = ""; //deixa a área da pesquisa com os "valores iniciais"
  document.getElementById("result").innerHTML = "";
  document.getElementById("filter-all").checked = true;

  stopTimeout();
}

function findBooks() {

  var search = document.getElementById("books").value;
  if (search == "") {
    alert("Please enter something in the search field.");
  }
  else {
    var result = document.getElementById('result');
    var imgUrl = "";
    var title = "";
    var author = "";
    var publisher = "";
    var readmore = "";

    if (document.getElementById("filter-author").checked) { //o tipo (filtro) da pesquisa varia dependendo do que está selecionado nos radio buttons
      httpGetAsync("https://www.googleapis.com/books/v1/volumes?q=inauthor:" + search, volumeInfo);
    }
    else if (document.getElementById("filter-title").checked) {
      httpGetAsync("https://www.googleapis.com/books/v1/volumes?q=title:" + search, volumeInfo);
    }
    else {
      httpGetAsync("https://www.googleapis.com/books/v1/volumes?q=" + search, volumeInfo);
    }

    function volumeInfo(responseJSON) {
      document.getElementById("result").innerHTML = ""; //limpar a área dos resultados antes de inserir a nova pesquisa

      response = JSON.parse(responseJSON);

      if (response.items == null) { //caso a pesquisa não retorne resultados
        var searchTitle = document.createElement('h1');
        result.appendChild(searchTitle);

        searchTitle.outerHTML = '<h1 class="favouritesTitle">No results found. Please try again.</h1>';
        return;
      }

      var searchTitle = document.createElement('h1');
      result.appendChild(searchTitle);

      searchTitle.outerHTML = '<h1 class="favouritesTitle">Search Results</h1>';

      response = JSON.parse(responseJSON);

      for (i = 0; i < response.items.length; i += 2) {

        var imgUrl; //primeiro bookContainer

        if (response.items[i].volumeInfo.imageLinks == null) { //se o livro não tiver imagem, usar um placeholder

          imgUrl = "./img/cover-not-available.png";
        }
        else {
          imgUrl = response.items[i].volumeInfo.imageLinks.thumbnail;
        }

        var title = response.items[i].volumeInfo.title;
        var author = response.items[i].volumeInfo.authors;
        var publisher = response.items[i].volumeInfo.publisher;
        var readMore = response.items[i].volumeInfo.infoLink;
        var bookId = response.items[i].id;

        var bookContainer = document.createElement('div');
        result.appendChild(bookContainer);
        bookContainer.outerHTML = '<div id="row' + i + '" class="row mt-4"></div>';

        var bookDivider =
          '<div class="col-lg-6" id="id_' + bookId + '">' +
          '<div class="card" style="">' +
          '<div class="row no-gutters">' +
          '<div class="col-md-4">' +
          '<img src="' + imgUrl + '" class="card-img" alt="Book Cover">' +
          '</div>' +
          '<div class="col-md-8">' +
          '<div class="card-body">' +
          '<h5 class="card-title">' + title + '</h5>' +
          '<hr class="card-hr">' +
          '<p class="card-text">Author: ' + author + '</p>' +
          '<p class="card-text">Publisher: ' + publisher + '</p>';
        if (isFavourite(bookId)) { //verificar se já está nos favoritos para apresentar a estrela cheia ou vazia
          bookDivider = bookDivider + '<i id="' + bookId + '" class="fas fa-star favourite-icon" title="Remove from favourites"></i>';
        }
        else {
          bookDivider = bookDivider + '<i id="' + bookId + '" class="far fa-star" title="Add to favourites"></i>';
        }
        bookDivider = bookDivider +
          '<a target="_blank" href="' + readMore + '" <i class="fas fa-book-open" title="Read book"></i></a>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>';

        var row = document.getElementById("row" + i);
        row.insertAdjacentHTML("beforeend", bookDivider);

        var imgUrl; //segundo bookContainer

        if (response.items[i + 1].volumeInfo.imageLinks == null) {

          imgUrl = "./img/cover-not-available.png";
        }
        else {
          imgUrl = response.items[i + 1].volumeInfo.imageLinks.thumbnail;
        }

        title = response.items[i + 1].volumeInfo.title;
        author = response.items[i + 1].volumeInfo.authors;
        publisher = response.items[i + 1].volumeInfo.publisher;
        readMore = response.items[i + 1].volumeInfo.infoLink;
        bookId = response.items[i + 1].id;

        var bookDivider02 =
          '<div class="col-lg-6" id="id_' + bookId + '">' +
          '<div class="card" style="">' +
          '<div class="row no-gutters">' +
          '<div class="col-md-4">' +
          '<img src="' + imgUrl + '" class="card-img" alt="Book Cover">' +
          '</div>' +
          '<div class="col-md-8">' +
          '<div class="card-body">' +
          '<h5 class="card-title">' + title + '</h5>' +
          '<hr class="card-hr">' +
          '<p class="card-text">Author: ' + author + '</p>' +
          '<p class="card-text">Publisher: ' + publisher + '</p>';
        if (isFavourite(bookId)) {
          bookDivider02 = bookDivider02 + '<i id="' + bookId + '" class="fas fa-star favourite-icon" title="Remove from favourites"></i>';
        }
        else {
          bookDivider02 = bookDivider02 + '<i id="' + bookId + '" class="far fa-star" title="Add to favourites"></i>';
        }
        bookDivider02 = bookDivider02 +
          '<a target="_blank" href="' + readMore + '" <i class="fas fa-book-open" title="Read book"></i></a>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>';

        row.insertAdjacentHTML("beforeend", bookDivider02);
      }
    }
  }
}

function isFavourite(bookId) { //verificar se o livro já está nos favoritos

  var sessionEmail = sessionStorage.getItem("userEmail"); //buscar o email com que foi feito o login, que está na session storage
  var user = JSON.parse(localStorage.getItem(sessionEmail)); //buscar o user associado a este email

  var mapFavourites = new Map(JSON.parse(user.favourites));

  if (mapFavourites.has(bookId)) { //verifica se o bookId (chave) já está no Map dos favoritos
    return true;
  }
  else return false;
}

function addFavourites(bookId) {
  var sessionEmail = sessionStorage.getItem("userEmail");
  var user = JSON.parse(localStorage.getItem(sessionEmail));
  var mapFavourites = new Map(JSON.parse(user.favourites)); //dizer que esta variável é um Map para assumir o emparelhamento da chave (bookId) com o valor (html)

  if (isFavourite(bookId)) { //verifica se o bookId (chave) já está no Map dos favoritos
    return;
  }

  mapFavourites.set(bookId, document.getElementById("id_" + bookId).outerHTML); //vai adicionar o Map dos favoritos do user uma chave (bookId) e um valor (html do livro)

  user.favourites = JSON.stringify([...mapFavourites]); //vai transformar o Map em string

  localStorage.setItem(sessionEmail, JSON.stringify(user)); //atualiza o user na local storage com o favorito que foi guardado

}

function renderFavourites() {
  var sessionEmail = sessionStorage.getItem("userEmail");
  var user = JSON.parse(localStorage.getItem(sessionEmail));
  var mapFavourites = new Map(JSON.parse(user.favourites));

  var divFavourites = document.getElementById("favourites");

  divFavourites.innerHTML = "";

  var favouritesTitle = document.createElement('h1');
  favourites.appendChild(favouritesTitle);

  if (mapFavourites.size == 0) {
    favouritesTitle.outerHTML = '<h1 class="favouritesTitle">No favourites yet.<br>Go to the Search page and let the fun begin!</h1>';
    return;
  }

  var favouritesTitle = document.createElement('h1');
  favourites.appendChild(favouritesTitle);

  favouritesTitle.outerHTML = '<h1 class="favouritesTitle">Your Favourites</h1>';

  for (let favouriteBook of mapFavourites.entries()) { //percorre o mapa e devolve o html iterativamente e coloca em favouriteBook em cada ciclo (tipo um ciclo for, mas não precisa iteração porque o mapa já é iterável por si)

    var bookContainer = document.createElement('div');
    favourites.appendChild(bookContainer);
    bookContainer.outerHTML = '<div class="row mt-4 favourite-container">' + favouriteBook[1] + '</div>';//favouriteBook[1] contem o html favouriteBook[0] contém a chave
  }
}

function removeFavourites(bookId) {
  var sessionEmail = sessionStorage.getItem("userEmail");
  var user = JSON.parse(localStorage.getItem(sessionEmail));

  var mapFavourites = new Map(JSON.parse(user.favourites));

  mapFavourites.delete(bookId);
  user.favourites = JSON.stringify([...mapFavourites])

  localStorage.setItem(sessionEmail, JSON.stringify(user)); //atualizar user com o que foi apagado
}

function startTimeout() {
  start = new Date();
  timeOut = setTimeout(logOut, 300000); //a partir do login começa a contar o timeout de 5 minutos (300000 milisegundos).
}

function stopTimeout() { //parar o contador dos 5 minutos para que, em um novo login, comece do zero
  clearTimeout(timeOut);
}

function resetTimeout() { //faz reset do timeout para 5 minutos após click no botão da pesquisa
  stopTimeout();
  startTimeout();
}

function buttonFindBooks() { //chamar a pesquisa e fazer reset do timeout (está a ser chamada na action do form do html)
  resetTimeout();
  findBooks();
}

function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous request
  xmlHttp.send(null);
}