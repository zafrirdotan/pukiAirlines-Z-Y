'use strict';


const airports =    [
                        'TLV',
                        'PAR',
                        'LON',
                        'JFK',
                        'BER',
                        'BKK',
                        'TOK',
                        'MEX'
                    ];

function renderSRC(elId) {
    let $elFromArprt = $(elId);
    let strHTML = airports.map(ap => `<option value="${ap}">${ap}</option>`).join('');
    $elFromArprt.append(strHTML);
}

function renderDEST() {
    let src = $('#fromArprt').val();
    let $elToArprt = $('#toArprt');
    
    let strHTML = '<option value="">Choose</option>';
    strHTML += (airports.filter(ap => ap !== src).map(ap => `<option value="${ap}">${ap}</option>`).join(''));
    // console.log('strHTML:', strHTML);
    
    $elToArprt.html(strHTML);
}

function renderPlaneIds() {
    let planeIds = Plane.query().map(p => p.id);
    // console.log('planeIds:', planeIds);
    let strHTML = planeIds.map(pid => `<option value="${pid}">${pid}</option>`).join('');
    // console.log('strHTML:', strHTML);
    
    $('#fplaneId').html(strHTML);
}

$(document).ready(()=>{
    console.log('document loaded');

});


function renderSearchResults(searchResults){
    let flights = searchResults;
    let strHTML = flights.map(flight => `<div class="flightCard">
                                           <div class="departureDate" >${moment(flight.departure).format('DD-MM-YYYY')}</div>
                                            <div class="AvailableSeats">Available seats: ${flight.seatsLeft} </div>
                                            <img src="img/1.png" class="seatIcon">
                                            <button class="btn btn-default bookItBtn" id="${flight.id}" onclick="openBookingModal(this.id)" type="submit">Book It</button>
                                        </div>`).join('');
    $('.search-results').html(strHTML);
}

 function openBookingModal(fId){
console.log('fId', fId);

    let flight = Flight.findById(+fId);
    $('.bookingHeader').text(`Book Passenger to Flight ${fId} from ${flight.src} 
                                to ${flight.dest} on the ${moment(flight.departure).format('DD-MM-YYYY')}`);
    let passengers = Passenger.query() 

    let strHTMLNames = passengers.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
    $('#pBookingNames').append(strHTMLNames)

    $('#modalBookFlight').modal('show');

}