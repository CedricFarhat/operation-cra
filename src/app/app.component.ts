import { Component, signal } from '@angular/core';
import { CraComponent } from './features/cra/components/cra.component';
import { APP_TITLE } from '@core/constants/app.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CraComponent],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = signal(APP_TITLE);

  constructor() {
  }


}


