import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NblocksModule } from 'nblocks-angular'; // Import the NblocksModule
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { routes } from './app.routes'; // Import the routes

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    // Other components
  ],
  imports: [
    BrowserModule,
    NblocksModule.forRoot({
      appId: '671279b938f34e0008b0f80b',
      stage: 'PROD',
      debug: true
    }),
    RouterModule.forRoot(routes) // Use the imported routes here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
