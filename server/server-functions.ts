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
      let counter: number = Math.max(requestData.number || 10, 0);
      const ivl = setInterval(() => {
        counter-= 0.1;
        subject.next(Math.round(counter * 10) / 10);
        if (counter <= 0) {
          clearInterval(ivl);
        }
      }, 100);
      return subject;
    }

    return null;
  }
}


