import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NblocksModule } from 'nblocks-angular'; // Import the NblocksModule
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './app.routes'; // Import the routes

@NgModule({
  declarations: [
    AppComponent,
    // Other components
  ],
  imports: [
    BrowserModule,
    NblocksModule.forRoot({
      appId: '671279b938f34e0008b0f80b',
      handoverPath: '/',
      debug: true,
      stage: 'PROD',
      disableRedirects: false
    }),
    RouterModule.forRoot(routes) // Use the imported routes here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
