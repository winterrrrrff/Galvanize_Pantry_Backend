import express from 'express';
import apiRouter from '../../api/index.js';
import config from '../../config.js';

const server = express();

// Server side rendering example:
// server.get('/', (req, res) => {
//   res.send(`
//     <html>
//       <head>
//         <title>Sample React App</title>
//       </head>
//       <body>
//         <div id="mountNode">hello???</div>
//         <script src="/main.js"></script>
//       </body>
//     </html>
//   `)
// });

server.use('/api', apiRouter);

server.use(express.static('dist'));

// server.listen(4242, () => console.log('Server is running...'));
server.listen(config.port, config.host, () => {
    console.info('Express listening on port', config.port);
  });
  