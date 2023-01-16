import {HttpClient} from '@angular/common/http';
import {Component, NgZone, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscriber, Subscription} from 'rxjs';

interface ServerData {
  port: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {

  public serverUrl: Promise<string>;
  public wsUrl: Promise<string>;

  constructor(
    private http: HttpClient,
    private zone: NgZone,
  ) {
  }

  public ngOnInit(): void {
    const match = window.location.search.match(/port=(\d+)/);
    if (match){
      this.serverUrl = Promise.resolve(`http://localhost:${match[1]}`)
      this.wsUrl = Promise.resolve(`ws://localhost:${match[1]}`)
    } else {
      this.serverUrl = this.http.get<ServerData>(`${document.baseURI}assets/server.json`).toPromise().then(data => {
        return `http://localhost:${data.port}`;
      });
      this.wsUrl = this.http.get<ServerData>(`${document.baseURI}assets/server.json`).toPromise().then(data => {
        return `ws://localhost:${data.port}`;
      });
    }
  }

  // tslint:disable-next-line:no-any
  public getSocket<T>(requestData: any): Promise<Observable<T>> {
    // tslint:disable-next-line:no-any
    const messageObservable = (requestData instanceof  Observable) ? requestData : new BehaviorSubject<any>(requestData);
    let messageSubscription: Subscription;

    let resultRes: (data: Observable<T>) => void;
    // tslint:disable-next-line:no-any
    let resultRej: (err: any) => void;
    const result: Promise<Observable<T>> = new Promise((res, rej) => {
      resultRes = res;
      resultRej = rej;
    });

    const subscribers: Subscriber<T>[] = [];

    const observable = new Observable<T>((observer) => {
      subscribers.push(observer);
      return ({
        unsubscribe() {
          const index = subscribers.indexOf(observer);
          if (index >= 0) {
            subscribers.splice(index, 1);
          }
          if (!subscribers.length) {
            if (socket) {
              socket.close();
            }
            if (messageSubscription) {
              messageSubscription.unsubscribe();
              messageSubscription = null;
            }
          }
        },
      });
    });


    let socket: WebSocket;
    let firstResultReturned = false;
    this.wsUrl.then(wsUrl => {

      //socket = new WebSocket(`ws://${serverInfo.wsHost}:${serverInfo.wsPort}`);
      socket = new WebSocket(wsUrl);
      socket.onopen = (e) => {
        if (!firstResultReturned) {
          resultRes(observable);
          firstResultReturned = true;
        }
        messageSubscription = messageObservable.subscribe(message => {
          socket.send(JSON.stringify(message));
        });
      };
      socket.onmessage = (event) => {
        try {
          if (event.data && (typeof event.data) === 'string') {
            const data = JSON.parse(event.data);
            subscribers.forEach(subscriber => subscriber.next(data));
          } else {
            // tslint:disable-next-line:no-console
            console.info(event);
          }
        } catch (e) {
          // tslint:disable-next-line:no-console
          console.error(e);
          // tslint:disable-next-line:no-console
          console.error(event);
        }
      };
      socket.onclose = (event) => {
        if (messageSubscription) {
          messageSubscription.unsubscribe();
          messageSubscription = null;
        }
        if (event.wasClean) {
          // tslint:disable-next-line:no-console
          console.info(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
          // e.g. server process killed or network down
          // event.code is usually 1006 in this case
          // tslint:disable-next-line:no-console
          console.info('[close] Connection died');

          const error = new Error('[Connection died');
          if (!firstResultReturned) {
            resultRej(error);
            firstResultReturned = true;
          } else {
            subscribers.forEach(subscriber => subscriber.error(error));
          }
        }
        subscribers.forEach(subscriber => subscriber.complete());
      };
      socket.onerror = (error) => {
        // tslint:disable-next-line:no-console
        console.error(`[error] ${error}`);
        if (!firstResultReturned) {
          resultRej(error);
          firstResultReturned = true;
        } else {
          subscribers.forEach(subscriber => subscriber.error(error));
        }
      };
    });


    return result;
  }


}
