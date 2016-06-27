'use strict';

const KEY_PLANES = 'planes';
const INITIAL_PLANES =  [
                            {"model":"boeing 747-400",      "seats":"455",  "flights":[],   "id":1},
                            {"model":"boeing 737-900 ER",   "seats":"179",  "flights":[],   "id":2},
                            {"model":"boeing 767-300",      "seats":"215",  "flights":[],   "id":3},
                            {"model":"AirBus A300",         "seats":"361",  "flights":[],   "id":4},
                        ];

// This is a constructor function
function Plane(model, seats, flights, id) {
    this.model = model;
    this.seats = seats;
    this.flights = (flights)? flights : [];
    this.id = (id)? id : Plane.nextId();
}

// static methods:

Plane.nextId = function () {
    let result = 1;
    let jsonPlanes = Plane.loadJSONFromStorage();
    if (jsonPlanes.length) result = jsonPlanes[jsonPlanes.length - 1].id + 1;
    return result;
}

Plane.loadJSONFromStorage = function () {
    let planes = getFromStorage(KEY_PLANES);
    if (!planes) planes = INITIAL_PLANES;
    saveToStorage(KEY_PLANES, planes);
    return planes;
}

Plane.findById = function (pId) {
    let result = null;
    let planes = Plane.query()
        .filter(p => p.id === pId);
    if (planes.length) result = planes[0];
    return result;
}

Plane.query = function () {

    if (Plane.planes) return Plane.planes;
    let jsonPlanes = Plane.loadJSONFromStorage();

    Plane.planes = jsonPlanes.map(jsonPlane => {
        return new Plane(jsonPlane.model, jsonPlane.seats, jsonPlane.flights, jsonPlane.id);
    })

    return Plane.planes;
}

Plane.save = function (formObj) {
    let planes = Plane.query();
    let plane;
    if (formObj.pid) {
        plane = Plane.findById(+formObj.pid);
        plane.model = formObj.pModel;
        plane.seats = formObj.pSeats;
        //TODO: or not to do?
        // plane.flights = formObj.pFlights;
    } else {
        plane = new Plane(formObj.pModel, formObj.pSeats);
        planes.push(plane);
    }
    Plane.planes = planes;
    saveToStorage(KEY_PLANES, planes);
}

Plane.remove = function (pId, event) {
    event.stopPropagation();
    let planes = Plane.query();
    planes = planes.filter(p => p.id !== pId)
    saveToStorage(KEY_PLANES, planes);
    Plane.planes = planes;
    Plane.render();
}

Plane.render = function () {

    let planes = Plane.query();
    var strHtml = planes.map(p => {
        return `<tr onclick="Plane.select(${p.id}, this)">
            <td>${p.id}</td>
            <td>${p.model}</td>
            <td>${p.seats}</td>
            <td>
                <button class="btn btn-danger" onclick="Plane.remove(${p.id}, event)">
                    <i class="glyphicon glyphicon-trash"></i>
                </button>
                <button class="btn btn-info" onclick="Plane.editPlane(${p.id}, event)">
                    <i class="glyphicon glyphicon-edit"></i>
                </button>
            </td>
        </tr>`

    }).join(' ');
    $('.tblPlanes').html(strHtml);
}

Plane.select = function (pId, elRow) {
    $('.active').removeClass('active success');
    $(elRow).addClass('active success');
    $('.details').show();
    let p = Plane.findById(pId);
    $('.pDetailsId').html(p.id);
    $('.pDetailsContent').html(`<div class="row">Flights: ${p.flights}</div>`)
}

Plane.savePlane = function () {
    var formObj = $('form').serializeJSON();
    console.log('formObj', formObj); //TODO: remove log
    Plane.save(formObj);
    Plane.render();
    $('#modalPlane').modal('hide');
}

Plane.editPlane = function (pId, event) {
    if (event) event.stopPropagation();
    if (pId) {
        $('.modal-title').html('Update plane details');
        let plane = Plane.findById(pId);
        $('#pid').val(plane.id);
        $('#pModel').val(plane.model);
        $('#pSeats').val(plane.seats);
    } else {
        $('.modal-title').html('Add plane');
        $('#pid').val('');
        $('#pModel').val('');
        $('#pSeats').val('');
    }
    $('#modalPlane').modal('show');
}

// instance methods:

// Plane.prototype.getFlights = function() {

// }