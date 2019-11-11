import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ContentHeader } from '../@models/contentHeader';

@Injectable({
    providedIn: 'root'
})
export class ContentHeaderService {
    public contentHeader$: Subject<ContentHeader> = new Subject();

    constructor() { }
}
