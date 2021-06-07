import {HttpClient} from '@angular/common/http';
import {Component, NgZone, OnInit} from '@angular/core';
import {AppComponent} from '../app.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {

  public files: string[];
  public countDown: number;

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

    const subscription = this.app.getSocket({get: 'countdown'}).subscribe(data => {
      this.countDown = data as number;
    }, err => {
      console.error(err);
    }, () => {
      console.info('done!');
      subscription.unsubscribe();
    });

  }

}
