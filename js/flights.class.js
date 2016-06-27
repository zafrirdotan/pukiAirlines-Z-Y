'use strict';

const KEY_FLIGHTS = 'flights';
const INITIAL_FLIGHTS = [   
    {"src":"TLV","dest":"BER","departure":"2016-06-28T00:00:00.000Z","planeId":"1","id":1,"psngrs":[],"seatsLeft":455},
    {"src":"TLV","dest":"BER","departure":"2016-06-30T00:00:00.000Z","planeId":"2","id":2,"psngrs":[],"seatsLeft":179},
    {"src":"TLV","dest":"PAR","departure":"2016-06-29T00:00:00.000Z","planeId":"3","id":3,"psngrs":[],"seatsLeft":215},
    {"src":"TLV","dest":"PAR","departure":"2016-07-02T00:00:00.000Z","planeId":"4","id":4,"psngrs":[],"seatsLeft":361},
    {"src":"TLV","dest":"LON","departure":"2016-06-29T00:00:00.000Z","planeId":"1","id":5,"psngrs":[],"seatsLeft":455},
    {"src":"TLV","dest":"LON","departure":"2016-06-20T00:00:00.000Z","planeId":"1","id":6,"psngrs":[],"seatsLeft":455},
    {"src":"TLV","dest":"JFK","departure":"2016-07-02T00:00:00.000Z","planeId":"3","id":7,"psngrs":[],"seatsLeft":215},
    {"src":"TLV","dest":"JFK","departure":"2016-06-09T00:00:00.000Z","planeId":"1","id":8,"psngrs":[],"seatsLeft":455},
    {"src":"TLV","dest":"JFK","departure":"2016-06-14T00:00:00.000Z","planeId":"2","id":9,"psngrs":[],"seatsLeft":179},
    {"src":"TLV","dest":"BKK","departure":"2016-07-29T00:00:00.000Z","planeId":"2","id":10,"psngrs":[],"seatsLeft":179},
    {"src":"TLV","dest":"BKK","departure":"2016-06-30T00:00:00.000Z","planeId":"4","id":11,"psngrs":[],"seatsLeft":361},
    {"src":"PAR","dest":"BER","departure":"2016-06-23T00:00:00.000Z","planeId":"2","id":12,"psngrs":[],"seatsLeft":179},
    {"src":"PAR","dest":"BER","departure":"2016-06-28T00:00:00.000Z","planeId":"3","id":13,"psngrs":[],"seatsLeft":215}
                        ];

// This is a constructor function 
function Flight(src ,dest, departure, planeId, id, psngrs) {
    
    this.src = src;
    this.dest = dest;
    this.departure = new Date(departure);
    this.planeId = planeId;
    this.id = (id) ? id : Flight.nextId();
    this.psngrs = (psngrs)? psngrs: [];
    this.seatsLeft = +Plane.findById(+planeId).seats - this.psngrs.length;
}

// static methods:

Flight.nextId = function () {
    let result = 1;
    let jsonFlights = Flight.loadJSONFromStorage();
    if (jsonFlights.length) result = jsonFlights[jsonFlights.length - 1].id + 1;
    return result;
}

Flight.findById = function (fId) {
    let result = null;
    let flights = Flight.query()
        .filter(f => f.id === fId);
    if (flights.length) result = flights[0];
    return result;
}

Flight.loadJSONFromStorage = function () {
    let flights = getFromStorage(KEY_FLIGHTS);
    if (!flights) flights = INITIAL_FLIGHTS;
    return flights;
}


// id, src , dest, departure, plane, seatsLeft
Flight.query = function () {

    if (Flight.flights) return Flight.flights;
    let jsonFlights = Flight.loadJSONFromStorage();
    // console.log('jsonFlights: ', jsonFlights);
    
    Flight.flights = jsonFlights.map(jsonFlight => {
        return new Flight(  jsonFlight.src, jsonFlight.dest, jsonFlight.departure,
                            +jsonFlight.planeId, jsonFlight.id, +jsonFlight.psngrs);
    })

    return Flight.flights;
}

Flight.save = function (formObj) {

    let flights = Flight.query();
    let flight;
    if (formObj.fid) {
        flight = Flight.findById(+formObj.fid);
        flight.source = formObj.fsource; 
        flight.dest = formObj.fdest;
        flight.departure = new Date(formObj.fdate);
        flight.planeId = formObj.fplaneId;
        flight.seatsLeft = Plane.findById(+formObj.fplaneId).seats;
    } else {
        flight = new Flight(formObj.fsource, formObj.fdest, formObj.fdate, formObj.fplaneId);
        flights.push(flight);
    }
    Flight.flights = flights;
    saveToStorage(KEY_FLIGHTS, flights);
}

Flight.remove = function (fId, event) {
    event.stopPropagation();
    let flights = Flight.query();
    flights = flights.filter(f => f.id !== fId)
    saveToStorage(KEY_FLIGHTS, flights);
    Flight.flights = flights;
    Flight.render();
}

Flight.render = function () {

    let flights = Flight.query();
    var strHtml = flights.map(f => {
        return `<tr onclick="Flight.select(${f.id}, this)">
            <td>${f.id}</td>
            <td>${f.src}</td>
            <td>${f.dest}</td>
            <td>
                ${moment(f.departure).format('DD-MM-YYYY')}
            </td>
            <td>${f.planeId}</td>
             <td>${f.seatsLeft}</td>
            <td>
                <button class="btn btn-danger" onclick="Flight.remove(${f.id}, event)">
                    <i class="glyphicon glyphicon-trash"></i>
                </button>
                 <button class="btn btn-info" onclick="Flight.editFlight(${f.id}, event)">
                    <i class="glyphicon glyphicon-edit"></i>
                </button>
            </td>
        </tr>`

    }).join(' ');
    $('.tblFlights').html(strHtml);
}

Flight.select = function (fId, elRow) {
    $('.active').removeClass('active success');
    $(elRow).addClass('active success');
    $('.fdetails').show();
    let f = Flight.findById(fId);
    $('.fDetailsName').html(f.id);
    let details = `<div class="row">plane Id: ${f.planeId}</div>
                     <div class="row">psngrs: ${f.psngrs}</div>
                       <div class="row">seats left: ${f.seatsLeft}</div>`
    $('.fInerrDetails').html(details);
}


Flight.saveFlight = function () {
    var formObj = $('form').serializeJSON();
    console.log('formObj', formObj);

    Flight.save(formObj);
   
    Flight.render();
        
   
    $('#modalFlight').modal('hide');
}

Flight.editFlight = function (fId, event) {
    if (event) event.stopPropagation();
    console.log('fId:',fId); //TODO: delete log
    
    if (fId) {
        let flight = Flight.findById(fId);
        $('#fid').val(flight.id);
        $('#fplaneId').val(flight.planeId);
        $('#fsource').val(flight.source);
        $('#fdest').val(flight.dest);
        $('#fdate').val(moment(flight.departure).format('YYYY-MM-DD'));
    } else {
        $('#fid').val('');
        $('#fsource').val('');
        $('#fplaneId').val('');
        $('#fdest').val('');
        $('#fdate').val('');
    }

    $('#modalFlight').modal('show');

}

Flight.searchFlights = function (src, dest) {
    let result = null;
    let flights = Flight.query()
        .filter(f => f.src === src && f.dest === dest);
    if (flights.length) result = flights;
    return result;
}

Flight.getFlights = function () {

    let $src = $('#fromArprt').val();
    let $dest = $('#toArprt').val();
    let flights= Flight.searchFlights($src, $dest).sort(function (a,b){b.departure > a.departure});
    console.log('flights:', flights);
    document.querySelector('.srcToDest').innerText = `${$src} => ${$dest}`;
    document.querySelector('.searchHeader').style.display = 'block';
    renderSearchResults(flights);
}

// instance methods:

Flight.prototype.assignPsngr = function(Pid){
    this.psngrs.push(Pid);
};

$(document).ready(()=>{
    renderSRC('#fsource');
    renderSRC('#fdest');
    // renderPlaneIds('#fplaneId')
    console.log('document loaded');

});



