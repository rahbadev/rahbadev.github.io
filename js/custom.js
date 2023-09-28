$(document).ready(function() {
    $('#fullpage').fullpage({
        'verticalCentered': true, // This should be set to 'true' to vertically center content in sections
        'scrollingSpeed': 600,
        'autoScrolling': false,
        'css3': true,
        'navigation': true,
        'navigationPosition': 'right',
    });
    
    // Initialize WOW.js and textrotator
    new WOW().init();
    $(".rotate").textrotator();
});