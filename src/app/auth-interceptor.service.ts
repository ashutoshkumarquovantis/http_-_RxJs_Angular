import { HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { tap } from "rxjs/operators";

// Interceptor runs on all the request just before it leaves our application
// We can add a custom headers to all the requests via interceptors -> one way to use the interceptors

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // We should see the modified request...
        // *console.log(req);
        // We can only modify the requests in following way (sort of) : 
        const modifiedRequest = req.clone({ headers: req.headers.append('Auth', 'xyz') });

        // and then I forward my modified request to the next interceptor or the backend

        // Not only we can work with req but we can also work with the res as well. Because in the end we are subscribing the request.
        return next.handle(modifiedRequest)
            // .pipe(tap(event => {
            //     if (event.type === HttpEventType.Response) {
            //         console.log("Response arrived, body data : ");
            //         console.log(event.body);
            //     }
            // })
            // );
    }
}