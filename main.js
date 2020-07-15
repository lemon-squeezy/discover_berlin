//Select element function
const SelectElement = function (element) {
    return document.querySelector(element);
};

let menuToggler = SelectElement('.menu-toggle');
let body = SelectElement('body');

menuToggler.addEventListener('click', function (){
    body.classList.toggle('open');
});

//Scroll reveal
window.sr = ScrollReveal();

sr.reveal('.animate-left', {
    origin: 'left',
    duration: 1000,
    distance: '25rem',
    delay: '300'
});

sr.reveal('.animate-right', {
    origin: 'right',
    duration: 1000,
    distance: '25rem',
    delay: '600'
});

sr.reveal('.animate-top', {
    origin: 'top',
    duration: 1000,
    distance: '25rem',
    delay: '600'
});

sr.reveal('.animate-bottom', {
    origin: 'bottom',
    duration: 1000,
    distance: '25rem',
    delay: '600'
});


// Google maps functionality
var map, infoWindow, service, keyWord, bounds;
var userPosition;
var markers = [];
var currentInfoWindow;

function initMap() {
  bounds = new google.maps.LatLngBounds();
  infoWindow = new google.maps.InfoWindow();
  currentInfoWindow = infoWindow;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map = new google.maps.Map(document.getElementById("map"), {
          center: pos,
          zoom: 15,
        });
        bounds.extend(pos);
        
        infoWindow.setPosition(pos);
        infoWindow.setContent("Location found.");
        infoWindow.open(map);
        map.setCenter(pos);
       
      },
      function () {
        handleLocationError(true, infoWindow);
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow);
  }
}
// Handle a geolocation error
function handleLocationError(browserHasGeolocation, infoWindow) {
  // Set default location to Berlin, Germany
  pos = { lat:52.520008, lng:13.404954 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: pos,
    zoom: 15,
  });

  // Display an InfoWindow at the map center
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation ? "Geolocation permissions denied. Using default location."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
  currentInfoWindow = infoWindow;
}
//add event listener for the buttons for different options

document.getElementById("club").addEventListener("click", Club);
document.getElementById("sport").addEventListener("click", Sport);
document.getElementById("restaurant").addEventListener("click", Restaurant);
document.getElementById("museum").addEventListener("click", Museum);
document.getElementById("park").addEventListener("click", Park);
document.getElementById("wellness").addEventListener("click", Wellness);
   
function Club() {
 option('Club');
}
function Sport() {
  option('Gym');
}
function Restaurant() {
 option('Restaurant');
}
function Museum() {
 option('Museum');
}
function Park() {
 option('Park');
}
function Wellness() {
 option('Wellness');
}

function option(keyWord){
 let request = {
    bounds: map.getBounds(),
    keyword: keyWord,
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, nearbyCallback);
}
//adding markers for the options
function nearbyCallback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    createMarkers(results);
  }
}
function createMarkers(places) {
  removeMarkers();
  places.forEach((place) => {
    let marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      title: place.name,
      animation: google.maps.Animation.DROP,
    });

    markers.push(marker);
    //showing the place details on demand
    google.maps.event.addListener(marker, "click", function () {
        let request = {
        placeId: place.place_id,
        fields: [
          "name",
          "formatted_address",
          "geometry",
          "rating",
          "website",
          "photos",
          "reviews",
        ],
      };

      /* Only fetch the details of a place when the user clicks on a marker.*/

      service.getDetails(request, function (placeResult, status) {
        showDetails(placeResult, marker, status);
      });
    });
    // Adjust the map bounds to include the location of this marker
    bounds.extend(place.geometry.location);
  });
  /* Once all the markers have been placed, adjust the bounds of the map to
   * show all the markers within the visible area. */
  map.fitBounds(bounds);
}

// clear markers for a different cuisine
function removeMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
}

// Builds an InfoWindow to display details above the marker
function showDetails(placeResult, marker, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    let placeInfowindow = new google.maps.InfoWindow();
    console.log(placeResult.photos)
    placeInfowindow.setContent(
      "<div><strong>" +
        placeResult.name +
        "</strong><br>" +
        "Address: " +
         "</div>"+
        "<div>"+
        placeResult.formatted_address +
        "</div>"+
        "<div>"+
        "Website: " +
        placeResult.website +
        "</div>"+
        "<div>"+ 
        "Photos: " +
        placeResult.photos[0]['html_attributions'][0] +
        "</div>"+
        "<div>"+
        "Rating: " +
        placeResult.rating +
        "</div>"
        
    );
    placeInfowindow.open(marker.map, marker);
    currentInfoWindow.close();
    currentInfoWindow = placeInfowindow;
    showCard(placeResult);
  } else {
    console.log("showDetails failed: " + status);
  }
}
//display option details on a card
function showCard(placeResult) {
  let infoCard = document.getElementById("optionInfo");
  //if infoCard is open remove the open class.
   if(infoCard != null){
    if (infoCard.classList.contains("open")) {
        infoCard.classList.remove("open");
    }

    //clearing previous details
    while (infoCard.lastChild) {
        infoCard.removeChild(infoCard.lastChild);
    }
    }

  //Adding photo if there is one
  if (placeResult.photos) {
    let firstPhoto = placeResult.photos[0];
    photo = document.createElement("img");
    photo.classList.add("card-img-top");
    photo.src = firstPhoto.getUrl();
    if(infoCard != null){
    infoCard.appendChild(photo);
    }
  }
  //new div created for card body
  var newDiv = document.createElement("div");
  newDiv.classList.add("card-body");
  if(infoCard != null){
  infoCard.appendChild(newDiv);
  }
  let title = document.createElement("h5");
  title.classList.add("card-title");
  title.textContent = placeResult.name;
  newDiv.appendChild(title);
  //add rationg if there is one
  if (placeResult.rating != null) {
    let rating = document.createElement("p");
    rating.classList.add("card-text");
    rating.textContent = `Rating: ${placeResult.rating} \u272e`;
    newDiv.appendChild(rating);
  }
  let address = document.createElement("p");
  address.textContent = `Address: ${placeResult.formatted_address}`;
  newDiv.appendChild(address);
  if (placeResult.website) {
    let websiteBut = document.createElement('button');
    let websiteLink = document.createElement('a');
    let websiteUrl = document.createTextNode(placeResult.website);
    websiteLink.appendChild(websiteUrl);
    websiteLink.textContent= "Go to the website";
    websiteLink.href = placeResult.website;
    websiteLink.classList.add("websiteLink");
    websiteBut.classList.add("btn");
    websiteBut.appendChild(websiteLink);
    newDiv.appendChild(websiteBut);
    } 
  
  //Getting first 5 reviews reviews if there is one
  if (placeResult.reviews && placeResult.reviews.length) {
    let reviewDiv = document.createElement("div");
    //create a new div for reviews to added to card body
    newDiv.appendChild(reviewDiv);
    reviewDiv.classList.add("review");
    var contentStr =
      +"<li>Reviews:" +
      (function (rs, fx) {
        var list = document.createElement("ul");
        reviewDiv.appendChild(list);
        rs.forEach(function (r) {
          list.appendChild(fx(r));
        });
        return "<ul>" + list.innerHTML + "</ul>";
        return list;
      })(placeResult.reviews, function (r) {
        var item = document.createElement("li");

        review = item.appendChild(document.createElement("ul"));
        props = {
          author_name: "author",
          rating: "rating",
          text: "text",
        };
        item.appendChild(document.createElement("h6"));
        item.lastChild.appendChild(document.createElement("a"));
        item.lastChild.lastChild.appendChild(
          document.createTextNode(r.author_name)
        );
        item.lastChild.appendChild(
          document.createTextNode("(" + r.rating + ")")
        );
        if (r.aspect && r.aspect.length) {
          item.appendChild(document.createElement("ul"));
          r.aspect.forEach(function (a) {
            item.lastChild.appendChild(document.createElement("li"));
            item.lastChild.lastChild.appendChild(
              document.createElement.TextNode(a.type + ":" + a.rating)
            );
          });
        }
        item.appendChild(document.createElement("p"));
        item.lastChild.appendChild(document.createTextNode(r.text));
        return item;
      }) +
      "</li>";
    contentStr = +"</ul>";
    //infoWindow.setContent(contentStr);
    } else {
    var contentStr = "<h5>No Result, status=" + status + "</h5>";
  }
  if(infoCard != null){
  infoCard.classList.add("open");
  }
}
