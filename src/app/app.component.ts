import {HttpClient} from '@angular/common/http';
import {Component, NgZone, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

interface ServerData {
  port: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {

  public title = 'ElectronStarter';

  public serverUrl: Promise<string>;
  public wsUrl: Promise<string>;

  constructor(
    private http: HttpClient,
    private zone: NgZone,
  ) {
  }

  public ngOnInit(): void {
    this.serverUrl = this.http.get<ServerData>(`${document.baseURI}/assets/server.json`).toPromise().then(data => {
      return `http://localhost:${data.port}`;
    });
    this.wsUrl = this.http.get<ServerData>(`${document.baseURI}/assets/server.json`).toPromise().then(data => {
      return `ws://localhost:${data.port}`;
    });
  }

  public getSocket<T>(requestData: any): Observable<T> {
    return new Observable<T>((observer) => {
      let socket: WebSocket;
      this.wsUrl.then(wsUrl => {

        //socket = new WebSocket(`ws://${serverInfo.wsHost}:${serverInfo.wsPort}`);
        socket = new WebSocket(wsUrl);
        socket.onopen = (e) => {
          socket.send(JSON.stringify(requestData));
        };
        socket.onmessage = (event) => {
          try {
            if (event.data &&( typeof event.data) === 'string'){
              const data = JSON.parse(event.data);
              observer.next(data);
            } else {
              console.info(event);
            }
          } catch (e){
            console.error(e);
            console.error(event);
          }
        };
        socket.onclose = (event) => {
          if (event.wasClean) {
            console.info(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
          } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.info('[close] Connection died');
          }
          observer.complete();
        };
        socket.onerror = (error) => {
          console.info(`[error] ${error}`);
          observer.error(error);
        };
      });
      return ({
        unsubscribe() {
          console.log('unsubscribbed');
          if (socket) {
            socket.close();
          }
        },
      });
    });


  }


}
