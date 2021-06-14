import {HttpClient} from '@angular/common/http';
import {Component, NgZone, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {AppComponent} from '../app.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {

  public files: string[];

  public countDownSet = 10;
  public countDownOut: number;
  private countDownSender: Subject<any>;

  constructor(
    private app: AppComponent,
    private zone: NgZone,
    private http: HttpClient,
  ) {
  }


  public async ngOnInit() {
    const url = await this.app.serverUrl;
    console.info(url);

    this.files = await this.http.get<string[]>(`${url}/files`).toPromise();

    this.countDownSender = new Subject<any>();
    const socked = await this.app.getSocket(this.countDownSender);
    console.info(socked);

    const subscription = socked.subscribe(data => {
      this.countDownOut = data as number;
    }, err => {
      console.error(err);
    }, () => {
      console.info('done!');
      subscription.unsubscribe();
    });

  }

  public countDown() {
    if (this.countDownSet > 1){
      this.countDownSender.next({get: 'countdown', number : this.countDownSet});
    }
  }
}
