import {  Component,  OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
    loadedPosts: post[] = [];
    isFetching: boolean = false;
    error = null;
    private errorSub : Subscription;
    constructor(private http: HttpClient, private postsService : PostsService) { }

    ngOnInit() {
        this.errorSub = this.postsService.error.subscribe(errorMessage => {
            this.error = errorMessage;
        })

        this.isFetching = true;
        this.postsService.fetchPosts()
        .subscribe(
            post => {
                this.isFetching = false;
                this.loadedPosts = post;
            },
            error => {
                this.isFetching = false;
                this.error = error.error.error + ", " + error.status + ", " + error.statusText;
                console.log(error);
            }
        );
    }
    ngOnDestroy() {
        this.errorSub.unsubscribe();
    }
    onCreatePost(postData: post) {
        // *Send Http request
        // console.log(postData);
        this.postsService.createAndStorePost(postData.title, postData.content);
        
    }

    onFetchPosts() {
        // Send Http request
        this.isFetching = true;
        this.postsService.fetchPosts()
        .subscribe(
            post => {
                this.isFetching = false;
                this.loadedPosts = post;
            },
             error => {
                 this.isFetching = false;
                this.error = error.error.error + ", " + error.status + ", " + error.statusText;
            }
        );
    }
    onHandleError() {
        this.error = null;
    }

    onClearPosts() {
        // Send Http request
        this.postsService.deletePosts().subscribe(
            () => {
                this.loadedPosts = [];
            }
        )
    }
}
