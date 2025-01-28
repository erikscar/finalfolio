import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
   }

   emit(event: string, data: any) {
    this.socket.emit(event, data)
   }

   on(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data)
      })

      return () => {
        this.socket.off(event)
      }
    })
   }
}
