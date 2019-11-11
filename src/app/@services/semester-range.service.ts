import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SemesterRangeService {
    public semesterRangeState$: Subject<{ startDate: Date, endDate: Date }> = new Subject();

    constructor() { }
}
