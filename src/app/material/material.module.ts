import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu'
import {MatIconModule} from '@angular/material/icon'
import {MatCardModule} from '@angular/material/card';

const MaterialComponents = [
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule
]

@NgModule({
  imports: MaterialComponents,
  exports: MaterialComponents
})
export class MaterialModule { }
