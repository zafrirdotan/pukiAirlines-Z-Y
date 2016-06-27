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

    renderSearchResults([1,2,4]);

});


function renderSearchResults(searchResults){
    let flights = searchResults;
    let strHTML = flights.map(flight => `<div class="flightCard">
                                           <div class="departureDate" >${moment(flight.departure).format('DD-MM-YYYY')}</div>
                                            <div class="AvailableSeats">Available seats: ${flight.seatsLeft} </div>
                                            <img src="img/1.png" class="seatIcon">
                                            <button class="btn btn-default bookItBtn" type="submit">Book It</button>
                                        </div>`).join('');
    $('.search-results').html(strHTML);
}
