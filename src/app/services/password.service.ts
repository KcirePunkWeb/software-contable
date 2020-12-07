import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  constructor(private firestore: AngularFirestore) {}

  getPassword(): Promise<
    firebase.firestore.DocumentSnapshot<{
      clave: string;
      clave_empleado: string;
    }>
  > {
    return this.firestore.doc<any>('password/clave').get().toPromise();
  }

  cambiarPasswordAdmin(clave: string) {
    return this.firestore.doc('password/clave').update({
      clave,
    });
  }

  cambiarPasswordEmpleado(clave_empleado: string) {
    return this.firestore.doc('password/clave').update({
      clave_empleado,
    });
  }
}
