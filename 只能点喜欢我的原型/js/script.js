function moveBlock(eventId) {
    var element = document.getElementById(eventId);

    var touchstart = function(event) {
        var x = Math.random() * 100;
        var y = Math.random() * 100;
        event.target.style.left = x + '%';
        event.target.style.top = y + '%';
    };
    var touchend = function(event) {
        event.target.style.left = '50%';
        event.target.style.top = '20%';
    };
    element.addEventListener('touchstart', touchstart);
    // element.addEventListener('touchend', touchend);
}
moveBlock('test');