import { HttpHeaders } from '@angular/common/http';

export const headers = (token: string) => new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', `Token ${token}`)
