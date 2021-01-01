import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Component({
  selector: 'at-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  public readonly name$: Observable<string> = this._appService.getData();

  constructor(private readonly _appService: AppService) {}
}
