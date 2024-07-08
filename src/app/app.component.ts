import { Component, signal } from '@angular/core';
import { CraComponent } from './features/cra/components/cra.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CraComponent, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = signal('Opération CRA');

  constructor() {
  }


}


