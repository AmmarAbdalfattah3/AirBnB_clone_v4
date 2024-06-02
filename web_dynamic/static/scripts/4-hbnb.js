$(document).ready(function(){
    var amenitiesChecked = {}; // Variable to store checked amenities

    // Check API status
    $.get("http://0.0.0.0:5001/api/v1/status/", function(data){
        if (data.status === "OK") {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    }).fail(function() {
        $('#api_status').removeClass('available');
    });

    // Listen for changes on each input checkbox tag
    $('input[type="checkbox"]').change(function(){
        var amenityID = $(this).data('id'); // Get Amenity ID
        var amenityName = $(this).data('name'); // Get Amenity name

        if ($(this).is(':checked')) { // If checkbox is checked
            amenitiesChecked[amenityID] = amenityName; // Store Amenity ID and name
        } else {
            delete amenitiesChecked[amenityID]; // Remove Amenity ID and name
        }

        // Update the h4 tag inside the div Amenities with the list of Amenities checked
        var amenitiesList = Object.values(amenitiesChecked).join(', ');
        $('.amenities h4').text(amenitiesList);
    });

    // Fetch places with optional filter data
    function fetchPlaces(filterData) {
        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(filterData),
            success: function(data) {
                $('.places').empty(); // Clear current places
                for (var place of data) {
                    var article = $('<article></article>');
                    var titleBox = $('<div class="title_box"></div>');
                    titleBox.append('<h2>' + place.name + '</h2>');
                    titleBox.append('<div class="price_by_night">$' + place.price_by_night + '</div>');
                    article.append(titleBox);

                    var information = $('<div class="information"></div>');
                    information.append('<div class="max_guest">' + place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : '') + '</div>');
                    information.append('<div class="number_rooms">' + place.number_rooms + ' Bedroom' + (place.number_rooms !== 1 ? 's' : '') + '</div>');
                    information.append('<div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom' + (place.number_bathrooms !== 1 ? 's' : '') + '</div>');
                    article.append(information);

                    var description = $('<div class="description"></div>');
                    description.html(place.description);
                    article.append(description);

                    $('.places').append(article);
                }
            }
        });
    }

    fetchPlaces({}); // Initial fetch of places with no filters

    // Fetch places when the Search button is clicked
    $('button').click(function() {
        var filterData = {
            amenities: Object.keys(amenitiesChecked) // Send only the checked amenities
        };
        fetchPlaces(filterData);
    });
});

