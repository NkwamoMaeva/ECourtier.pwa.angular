import { Injectable, HostListener } from '@angular/core';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { Subject } from 'rxjs';
@Injectable()
export class PwaService {

    private promptEvent: Event | any;
    public installStatusChanged$: Subject<Event | any> = new Subject();
    public updateAvailable$: Subject<UpdateAvailableEvent> = new Subject();
    constructor(private swUpdate: SwUpdate) {
        window.addEventListener('beforeinstallprompt', (event) => {
            this.onBeforeinstallprompt(event);
        });
        swUpdate.available.subscribe(event => {
            this.updateAvailable$.next(event);
        });
    }

    onBeforeinstallprompt(event: any) {
        console.log('window:beforeinstallprompt');
        console.log(event);
        this.promptEvent = event;
        this.installStatusChanged$.next(event);
    }
    install() {
        if (this.promptEvent) {
            this.promptEvent.prompt();
        }
    }
    updatePWA() {
        window.location.reload();
    }
}
