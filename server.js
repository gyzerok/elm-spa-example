global.XMLHttpRequest = require('xhr2');

const path = require('path');
const express = require('express');
const ssr = require('./ssr')

const app = express();

app.get('/elm.js', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'elm.js'));
});

app.get('*', (req, res) => {
  const elmApp = ssr.Server.worker({
    session: null,
    location: {
      href: "http://localhost:8000" + req.path,
      host: "localhost:8000",
      hostname: "localhost",
      protocol: "http:",
      origin: "http://localhost:8000",
      port_: "8000",
      pathname: req.path,
      search: "",
      hash: "",
      username: "",
      password: ""
    }
  });
  elmApp.ports.htmlOut.subscribe(html => {
    if (html) {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Conduit</title>
            <!-- Import Ionicon icons & Google Fonts our Bootstrap theme relies on -->
            <link href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css">
            <link href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic" rel="stylesheet" type="text/css">
            <!-- Import the custom Bootstrap 4 theme from our hosted CDN -->
            <link rel="stylesheet" href="//demo.productionready.io/main.css">
            <style>/* Loading spinner courtesy of loader.io */
            .sk-three-bounce { margin-right: 10px; } .sk-three-bounce .sk-child { width: 14px; height: 14px; background-color: #333; border-radius: 100%; display: inline-block; -webkit-animation: sk-three-bounce 1.4s ease-in-out 0s infinite both; animation: sk-three-bounce 1.4s ease-in-out 0s infinite both; } .sk-three-bounce .sk-bounce1 { -webkit-animation-delay: 0.28s; animation-delay: 0.28s; } .sk-three-bounce .sk-bounce2 { -webkit-animation-delay: 0.44s; animation-delay: 0.44s; } .sk-three-bounce .sk-bounce3 { -webkit-animation-delay: 0.6s; animation-delay: 0.6s; } @-webkit-keyframes sk-three-bounce { 0%, 80%, 100% { -webkit-transform: scale(0); transform: scale(0); } 40% { -webkit-transform: scale(1); transform: scale(1); } } @keyframes sk-three-bounce { 0%, 80%, 100% { -webkit-transform: scale(0); transform: scale(0); } 40% { -webkit-transform: scale(1); transform: scale(1); } }
            </style>


            <script src="/elm.js"></script>
          </head>
          <body id="page-body">${html}</body>
        </html>
      `);
    }
    else {
      res.sendStatus(500);
    }
  });
});

app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});