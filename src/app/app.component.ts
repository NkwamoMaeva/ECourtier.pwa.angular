import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { LoaderService } from './@services/loader.service';
import { PwaService } from './@services/pwa.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'insurance-app';
  loading = true;
  showInstall = false;
  pwaMessage: string;
  isPwaUpdate: boolean;
  constructor(private activeroute: ActivatedRoute, private router: Router, private loaderService: LoaderService, private pwaService: PwaService) {

  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loading = false;
      }
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      }
    });
    this.pwaService.installStatusChanged$.subscribe(event => {
      this.showInstall = true;
      this.pwaMessage = 'Accédez à l\'applicaiton plus rapidement';
    });
    this.loaderService.loaderState$.subscribe(state => this.loading = state);
    this.pwaService.updateAvailable$.subscribe(_ => {
      this.showInstall = true;
      this.isPwaUpdate = true;
      this.pwaMessage = 'Une mis à jour est disponible';
    });
  }

  installPwa(): void {
    if (this.isPwaUpdate) {
      this.pwaService.updatePWA();
    } else {
      this.pwaService.install();
    }

    this.showInstall = false;
    this.isPwaUpdate = false;
  }
}
