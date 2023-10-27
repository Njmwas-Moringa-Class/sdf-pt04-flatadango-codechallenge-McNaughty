// Your code here

const movieTitle = document.getElementById("title");
const movieDuration = document.getElementById("runtime");
const movieInfo = document.getElementById("film-info");
const movieTime = document.getElementById("showtime");
let availTickets = document.getElementById("ticket-num");
const ticketPurchase = document.getElementById("buy-ticket");
const moviePoster = document.getElementById("poster");
let salesBtnTxt = "Sold Out";
//document.querySelector(".sold-out").disabled = true;
  


function listFirstMovie() {
  fetch("http://localhost:3000/films/1")
    .then((response) => response.json())
    .then((movieDetails) => {
      console.log(movieDetails);
      if (typeof window !== "undefined") {
        window.firstMovie = movieDetails;
      }

      //Displays information of the first beer item in the database
      movieTitle.innerHTML = movieDetails.title;
      movieDuration.innerHTML = movieDetails.runtime;
      movieInfo.innerHTML = movieDetails.description;
      movieTime.innerHTML = movieDetails.showtime;
      moviePoster.src = movieDetails.poster;
      //ticketPurchase.innerHTML = dataB.description;
      availTickets.innerHTML = movieDetails.capacity - movieDetails.tickets_sold;

      if (availTickets.innerHTML == 0){
        document.querySelector(".sold-out").textContent = salesBtnTxt;
        document.querySelector(".sold-out").disabled = true;
      }

      getFilms();
    });
}

function getFilms() {
  fetch("http://localhost:3000/films/")
    .then((response) => response.json())
    .then((movies) => {
      console.log(movies);
      if (typeof window !== "undefined") {
        window.movieItems = movies;
      }
      //console.log(movies);
      return listFilms(movies);
    });
}

function listFilms(movies) {
  const movieList = document.getElementById("films");
  movies.forEach((film) => {
    // For Each beer, it adds a new list of item
    const li = document.createElement("li");
    li.innerHTML = film.title;
    movieList.appendChild(li);

    li.onclick = () => {
      document.querySelector(".sold-out").disabled = false;
      movieTitle.innerHTML = film.title;
      movieDuration.innerHTML = film.runtime;
      movieInfo.innerHTML = film.description;
      movieTime.innerHTML = film.showtime;
      moviePoster.src = film.poster;
      //ticketPurchase.innerHTML = dataB.description;
      availTickets.innerHTML = film.capacity - film.tickets_sold;

      if (typeof window !== "undefined") {
        window.selectedFilm = film;
      }

      if (availTickets.innerHTML == 0){
        const salesBtnTxt = "Sold Out";
        document.querySelector(".sold-out").textContent = salesBtnTxt;
      }else{
        document.querySelector(".sold-out").textContent = "Buy Ticket";
      }
      //test();
    };
    
  });
}


function updateTicketsSold() {
  const selectedMovie = window.selectedFilm;
  // create new json object with the beer data to be pushed
  let jsonData = { ...selectedMovie };

  initialTickets = jsonData.tickets_sold;
  console.log(initialTickets);

  let newTicketsSold = (jsonData.tickets_sold += 1);

  jsonData.tickets_sold = newTicketsSold;
  console.log(newTicketsSold);

  fetch(`http://localhost:3000/films/${jsonData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then((response) => response.json())
    .then((newTicketNo) => console.log("newTicketSold update", newTicketNo))
    .catch((err) => console.log(err));
  
    window.location.reload();
}


document.addEventListener("DOMContentLoaded", function (e) {
  e.preventDefault();
  
  listFirstMovie();

  let ticketPurchase = document
    .getElementById("buy-ticket")
    .addEventListener("click", function () {

      if (document.querySelector(".sold-out").innerHTML === "Sold Out"){
        alert(`Tickets are sold out for the movie ${window.selectedFilm.title}`)
      }else{
       
        let remTickets = Math.floor(availTickets.innerHTML) - 1;

        availTickets.innerHTML = remTickets;

        updateTicketsSold();

        

      }


    });

});
