import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { post } from "./post.model";

@Injectable(
    {
        providedIn: 'root'
    }
)
export class PostsService {
    error = new Subject<string>();
    constructor(private http: HttpClient) { }

    createAndStorePost(title: string, content: string) {
        const postData: post = { title: title, content: content };
        this.http.post<{ name: string }>('https://ng-complete-guide-fecee-default-rtdb.firebaseio.com/posts.json',
            postData,
            {
                observe: 'response'
            }
        ).subscribe(responseData => {
            console.log(responseData.body);
        }, error => {
            this.error.next(error.error.error);
        });
    }

    fetchPosts() {
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print', 'pretty');
        searchParams = searchParams.append('custom', 'true');
        return this.http.get<{ [key: string]: post }>('https://ng-complete-guide-fecee-default-rtdb.firebaseio.com/posts.json',
            {
                headers: new HttpHeaders({
                    'myHearder': 'Foo',
                    'customHeader': 'bar'
                }),
                // *One way to do a params Query
                // params : new HttpParams().set( 'print' , 'pretty' );
                // *Another better way to do it.
                params: searchParams
            })
            .pipe(
                map((responseData) => {
                    const postsArray: post[] = [];
                    for (const key in responseData) {
                        if (responseData.hasOwnProperty(key)) {
                            postsArray.push({ ...responseData[key], id: key })
                        }
                    }
                    return postsArray;
                })
            )
    }

    deletePosts() {
        return this.http.delete('https://ng-complete-guide-fecee-default-rtdb.firebaseio.com/posts.json',
        {
            // *Angular by itself gives a lot of response and we are interested in the following one only, hence observe is used
            observe : 'events',
            responseType : 'json'
        })
        .pipe(
            tap(event => {
                console.log(event);
                if(event.type === HttpEventType.Sent){
                    // ...
                }
                if(event.type === HttpEventType.Response) {
                    console.log(event.body);
                }
            })
        );
    }
}