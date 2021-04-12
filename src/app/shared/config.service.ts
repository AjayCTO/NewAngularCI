import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

    constructor() { }

    get authApiURI() {
        // return 'https://clearlyauthserver.azurewebsites.net/api';
        return 'http://localhost:5000/api';
    }

    get resourceApiURI() {

        // return 'https://clearlyapi.azurewebsites.net';
        return 'http://localhost:52351';
    }
}