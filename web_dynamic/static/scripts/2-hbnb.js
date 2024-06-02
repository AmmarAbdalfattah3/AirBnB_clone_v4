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
});
