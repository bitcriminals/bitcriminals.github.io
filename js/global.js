function debounce(callback, delay) {
    let timerId;
    return function () {
        clearInterval(timerId);
        timerId = setTimeout(() => (callback.bind(this))(), delay);
    }
}

function headerActivator() {
    if ( window.scrollY > 10 && !headerActivated ) {
        document.querySelector('header').classList.add('active');
        headerActivated = true;
    } else if ( window.scrollY <= 10 && headerActivated ) {
        document.querySelector('header').classList.remove('active');
        headerActivated = false;
    }
}

let headerActivated = false;
window.addEventListener('scroll', debounce(headerActivator, 10));

document.querySelector('.header--right.menu-icon').addEventListener('click', function() {
    document.querySelector('.header--right.menu').classList.toggle('active');
});

document.querySelectorAll('.header--right.menu a').forEach( element => {
    element.addEventListener('click', function() {
        document.querySelector('.header--right.menu').classList.toggle('active');
    })
});