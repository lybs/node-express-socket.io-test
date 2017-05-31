var socket = io.connect('/');

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 52.520, lng: 13.410},
        disableDefaultUI: true
    });

    var markerCluster = new MarkerClusterer(map, [], {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

    addTodayUserListMarkers(markerCluster, function () {
        listenTodayNewUserMarkers(map, markerCluster);
    });
}

function addTodayUserListMarkers(markerCluster, callback) {
    $.ajax({
        url: '/get_today_user_list',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data && Object.prototype.toString.call(data) == '[object Array]' && data.length > 0) {
                var markers = data.map(function (v, i) {
                    return new google.maps.Marker({
                        position: {"lat": parseFloat(v['lat']), "lng": parseFloat(v['lng'])}
                    });
                });

                markerCluster.addMarkers(markers);
            }

            callback();
        },
        error: function () {
            alert("Failed to obtain today's user list. Please contact the administrator!");
        }
    });
}

function listenTodayNewUserMarkers(map, markerCluster) {
    var oldMarkers = [];

    socket.emit('/get_today_new_user');
    socket.on('/return_today_new_user', function (data) {
        var newMarkers = [];

        if (data && Object.prototype.toString.call(data) == '[object Array]' && data.length > 0) {
            if (oldMarkers.length != 0) {
                oldMarkers.forEach(function (e) {
                    e.setAnimation(null);
                });

                markerCluster.addMarkers(oldMarkers);
            }

            for (var i = 0; i < data.length; i++) {
                var marker = new google.maps.Marker({
                    position: {"lat": parseFloat(data[i]['lat']), "lng": parseFloat(data[i]['lng'])},
                    map: map,
                    animation: google.maps.Animation.DROP
                });

                setTimeout(function () {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }, 300);

                newMarkers.push(marker);
            }

            oldMarkers = newMarkers;
        }

        setTimeout(function () {
            socket.emit('/get_today_new_user');
        }, 10 * 1000);
    });
}