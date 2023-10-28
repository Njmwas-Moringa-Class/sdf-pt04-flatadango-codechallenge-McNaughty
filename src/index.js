// Your code here

// Define global variables to use throughout the code
const movieTitle = document.getElementById("title");
const movieDuration = document.getElementById("runtime");
const movieInfo = document.getElementById("film-info");
const movieTime = document.getElementById("showtime");
let availTickets = document.getElementById("ticket-num");
const ticketPurchase = document.getElementById("buy-ticket");
const moviePoster = document.getElementById("poster");
let salesBtnTxt = "Sold Out";


//Function for listing the first movie
function listFirstMovie() {
  fetch("http://localhost:3000/films/1")
    .then((response) => response.json())
    .then((movieDetails) => {
      console.log(movieDetails);
      if (typeof window !== "undefined") {
        window.firstMovie = movieDetails;
      }

      //Displays information of the first movie item in the database
      movieTitle.innerHTML = movieDetails.title;
      movieDuration.innerHTML = movieDetails.runtime + "mins";
      movieInfo.innerHTML = movieDetails.description;
      movieTime.innerHTML = movieDetails.showtime;
      moviePoster.src = movieDetails.poster;
      availTickets.innerHTML = movieDetails.capacity - movieDetails.tickets_sold;

      //checks if the tickets are sold out and disables the button for buying one
      if (availTickets.innerHTML == 0) {
        document.querySelector(".sold-out").textContent = salesBtnTxt;
        document.querySelector(".sold-out").disabled = true;
      }

      //Calls the function that lists all available films
      getFilms();
    });
}

//Function for all available films from the server
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

//Function to work on the specific movie that has been selected
function listFilms(movies) {
  const movieList = document.getElementById("films");
  movies.forEach((film) => {
    // For Each movie item, it adds a new list of item
    const li = document.createElement("li");
    //adds a html button to the list item to enable delete feature
    li.innerHTML = `${film.title} <button class="delete" onclick="deleteFilm(this);"><i class="fa-solid fa-trash"></i> `;
    movieList.appendChild(li);

    li.onclick = () => {
      document.querySelector(".sold-out").disabled = false;
      movieTitle.innerHTML = film.title;
      movieDuration.innerHTML = film.runtime + "mins";
      movieInfo.innerHTML = film.description;
      movieTime.innerHTML = film.showtime;
      moviePoster.src = film.poster;
      availTickets.innerHTML = film.capacity - film.tickets_sold;

      if (typeof window !== "undefined") {
        window.selectedFilm = film;
      }

      if (availTickets.innerHTML == 0) {
        const salesBtnTxt = "Sold Out";
        document.querySelector(".sold-out").textContent = salesBtnTxt;
      } else {
        document.querySelector(".sold-out").textContent = "Buy Ticket";
      }
      
    };
  });
}

function updateTicketsSold() {
  const selectedMovie = window.selectedFilm;
  // create new json object with the film data to be updated
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

//Function for deleting a film item based on the selected current element
function deleteFilm(currentEl){
  currentEl.parentNode.parentNode.removeChild(currentEl.parentNode);
  let filmToDelete = window.selectedFilm;

  let jsonData = { ...filmToDelete};

  fetch(`http://localhost:3000/films/${jsonData.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(),
  })
    .then((response) => response.json())
    .then((filmDeleted) => console.log("filmDelete", filmDeleted))
    .catch((err) => console.log(err));

  window.location.reload();
}


//Starting point of the whole code
document.addEventListener("DOMContentLoaded", function (e) {
  e.preventDefault();

  listFirstMovie();

  //Event listener attached to the buy ticket button
  let ticketPurchase = document
    .getElementById("buy-ticket")
    .addEventListener("click", function () {
      if (document.querySelector(".sold-out").innerHTML === "Sold Out") {
        alert(
          `Tickets are sold out for the movie ${window.selectedFilm.title}`
        );
      } else {
        let remTickets = Math.floor(availTickets.innerHTML) - 1;

        availTickets.innerHTML = remTickets;

        updateTicketsSold();
      }
    });
  
});
