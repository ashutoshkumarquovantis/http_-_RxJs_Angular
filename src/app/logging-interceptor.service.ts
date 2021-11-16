import { HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { tap, map } from "rxjs/operators";

export class LoggingInterceptorService implements HttpInterceptor{
    intercept(req : HttpRequest <any> , next : HttpHandler){
        console.log("Outgoing request");
        console.log(req.url);
        return next.handle(req).pipe(
            tap(event => {
                console.log(event);
                if(event.type === HttpEventType.Response) {
                    console.log("Respnse arrived, body data : ");
                    console.log(event.body);
                }
            })
        ).pipe(map (val => {
            return val;
        }));
    }
}