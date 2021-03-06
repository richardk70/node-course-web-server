const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

// add support for partials
hbs.registerPartials(__dirname + '/views/partials');

// add express middleware
app.set('view engine', 'hbs');

// create a log entry with every request
app.use( (req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFileSync('server.log', log + '\n', (err) => {
        if (err)
            console.log('Unable to append to server.log.');
    });
    next();
});

/*
// maintenance middleware
app.use( (req, res, next) => {
    res.render('maint.hbs', {
        pageTitle: 'Maintenance',
    });
});
*/

// for static files (like help.html)
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear' , () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (input) => {
    return input.toUpperCase();
});

// routing http requests
// root route
app.get('/', (request, response) => {
    response.render('home.hbs', {
        pageTitle: 'Home',
        welcomeMessage: 'Where Do You Want to go Today?'
    })
});

// about route
app.get('/about', (request, response) => {
    response.render('about.hbs', {
        pageTitle: 'About',
    });
});

// projects route
app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects',
    });
});

// bad URL route
app.get('/bad', (request, response) => {
    response.send({
        errorText: 'Error handling request.'
    });
});

// get the app to start listening to a port
app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});