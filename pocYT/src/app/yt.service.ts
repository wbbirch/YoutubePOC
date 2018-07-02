import { Injectable } from '@angular/core';
import { Observable, throwError, from } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, concatMap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { PlaylistItem } from './playlistItem';
import { PlaylistItemListResponse } from './playlistItemListResponse';
import { Playlist } from './playlist';
import { PlaylistListResponse } from './playlistListResponse';

export const httpOptions = {

    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'accessToken'
    })

}

@Injectable({
  providedIn: 'root'
})
export class YtService {

  public playlistId: string; //holds current playlist ID
  public playlistPageToken: string = ''; //holds current page in current list of playlists
    public playlistItemPageToken: string = ''; //holds current page in current playlist
  private ytPlaylistItemsUrl = 'https://www.googleapis.com/youtube/v3/playlistItems'; //API base URL for playlistItem requests
  private ytPlaylistsUrl = 'https://www.googleapis.com/youtube/v3/playlists'; //API base URL for playlist requests

    constructor(private http: HttpClient, private authService: AuthService) { }

    //gets access token from authService and stores it as an HttpHeader to be used with non-GET requests while user is signed in to Google/YouTube; clears access token if user has signed out
    setAccessToken(): void {

        try {

            httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + this.authService.getToken());

        } catch (Error) { //authService throws Error if there is no access token, i.e. user is signed-out

            httpOptions.headers = httpOptions.headers.delete('Authorization');

        }

  }

  //GET request for signed-in user's playlists; can only receive up to 50 Playlists at once
  getPlaylists(): Observable<PlaylistListResponse> {

    this.setAccessToken();

    //only gets playlists of signed-in user; pageToken not needed for request to be "complete", so keeping the parameter there makes sure user stays on the correct page on user view
    return this.http.get<PlaylistListResponse>(this.ytPlaylistsUrl + '?key=AIzaSyDmBnFCo-4j1EN9-ZCf_RZtgds-Eeweqoc&part=snippet&mine=true&maxResults=50&pageToken=' + this.playlistPageToken, httpOptions).pipe(catchError(this.handleError));

  }

    //GET request for main playlist; can only receive up to 50 PlaylistItems at once
    getPlaylistItems(playlistId: string): Observable<PlaylistItemListResponse> {

        //only returns snippet data; pageToken not needed for request to be "complete", so keeping the parameter there makes sure user stays on the correct playlist page
        this.playlistId = playlistId;
        return this.http.get<PlaylistItemListResponse>(this.ytPlaylistItemsUrl + '?key=AIzaSyDmBnFCo-4j1EN9-ZCf_RZtgds-Eeweqoc&part=snippet&playlistId=' + playlistId + '&maxResults=50&pageToken=' + this.playlistItemPageToken).pipe(catchError(this.handleError));

    }

    //GET request for a PlaylistItem in main playlist using its ID
    getPlaylistItem(id: string): Observable<PlaylistItemListResponse> {

        //only returns snippet data
        return this.http.get<PlaylistItemListResponse>(this.ytPlaylistItemsUrl + '?key=AIzaSyDmBnFCo-4j1EN9-ZCf_RZtgds-Eeweqoc&part=snippet&id=' + id).pipe(catchError(this.handleError));

    }

    //PUT request for existing PlaylistItem
    updatePlaylistItem(item: PlaylistItem): Observable<any> {

        this.setAccessToken();

        //currently, only updates item's position; potential to change contentDetails data
        return this.http.put(this.ytPlaylistItemsUrl + '?key=AIzaSyDmBnFCo-4j1EN9-ZCf_RZtgds-Eeweqoc&part=snippet', {
            "id": item.id,
            "snippet":
            {
                "playlistId": item.snippet.playlistId,
                "position": item.snippet.position,
                "resourceId":
                {
                    "kind": "youtube#video",
                    "videoId": item.snippet.resourceId.videoId
                }
            }
        }, httpOptions).pipe(catchError(this.handleError));

    }

    //POST request for new PlaylistItem using its video ID
    addPlaylistItem(videoId: string): Observable<PlaylistItem> {

        this.setAccessToken();

        //currently, only adds snippet data; potential to add contentDetails data, status data
        return this.http.post<PlaylistItem>(this.ytPlaylistItemsUrl + '?key=AIzaSyDmBnFCo-4j1EN9-ZCf_RZtgds-Eeweqoc&part=snippet', {
            "snippet":
            {
                "playlistId": this.playlistId,
                "resourceId": 
                {
                    "kind": "youtube#video",
                    "videoId": videoId
                }
            }
        }, httpOptions).pipe(catchError(this.handleError));

    }

    //DELETE request for existing PlaylistItem using its ID
    deletePlaylistItem(items: PlaylistItem[]): Observable<PlaylistItem> {

      this.setAccessToken();

      //concatenates Observables from each to-be-deleted PlaylistItem in items array; each will be executed in series when subscribed to
      return from(items).pipe(concatMap(item => <Observable<PlaylistItem>>this.http.delete<PlaylistItem>(this.ytPlaylistItemsUrl + '?key=AIzaSyDmBnFCo-4j1EN9-ZCf_RZtgds-Eeweqoc&id=' + item.id, httpOptions).pipe(catchError(this.handleError))));

    }

    //error handler that provides user-friendly advice/details for common error codes
    giveErrorSolution(error: any): string {

        let errorSolutionText: string;

        if (error.match(/(.*)400(.*)/)) {

            errorSolutionText = 'Please enter a valid value.';

        } else if (error.match(/(.*)401(.*)/)) {

            //checks if user is unauthorized and if an access token exists, i.e. user is signed-in
            if (httpOptions.headers.get('Authorization')) {
                errorSolutionText = 'You\'re either unauthorized to edit this playlist or your access has expired; please sign in with the correct YouTube account.';
            } else {
                errorSolutionText = 'Please sign in.';
            }

        } else if (error.match(/(.*)403(.*)/)) {

            errorSolutionText = 'I don\'t know what you\'re trying to do, but you can\'t do it.'; //forbidden

        } else if (error.match(/(.*)404(.*)/)) {

            errorSolutionText = 'Try another value.';

        }

        return errorSolutionText;

    }

    //error handler that provides status code and message details
    private handleError(error: HttpErrorResponse) {

        let errorText: string;

        if (error.error instanceof ErrorEvent) {

            //client-side error handler
            console.error('An error occurred:', error.error.message);
            errorText = error.error.message;

        } else {

            //server-side error handler
            console.error(`Backend returned code ${error.status}: ${error.error.error.message}`); //format is HttpErrorResponse.JSON_response_body.error_field.error_message_field
            errorText = `${error.status} - ${error.error.error.message}`;

        }

        return throwError(errorText);

    }

}
