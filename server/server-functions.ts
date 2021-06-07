import * as fs from 'fs';
import {Observable, Subject} from 'rxjs';

export class SeverFunctions {

  constructor(private app: any) {
  }

  public init() {
    this.app.get('/files', async (req: Request, res: Response) => {
      (res as any).json(fs.readdirSync('.'));
    });
    return this;
  }

  public getSocketData(requestData: any): Observable<any> {
    console.info(requestData);

    if (requestData && requestData.get === 'countdown') {
      const subject = new Subject<number>();
      let counter = 10;
      const ivl = setInterval(() => {
        subject.next(counter);
        if (counter === 0) {
          clearInterval(ivl);
        }
        counter--;
      }, 1000);
      return subject;
    }

    return null;
  }
}


