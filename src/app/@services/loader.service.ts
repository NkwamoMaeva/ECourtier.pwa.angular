import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    public loaderState$: Subject<boolean> = new Subject();

    constructor() { }
}
