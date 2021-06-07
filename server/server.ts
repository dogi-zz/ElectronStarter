import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import {Subscription} from 'rxjs';
import * as ws from 'ws';
import {SeverFunctions} from './server-functions';


const app = express();
app.use(cors());
app.use(bodyParser.json());

const projectName = 'ElectronStarter';
const packPath = path.resolve(__dirname, '..', '..', 'dist', projectName);
const devPath = path.resolve(__dirname, 'dist', projectName);

const APP_DIR = fs.existsSync(devPath) ? devPath : packPath;


app.post('/ping', (req: Request, res: Response) => {
  (res as any).json({pong: true});
});

//


export const startServer = (port: number) => {

  let serverPort: number;

  return new Promise<number>(res => {
    app.get('/app/*', async (req: Request, res: Response) => {
      const file = decodeURI((req as any).path.substr('/app/'.length));
      if (file === '/assets/server.json') {
        (res as any).json({port: serverPort, gen: true});
      } else if (fs.existsSync(`${APP_DIR}/${file}`)) {
        (res as any).sendFile(path.resolve(`${APP_DIR}/${file}`));
      } else {
        (res as any).sendFile(path.resolve(`${APP_DIR}/index.html`));
      }
    });

    const severFunctions = new SeverFunctions(app).init();


    const wsServer = new ws.Server({noServer: true});
    wsServer.on('connection', (socket) => {

      let subscription: Subscription;
      // When you receive a message, send that message to every socket.
      socket.on('message', (msg) => {
        try {
          const message = JSON.parse(msg);
          const subject = severFunctions.getSocketData(message);
          if (subject) {
            subscription = subject.subscribe(data => {
              socket.send(data);
            });
          } else {
            socket.close();
          }
        } catch (e) {
          console.error(e);
        }
      });
      socket.on('close', () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      });
    });


    const server = app.listen(port, '0.0.0.0', () => {
      serverPort = server.address().port;
      console.log('Drive Log Server listening at Port %s', serverPort);
      res(serverPort);
    });
    server.on('upgrade', (request, socket, head) => {
      wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
      });
    });
  });
};
