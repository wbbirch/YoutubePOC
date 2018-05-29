﻿import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { YtComponent } from './yt/yt.component';
import { VideoDetailComponent } from './video-detail/video-detail.component';

const routes: Routes = [
    { path: '', redirectTo: 'playlist', pathMatch: 'full' }, //default
    { path: 'playlist', component: YtComponent }, //main playlist
    { path: 'video/:id', component: VideoDetailComponent } //individual video
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class YtRoutingModule { }
