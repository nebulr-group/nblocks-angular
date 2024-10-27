import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'nblocks-external-redirect',
  template: '<p>Redirecting...</p>'
})
export class ExternalRedirectComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const externalUrl = this.route.snapshot.paramMap.get('externalUrl');
    if (externalUrl) {
      window.location.href = externalUrl;
    }
  }
}
