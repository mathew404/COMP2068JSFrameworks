// Import the required modules
const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');

// Create the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Configure Handlebars view engine
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'layout', // matches views/layouts/layout.hbs
  helpers: { year: () => new Date().getFullYear() }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Routes for your 4 pages
app.get('/', (req, res) => res.render('index', { title: 'Home' }));
app.get('/about', (req, res) => res.render('about', { title: 'About Me' }));
app.get('/projects', (req, res) => res.render('projects', { title: 'Projects' }));
app.get('/contact', (req, res) => res.render('contact', { title: 'Contact Me' }));

// 404 page for any unknown route
app.use((req, res) => res.status(404).send('Page Not Found'));

// Start the server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
