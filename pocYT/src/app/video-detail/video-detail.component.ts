import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { PlaylistItem } from '../playlistItem';
import { YtService } from '../yt.service';

// from Angular Material documentation for input form control
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.css']
})
export class VideoDetailComponent implements OnInit {

  item: PlaylistItem;

  error: string;
  errorSolution: string;

  // the validators don't actually enforce anything, they just allow the correct errors to display on the input box
  positionFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]*'),
    Validators.min(1)
  ]);
  matcher = new MyErrorStateMatcher();

  constructor(private route: ActivatedRoute, private ytService: YtService, private location: Location) { }

  ngOnInit() {

    this.getPlaylistItem();

  }

  // passes a PlaylistItem's ID to a GET request, which returns a PlaylistItemListResponse; first (usually only) element in playlistItemListResponse is stored in item and its info is displayed on page
  getPlaylistItem(): void {

    const id = this.route.snapshot.paramMap.get('id'); //ID also stored in PlaylistItem (i.e. item.id) so it can be pulled from there alternatively
    this.ytService.getPlaylistItem(id).subscribe(
      playlistItemListResponse => this.item = playlistItemListResponse.items[0], 
      error => {
        this.setError(error);
      });
  }

  goBack(): void {

    this.location.back();

  }

  // Asks ytService to update the current item, makes sure that ytService has an id, and calls goBack
  savePlaylistItem(position: number): void {

    //enforces validation rules
    if (isNaN(position) || position < 0) {
      return;
    }

    this.item.snippet.position = position;
    this.ytService.updatePlaylistItem(this.item).subscribe(() => {
      //navigates user back to playlist page if user lands on a detail page independently (without routing)
      if (!this.ytService.playlistId) {
        this.ytService.playlistId = this.item.snippet.playlistId;
      }
      this.goBack();
    }, error => {
      this.setError(error);
    });

  }
   
  // For use in template
  isNaN(num: number): boolean {
    return isNaN(num);
  }

  private setError(error) {

    this.errorSolution = this.ytService.giveErrorSolution(error);
    this.error = error;

  }

}
