'use strict';

const KEY_PLANES = 'planes';

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
    if (!planes) planes = [];
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
        return new  Plane(jsonPlane.model, jsonPlane.seats, jsonPlane.flights, jsonPlane.id);
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