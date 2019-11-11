import { HttpHeaders, HttpParams } from '@angular/common/http';
import { KeyValue } from '@angular/common';

export class HttpOptions {
    public headers?: HttpHeaders;
    public observe?: 'body';
    public params?: HttpParams;
    public reportProgress?: boolean;
    public responseType?: 'json';
    public withCredentials?: boolean;

    constructor() {
        this.params = new HttpParams();
        this.headers = new HttpHeaders();
        return this;
    }

    public setHeader(...headers: KeyValue<string, string>[]): HttpOptions {
        if (headers == null) { return this; }
        headers.forEach(h => this.headers = this.headers.set(h.key, h.value));
        return this;
    }

    public addParams(...params: KeyValue<string, string>[]): HttpOptions {
        // this.params.set = new Array(param.key, param.value);
        if (typeof params === 'undefined' || params == null) { return this; }

        params.forEach(p => {
            this.params = this.params.set(p.key, p.value);
        });

        return this;
    }

    public getOptions(): {} {
        const opt = {
            headers: this.headers,
            observe: this.observe,
            params: this.params,
            reportProgress: this.reportProgress,
            responseType: this.responseType,
            withCredentials: this.withCredentials
        };
        return opt;
    }
}
