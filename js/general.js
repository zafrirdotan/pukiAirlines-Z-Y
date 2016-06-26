function printMat(mat, selector) {
  
  var elContainer = document.querySelector(selector);
 
  var strHTML = '<table border="1"><tbody>';
  mat.forEach(function (row, i) {
    strHTML += '<tr>';

    row.forEach(function (cell, j) {
      
      var className = 'cell cell' + i + '-' + j;
      
      strHTML += '<td class="' + className +   '"> ' + cell +  ' </td>'
    });    
    
    strHTML += '</tr>'
    
    
    
  })
  strHTML += '</tbody></table>';
  
  // console.log('strHTML', strHTML);
  
  elContainer.innerHTML = strHTML;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
} 
function getFromStorage(key) {
  var str = localStorage.getItem(key);
  return JSON.parse(str);
} 

function log() {
    var cl = console.log.bind(console, new Date());
    cl.apply(console, arguments)
}
function randomPin() {
    return Math.floor(Math.random()*90000) + 10000;
}


// This function is used to achieve class inheritance
function inherit(derived, base) {
     function Dummy() { }
     Dummy.prototype = base.prototype;

     derived.prototype = new Dummy();
}


