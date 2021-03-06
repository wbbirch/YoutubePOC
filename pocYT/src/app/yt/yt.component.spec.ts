import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { YtComponent } from './yt.component';
import { YtService } from '../yt.service';
import { PlaylistItem } from '../playlistItem';
import { PlaylistItemListResponse } from '../playlistItemListResponse';
import { FakeYtService } from 'src/test-files/yt.service.fake';
import { PlaylistListResponse } from '../playlistListResponse';

describe('YtComponent', () => {
  let component: YtComponent;
  let fixture: ComponentFixture<YtComponent>;
  let ytServiceFake: FakeYtService;

  describe('(unit tests)', () => {
    beforeEach(async(() => {
      ytServiceFake = new FakeYtService();
  
      TestBed.configureTestingModule({
        declarations: [YtComponent],
        schemas: [ NO_ERRORS_SCHEMA ],
        imports: [ RouterTestingModule ],
        providers: [
          {
            provide: YtService,
            useValue: ytServiceFake as YtService
          }
        ]
      });
      
      fixture = TestBed.overrideComponent(YtComponent, {
        set: {
          template: '<div></div>'
        }
      }).createComponent(YtComponent);
      component = fixture.componentInstance;
    }));

    describe('ngOnInit:', () => {
      describe('(when ytService has no playlistId):', () => {
        it('does not ask service for playlist', () => {
          spyOn(component, 'getPlaylistItems');
          expect(component.getPlaylistItems).not.toHaveBeenCalled();
        });
      });
  
      describe('(when ytService has a playlistId):', () => {
        it('asks service for playlist', () => {
          spyOn(component, 'getPlaylistItems');
          ytServiceFake.playlistId = ytServiceFake.playlistIdStub;
          component.ngOnInit();
          expect(component.getPlaylistItems).toHaveBeenCalledWith(ytServiceFake.playlistId);
        });
        // TODO: add tests for error response
      });
    });
  
    describe('getPlaylistItems:', () => {
      let blankPlaylistId = '   ';
      let getPlaylistItemsSpy;
      let getPlaylistSpy;
  
      beforeEach(() => {
        getPlaylistItemsSpy = spyOn(ytServiceFake, 'getPlaylistItems').and.callThrough();
        getPlaylistSpy = spyOn(ytServiceFake, 'getPlaylist').and.callThrough();
      });
  
      it('should not call out to service on blank input', fakeAsync(() => {
        component.getPlaylistItems(blankPlaylistId);
        tick();
        expect(getPlaylistItemsSpy).not.toHaveBeenCalled();
        expect(getPlaylistSpy).not.toHaveBeenCalled();
      }));
  
      it('calls ytService with given playlistId input and update playlistItemListResponse and playlistItems', fakeAsync(() => {
        let expectedResponse = new PlaylistItemListResponse();
        let expectedPlaylistListResponse = ytServiceFake.fixedFakePlaylistListResponse;
        expectedPlaylistListResponse.items = [ytServiceFake.fixedFakePlaylist];
        ytServiceFake.playlistItemListResponseToReturn = expectedResponse;
        ytServiceFake.playlistListResponseToReturn = expectedPlaylistListResponse;
        component.getPlaylistItems(ytServiceFake.playlistIdStub);
        tick();
        expect(getPlaylistItemsSpy).toHaveBeenCalledWith(ytServiceFake.playlistIdStub);
        expect(component.playlistItemListResponse).toEqual(expectedResponse);
        expect(getPlaylistSpy).toHaveBeenCalledWith(ytServiceFake.playlistIdStub);
        expect(component.playlistListResponse).toEqual(expectedPlaylistListResponse);
  
        let idStub = 'PLWQB0T3rGCzEPRWOqrfSrJW_-A7RsT4qS     ';
        let actualId = 'PLWQB0T3rGCzEPRWOqrfSrJW_-A7RsT4qS';
        component.getPlaylistItems(idStub);
        tick();
        expect(getPlaylistItemsSpy).toHaveBeenCalledWith(actualId);
        expect(component.playlistItemListResponse).toEqual(expectedResponse);
        expect(getPlaylistSpy).toHaveBeenCalledWith(actualId);
        expect(component.playlistListResponse).toEqual(expectedPlaylistListResponse);
  
        idStub = '      PLWQB0T3rGCzEPRWOqrfSrJW_-A7RsT4qS';
        component.getPlaylistItems(idStub);
        tick();
        expect(getPlaylistItemsSpy).toHaveBeenCalledWith(actualId);
        expect(component.playlistItemListResponse).toEqual(expectedResponse);
        expect(getPlaylistSpy).toHaveBeenCalledWith(actualId);
        expect(component.playlistListResponse).toEqual(expectedPlaylistListResponse);
  
        idStub = '  \t    PLWQB0T3rGCzEPRWOqrfSrJW_-A7RsT4qS              ';
        component.getPlaylistItems(idStub);
        tick();
        expect(getPlaylistItemsSpy).toHaveBeenCalledWith(actualId);
        expect(component.playlistItemListResponse).toEqual(expectedResponse);
        expect(getPlaylistSpy).toHaveBeenCalledWith(actualId);
        expect(component.playlistListResponse).toEqual(expectedPlaylistListResponse);
  
        idStub = '\r\nPLWQB0T3rGCzEPRWOqrfSrJW_-A7RsT4qS\r\n\t';
        component.getPlaylistItems(idStub);
        tick();
        expect(getPlaylistItemsSpy).toHaveBeenCalledWith(actualId);
        expect(component.playlistItemListResponse).toEqual(expectedResponse);
        expect(getPlaylistSpy).toHaveBeenCalledWith(actualId);
        expect(component.playlistListResponse).toEqual(expectedPlaylistListResponse);
      }));
  
      it('calls ytService with correct playlistId when given playlist URL', fakeAsync(() => {
        let urlStub = ' \r  https://youtube.com/playlist?list=PLWQB0T3rGCzEPRWOqrfSrJW_-A7RsT4qS&app=desktop  \n ';
        let expectedId = 'PLWQB0T3rGCzEPRWOqrfSrJW_-A7RsT4qS';
        let expectedResponse = new PlaylistItemListResponse();
        let expectedPlaylistListResponse = ytServiceFake.fixedFakePlaylistListResponse;
        expectedPlaylistListResponse.items = [ytServiceFake.fixedFakePlaylist];
        ytServiceFake.playlistItemListResponseToReturn = expectedResponse;
        ytServiceFake.playlistListResponseToReturn = expectedPlaylistListResponse;
        component.getPlaylistItems(urlStub);
        tick();
        expect(getPlaylistItemsSpy).toHaveBeenCalledWith(expectedId);
        expect(component.playlistItemListResponse).toEqual(expectedResponse);
        expect(getPlaylistSpy).toHaveBeenCalledWith(expectedId);
        expect(component.playlistListResponse).toEqual(expectedPlaylistListResponse);
  
        urlStub = '   \t   https://www.youtube.com/playlist?list=PLWQB0T3rGCzHKoCUvt2g5uGGD5fYVywbt   ';
        expectedId = 'PLWQB0T3rGCzHKoCUvt2g5uGGD5fYVywbt';
        component.getPlaylistItems(urlStub);
        tick();
        expect(getPlaylistItemsSpy).toHaveBeenCalledWith(expectedId);
        expect(component.playlistItemListResponse).toEqual(expectedResponse);
        expect(getPlaylistSpy).toHaveBeenCalledWith(expectedId);
        expect(component.playlistListResponse).toEqual(expectedPlaylistListResponse);
  
        urlStub = '   youtube.com/playlist?list=PLWQB0T3rGCzHXgO11UaJ1akGYPAMaZ44f\t   \n';
        expectedId = 'PLWQB0T3rGCzHXgO11UaJ1akGYPAMaZ44f';
        component.getPlaylistItems(urlStub);
        tick();
        expect(getPlaylistItemsSpy).toHaveBeenCalledWith(expectedId);
        expect(component.playlistItemListResponse).toEqual(expectedResponse);
        expect(getPlaylistSpy).toHaveBeenCalledWith(expectedId);
        expect(component.playlistListResponse).toEqual(expectedPlaylistListResponse);
  
        urlStub = '  \t\rlist=PLWQB0T3rGCzHXgO11UaJ1akGYFJ58BJHDU\t   \n';
        expectedId = 'PLWQB0T3rGCzHXgO11UaJ1akGYFJ58BJHDU';
        component.getPlaylistItems(urlStub);
        tick();
        expect(getPlaylistItemsSpy).toHaveBeenCalledWith(expectedId);
        expect(component.playlistItemListResponse).toEqual(expectedResponse);
        expect(getPlaylistSpy).toHaveBeenCalledWith(expectedId);
        expect(component.playlistListResponse).toEqual(expectedPlaylistListResponse);
      }));
  
      it('populates error and errorSolution and clears playlistId if ytService has a problem', fakeAsync(() => {
        let errorStub = 'error_stub';
        let solutionStub = 'solution_stub';
        getPlaylistItemsSpy.and.callFake((str) => {
          return new Observable((observer) => {
            observer.error(errorStub);
          });
        });
        ytServiceFake.errorSolution = solutionStub;
        spyOn(ytServiceFake, 'giveErrorSolution').and.callThrough();
  
        component.getPlaylistItems(ytServiceFake.playlistIdStub);
        tick();
        expect(ytServiceFake.playlistId).toEqual('');
        expect(component.error).toEqual(errorStub);
        expect(component.errorSolution).toEqual(solutionStub);
        expect(ytServiceFake.giveErrorSolution).toHaveBeenCalledWith(errorStub);
      }));

      it('only allows page change and deletion once service has completed', fakeAsync(() => {
        getPlaylistItemsSpy.and.returnValue(new Observable((observer) => {
          expect(component.allowPageChangeButtonClick).toBeFalsy();
          expect(component.allowDeleteButtonClick).toBeFalsy();
          observer.next(Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse));
          expect(component.allowPageChangeButtonClick).toBeFalsy();
          expect(component.allowDeleteButtonClick).toBeFalsy();
          observer.complete();
        }));
        
        expect(component.allowPageChangeButtonClick).toBeFalsy();
        expect(component.allowDeleteButtonClick).toBeFalsy();
        component.getPlaylistItems(ytServiceFake.playlistIdStub);
        tick();
        expect(component.allowPageChangeButtonClick).toBeTruthy();
        expect(component.allowDeleteButtonClick).toBeTruthy();
      }));
    });
  
    describe('addPlaylistItem:', () => {
      let emptyVideoIdStub = '    ';
      let addPlaylistItemSpy;
  
      beforeEach(() => {
        addPlaylistItemSpy = spyOn(ytServiceFake, 'addPlaylistItem').and.callThrough();
      });
  
      it('should not call out to service on blank input', fakeAsync(() => {
        component.addPlaylistItem(emptyVideoIdStub);
        tick();
        expect(addPlaylistItemSpy).not.toHaveBeenCalled();
      }));
  
      it('asks service to add item with given videoId', fakeAsync(() => {
        ytServiceFake.fakeCloudPlaylist = new Array<PlaylistItem>(50);
        ytServiceFake.playlistItemListResponseToReturn = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
        ytServiceFake.playlistItemListResponseToReturn.items = ytServiceFake.fakeCloudPlaylist;
        ytServiceFake.playlistItemToAdd = Object.assign({}, ytServiceFake.fixedFakePlaylistItem);
        component.getPlaylistItems(ytServiceFake.playlistIdStub);
        tick();
  
        component.addPlaylistItem(ytServiceFake.videoIdStub);
        tick();
        expect(addPlaylistItemSpy).toHaveBeenCalledWith(ytServiceFake.videoIdStub);
  
        let videoIdStub = 'vYb4_ARPNfo';
        let actualVideoId = 'vYb4_ARPNfo';
        component.addPlaylistItem(videoIdStub);
        tick();
        expect(addPlaylistItemSpy).toHaveBeenCalledWith(actualVideoId);
  
        videoIdStub = '         \n\r\t\r    vYb4_ARPNfo       \t\n\r';
        component.addPlaylistItem(videoIdStub);
        tick();
        expect(addPlaylistItemSpy).toHaveBeenCalledWith(actualVideoId);
      }));
  
      it('asks service to add item with correct id given video URL', fakeAsync(() => {
        ytServiceFake.fakeCloudPlaylist = new Array<PlaylistItem>(50);
        ytServiceFake.playlistItemListResponseToReturn = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
        ytServiceFake.playlistItemListResponseToReturn.items = ytServiceFake.fakeCloudPlaylist;
        ytServiceFake.playlistItemToAdd = Object.assign({}, ytServiceFake.fixedFakePlaylistItem);
        component.getPlaylistItems(ytServiceFake.playlistIdStub);
        tick();
  
        let urlStub = 'https://www.youtube.com/watch?v=vYb4_ARPNfo&list=PLWQB0T3rGCzEPRWOqrfSrJW_-A7RsT4qS&index=2&t=0s';
        let actualVideoId = 'vYb4_ARPNfo';
        component.addPlaylistItem(urlStub);
        tick();
        expect(addPlaylistItemSpy).toHaveBeenCalledWith(actualVideoId);
  
        urlStub = '         \n\r\t\r    https://www.youtube.com/watch?v=vYb4_ARPNfo&list=PLWQB0T3rGCzEPRWOqrfSrJW_-A7RsT4qS&index=2&t=0s       \t\n\r';
        component.addPlaylistItem(urlStub);
        tick();
        expect(addPlaylistItemSpy).toHaveBeenCalledWith(actualVideoId);
  
        urlStub = '         \n\r\t\r    youtube.com/watch?v=vYb4_ARPNfo&list=PLWQB0T3rGCzEPRWOqrfSrJW_-A7RsT4qS&index=2&t=0s       \t\n\r';
        component.addPlaylistItem(urlStub);
        tick();
        expect(addPlaylistItemSpy).toHaveBeenCalledWith(actualVideoId);
  
        urlStub = '         \n\r\t\r    youtube.com/watch?v=vYb4_ARPNfo       \t\n\r';
        component.addPlaylistItem(urlStub);
        tick();
        expect(addPlaylistItemSpy).toHaveBeenCalledWith(actualVideoId);
  
        urlStub = '         \n\r\t\r    v=vYb4_ARPNfo       \t\n\r';
        component.addPlaylistItem(urlStub);
        tick();
        expect(addPlaylistItemSpy).toHaveBeenCalledWith(actualVideoId);
      }));
  
      it('updates fields once the item is added (length == 50)', fakeAsync(() => {
        let origLength: number = 50;
        ytServiceFake.fakeCloudPlaylist = new Array<PlaylistItem>(origLength);
        ytServiceFake.playlistItemListResponseToReturn = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
        ytServiceFake.playlistItemListResponseToReturn.items = ytServiceFake.fakeCloudPlaylist;
        ytServiceFake.playlistItemToAdd = Object.assign({}, ytServiceFake.fixedFakePlaylistItem);
        component.getPlaylistItems(ytServiceFake.playlistIdStub);
        tick();
  
        component.addPlaylistItem(ytServiceFake.videoIdStub);
        tick();
  
        expect(component.playlistItems.length).toBe(origLength + 1);
        expect(component.playlistItems).toContain(ytServiceFake.playlistItemToAdd);
      }));
  
      it('updates fields once the item is added (length > 50)', fakeAsync(() => {
        let origLength: number = 4999;
        ytServiceFake.fakeCloudPlaylist = new Array<PlaylistItem>(origLength);
        ytServiceFake.playlistItemListResponseToReturn = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
        ytServiceFake.playlistItemListResponseToReturn.items = ytServiceFake.fakeCloudPlaylist;
        ytServiceFake.playlistItemToAdd = Object.assign({}, ytServiceFake.fixedFakePlaylistItem);
        component.getPlaylistItems(ytServiceFake.playlistIdStub);
        tick();
  
        component.addPlaylistItem(ytServiceFake.videoIdStub);
        tick();
  
        expect(component.playlistItems.length).toBe(origLength + 1);
        expect(component.playlistItems).toContain(ytServiceFake.playlistItemToAdd);
      }));
  
      it('updates fields once the item is added (length < 50)', fakeAsync(() => {
        let origLength: number = 1;
        ytServiceFake.fakeCloudPlaylist = new Array<PlaylistItem>(origLength);
        ytServiceFake.fakeCloudPlaylist[origLength - 1] = Object.assign({}, ytServiceFake.fixedFakePlaylistItem);
        ytServiceFake.playlistItemListResponseToReturn = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
        ytServiceFake.playlistItemListResponseToReturn.items = ytServiceFake.fakeCloudPlaylist.slice();
        ytServiceFake.playlistItemListResponseToReturn.pageInfo = { totalResults: origLength, resultsPerPage: 50 };
        ytServiceFake.playlistItemToAdd = Object.assign({}, ytServiceFake.fixedFakePlaylistItem);
        component.getPlaylistItems(ytServiceFake.playlistIdStub);
        tick();
  
        component.addPlaylistItem(ytServiceFake.videoIdStub);
        tick();
  
        expect(component.playlistItems.length).toBe(origLength + 1);
        expect(component.playlistItems).toContain(ytServiceFake.playlistItemToAdd);
      }));
  
      it('updates fields once the item is added (length == 0)', fakeAsync(() => {
        ytServiceFake.fakeCloudPlaylist = new Array<PlaylistItem>();
        ytServiceFake.playlistItemListResponseToReturn = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
        ytServiceFake.itemsInPlaylistItemListResponseToReturnSliceOf = ytServiceFake.fakeCloudPlaylist;
        ytServiceFake.playlistItemToAdd = Object.assign({}, ytServiceFake.fixedFakePlaylistItem);
        component.getPlaylistItems(ytServiceFake.playlistIdStub);
        tick();
  
        component.addPlaylistItem(ytServiceFake.videoIdStub);
        tick();
  
        expect(component.playlistItems.length).toBe(1);
        expect(component.playlistItems).toContain(ytServiceFake.playlistItemToAdd);
      }));
  
      it('populates error and errorSolution if ytService has a problem', fakeAsync(() => {
        ytServiceFake.fakeCloudPlaylist = new Array<PlaylistItem>(50);
        ytServiceFake.playlistItemListResponseToReturn = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
        ytServiceFake.playlistItemListResponseToReturn.items = ytServiceFake.fakeCloudPlaylist;
        ytServiceFake.playlistItemToAdd = Object.assign({}, ytServiceFake.fixedFakePlaylistItem);
        component.getPlaylistItems(ytServiceFake.playlistIdStub);
        tick();
  
        let errorStub = 'error_stub';
        let solutionStub = 'solution_stub';
        ytServiceFake.errorSolution = solutionStub;
        addPlaylistItemSpy.and.callFake((str) => {
          return new Observable((observer) => {
            observer.error(errorStub);
          });
        });
        spyOn(ytServiceFake, 'giveErrorSolution').and.callThrough();
        component.addPlaylistItem(ytServiceFake.videoIdStub);
        tick();
        expect(component.error).toEqual(errorStub);
        expect(component.errorSolution).toEqual(solutionStub);
        expect(ytServiceFake.giveErrorSolution).toHaveBeenCalledWith(errorStub);
      }));
    });
  
    describe('deletePlaylistItems & toggleToDelete:', () => {
      beforeEach(fakeAsync(() => {
        // populate fakeCloudPlaylist with filled fake items
        let fakeCloudPlaylist: PlaylistItem[] = new Array<PlaylistItem>(10);
        for (let i = 0; i < fakeCloudPlaylist.length; i++) {
          fakeCloudPlaylist[i] = Object.assign({}, ytServiceFake.fixedFakePlaylistItem);
          fakeCloudPlaylist[i].id = i.toString();
        }
        ytServiceFake.fakeCloudPlaylist = fakeCloudPlaylist;
  
        // populate component's fields
        ytServiceFake.playlistItemListResponseToReturn = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
        ytServiceFake.playlistItemListResponseToReturn.items = ytServiceFake.fakeCloudPlaylist;
        component.getPlaylistItems(ytServiceFake.playlistIdStub);
        tick();
      }));
  
      it('asks service to delete array of PlaylistItems that have been toggled to delete', fakeAsync(() => {
        let indexesToDeleteAt: number[];
        let deleteSpy = spyOn(ytServiceFake, 'deletePlaylistItem').and.returnValue(new Observable((observer) => {
          observer.next();
          observer.complete();
        }));
        let mostRecentList = function(): PlaylistItem[] {
          return deleteSpy.calls.mostRecent().args[0];
        }
  
        indexesToDeleteAt = [0];
        indexesToDeleteAt.forEach((i) => {
          component.toggleToDelete(i);
        });
        component.deletePlaylistItems();
        tick();
        indexesToDeleteAt.forEach((i) => {
          expect(mostRecentList()).toContain(ytServiceFake.fakeCloudPlaylist[i]);
        });
  
        indexesToDeleteAt = [0, 2, 5, 9];
        indexesToDeleteAt.forEach((i) => {
          component.toggleToDelete(i);
        });
        component.deletePlaylistItems();
        tick();
        indexesToDeleteAt.forEach((i) => {
          expect(mostRecentList()).toContain(ytServiceFake.fakeCloudPlaylist[i]);
        });
  
        indexesToDeleteAt = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        indexesToDeleteAt.forEach((i) => {
          component.toggleToDelete(i);
        });
        component.deletePlaylistItems();
        tick();
        indexesToDeleteAt.forEach((i) => {
          expect(mostRecentList()).toContain(ytServiceFake.fakeCloudPlaylist[i]);
        });
      }));
  
      it('does not ask service to delete anything if nothing has been marked for deletion', fakeAsync(() => {
        spyOn(ytServiceFake, 'deletePlaylistItem').and.returnValue(new Observable());
  
        component.deletePlaylistItems();
        tick();
  
        expect(ytServiceFake.deletePlaylistItem).not.toHaveBeenCalled();
      }));
  
      it('updates fields once service completes action, resets toggle status', fakeAsync(() => {
        ytServiceFake.playlistId = ytServiceFake.playlistIdStub;
        spyOn(component, 'getPlaylistItems');
        spyOn(ytServiceFake, 'deletePlaylistItem').and.callThrough();
  
        component.toggleToDelete(0);
        component.deletePlaylistItems();
        tick();

        expect(component.allowDeleteButtonClick).toBeFalsy();
        expect(ytServiceFake.deletePlaylistItem).toHaveBeenCalledTimes(1);
        expect(component.getPlaylistItems).toHaveBeenCalledWith(ytServiceFake.playlistIdStub);

        component.deletePlaylistItems();
        tick();

        expect(ytServiceFake.deletePlaylistItem).toHaveBeenCalledTimes(1);
      }));
  
      it('allows items to be toggled back and forth before actual deletion', fakeAsync(() => {
        let indexesToDeleteAt: number[];
        let indexesToNotDeleteAt: number[];
        let deleteSpy = spyOn(ytServiceFake, 'deletePlaylistItem').and.returnValue(new Observable((observer) => {
          observer.next();
          observer.complete();
        }));
  
        indexesToDeleteAt = [0, 3, 5, 9];
        indexesToNotDeleteAt = [1, 8];
        indexesToDeleteAt.forEach((i) => {
          component.toggleToDelete(i);
        });
        for (let i = 0; i < 8; i++) {
           component.toggleToDelete(0);
        }
        component.toggleToDelete(9);
        component.toggleToDelete(8);
                                    component.toggleToDelete(9);
                                    component.toggleToDelete(8);
        component.deletePlaylistItems();
        tick();

        indexesToDeleteAt.forEach((i) => {
          expect(deleteSpy.calls.mostRecent().args[0]).toContain(ytServiceFake.fakeCloudPlaylist[i]);
        });
        indexesToNotDeleteAt.forEach((i) => {
          expect(deleteSpy.calls.mostRecent().args[0]).not.toContain(ytServiceFake.fakeCloudPlaylist[i]);
        });
      }));
  
      it('populates error and errorSolution if ytService has a problem, does not reset toggle status but resets delete button', fakeAsync(() => {
        let errorStub = 'delete_error_stub';
        let solutionStub = 'delete_solution_stub';
        let deleteSpy = spyOn(ytServiceFake, 'deletePlaylistItem').and.returnValue(new Observable((observer) => {
          observer.error(errorStub);
        }));
        spyOn(ytServiceFake, 'giveErrorSolution').and.returnValue(solutionStub);

        let indexesToDeleteAt: number[] = [0, 3];
        let indexesToNotDeleteAt: number[] = [9];
        component.toggleToDelete(0); 
        component.toggleToDelete(9); component.toggleToDelete(9);
        component.toggleToDelete(3);
        component.deletePlaylistItems();
        tick();

        expect(component.error).toEqual(errorStub);
        expect(component.errorSolution).toEqual(solutionStub);
        expect(component.allowDeleteButtonClick).toBeTruthy();

        deleteSpy.and.returnValue(new Observable((observer) => {
          observer.next();
          observer.complete();
        }));
        component.deletePlaylistItems();
        tick();

        expect(deleteSpy).toHaveBeenCalledTimes(2);
        indexesToDeleteAt.forEach((i) => {
          expect(deleteSpy.calls.mostRecent().args[0]).toContain(ytServiceFake.fakeCloudPlaylist[i]);
        });
        indexesToNotDeleteAt.forEach((i) => {
          expect(deleteSpy.calls.mostRecent().args[0]).not.toContain(ytServiceFake.fakeCloudPlaylist[i]);
        });
      }));
    });
  
    describe('toPrevPage:', () => {
      let prevPageTokenStub: string;
  
      beforeEach(() => {
        prevPageTokenStub = 'prev_page_token_stub';
        ytServiceFake.playlistItemListResponseToReturn = new PlaylistItemListResponse();
        ytServiceFake.playlistItemListResponseToReturn.prevPageToken = prevPageTokenStub;
      });
  
      it('sets service\'s page token to response\'s prev page token', fakeAsync(() => {
        component.getPlaylistItems(ytServiceFake.playlistIdStub);
        tick();
        component.toPrevPage();
        tick();
        expect(ytServiceFake.playlistItemPageToken).toEqual(prevPageTokenStub);
      }));
  
      it('populates its fields from service after setting the page token', fakeAsync(() => {
        ytServiceFake.fakeCloudPlaylist = new Array<PlaylistItem>();
        ytServiceFake.playlistItemListResponseToReturn.items = ytServiceFake.fakeCloudPlaylist.slice(0, 50);
        component.getPlaylistItems(ytServiceFake.playlistIdStub);
        tick();
        component.toPrevPage();
        tick();
        expect(component.playlistItemListResponse).toEqual(ytServiceFake.playlistItemListResponseToReturn);
        expect(component.playlistItems).toEqual(ytServiceFake.fakeCloudPlaylist);
        expect(component.playlistListResponse).toEqual(ytServiceFake.fixedFakePlaylistListResponse);
        expect(component.currentPlaylist).toEqual(ytServiceFake.fixedFakePlaylist);
      }));

      it('resets items to be deleted', fakeAsync(() => {
        ytServiceFake.fakeCloudPlaylist = new Array<PlaylistItem>(100);
        for (let i = 0; i < ytServiceFake.fakeCloudPlaylist.length; i++) {
          ytServiceFake.fakeCloudPlaylist[i] = Object.assign({}, ytServiceFake.fixedFakePlaylistItem);
        }
        ytServiceFake.playlistItemListResponseToReturn.items = ytServiceFake.fakeCloudPlaylist.slice(50, 100);
        component.getPlaylistItems(ytServiceFake.playlistIdStub);
        tick();

        let indexesToToggleAt: number[] = [0, 49, 2, 5, 35];
        indexesToToggleAt.forEach((index) => {
          component.toggleToDelete(index);
        });
        ytServiceFake.playlistItemListResponseToReturn.items = ytServiceFake.fakeCloudPlaylist.slice(0, 50);
        component.toPrevPage();
        tick();

        spyOn(ytServiceFake, 'deletePlaylistItem');
        component.deletePlaylistItems();
        expect(ytServiceFake.deletePlaylistItem).not.toHaveBeenCalled();
      }));

      it('sets allowPageChangeButtonClick to false', fakeAsync(() => {
        component.allowPageChangeButtonClick = true;
        component.playlistItemListResponse = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
        spyOn(component, 'getPlaylistItems');
        component.toPrevPage();
        expect(component.allowPageChangeButtonClick).toBeFalsy();
      }));
    });
  
    describe('toNextPage:', () => {
      let nextPageTokenStub: string;
  
      beforeEach(() => {
        let nextPageTokenStub: string = 'next_page_token_stub';
        ytServiceFake.playlistItemListResponseToReturn = new PlaylistItemListResponse();
        ytServiceFake.playlistItemListResponseToReturn.prevPageToken = nextPageTokenStub;
      });
  
      it('sets service\'s page token to response\'s next page token', fakeAsync(() => {
        component.getPlaylistItems(ytServiceFake.playlistIdStub);
        tick();
        component.toNextPage();
        tick();
        expect(ytServiceFake.playlistItemPageToken).toEqual(nextPageTokenStub);
      }));
  
      it('populates its fields from service after setting the page token', fakeAsync(() => {
        ytServiceFake.fakeCloudPlaylist = new Array<PlaylistItem>();
        ytServiceFake.playlistItemListResponseToReturn.items = ytServiceFake.fakeCloudPlaylist.slice();
        component.getPlaylistItems(ytServiceFake.playlistIdStub);
        tick();
        component.toNextPage();
        tick();
        expect(component.playlistItemListResponse).toEqual(ytServiceFake.playlistItemListResponseToReturn);
        expect(component.playlistItems).toEqual(ytServiceFake.fakeCloudPlaylist);
        expect(component.playlistListResponse).toEqual(ytServiceFake.fixedFakePlaylistListResponse);
        expect(component.currentPlaylist).toEqual(ytServiceFake.fixedFakePlaylist);
      }));
      
      it('resets items to be deleted', fakeAsync(() => {
        ytServiceFake.fakeCloudPlaylist = new Array<PlaylistItem>(100);
        for (let i = 0; i < ytServiceFake.fakeCloudPlaylist.length; i++) {
          ytServiceFake.fakeCloudPlaylist[i] = Object.assign({}, ytServiceFake.fixedFakePlaylistItem);
        }
        ytServiceFake.playlistItemListResponseToReturn.items = ytServiceFake.fakeCloudPlaylist.slice(0, 50);
        component.getPlaylistItems(ytServiceFake.playlistIdStub);
        tick();

        let indexesToToggleAt: number[] = [0, 49, 2, 5, 35];
        indexesToToggleAt.forEach((index) => {
          component.toggleToDelete(index);
        });
        ytServiceFake.playlistItemListResponseToReturn.items = ytServiceFake.fakeCloudPlaylist.slice(50, 100);
        component.toNextPage();
        tick();

        spyOn(ytServiceFake, 'deletePlaylistItem');
        component.deletePlaylistItems();
        expect(ytServiceFake.deletePlaylistItem).not.toHaveBeenCalled();
      }));

      it('sets allowPageChangeButtonClick to false', fakeAsync(() => {
        component.allowPageChangeButtonClick = true;
        component.playlistItemListResponse = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
        spyOn(component, 'getPlaylistItems');
        component.toNextPage();
        expect(component.allowPageChangeButtonClick).toBeFalsy();
      }));
    });
  
    describe('clearErrors:', () => {
      it('should set error and errorSolution to null', () => {
        component.error = "some error";
        component.errorSolution = "some solution";
        component.clearErrors();
        expect(component.error).toBeNull();
        expect(component.errorSolution).toBeNull();
      });
    });

    describe('clearPageToken:', () => {
      it('should clear playlistItemPageToken in service', () => {
        ytServiceFake.playlistItemPageToken = 'token_stub';
        component.clearPageToken();
        expect(ytServiceFake.playlistItemPageToken).toEqual('');
      });
    });
  });

  describe('(DOM)', () => {
    let debugElement: DebugElement;
    let rootElement: HTMLElement;

    beforeEach(async(() => {
      ytServiceFake = new FakeYtService();
  
      TestBed.configureTestingModule({
        declarations: [YtComponent],
        schemas: [ NO_ERRORS_SCHEMA ],
        imports: [ RouterTestingModule ],
        providers: [
          {
            provide: YtService,
            useValue: ytServiceFake as YtService
          }
        ]
      }).compileComponents();
      fixture = TestBed.createComponent(YtComponent);
      component = fixture.componentInstance;

      debugElement = fixture.debugElement;
      rootElement = fixture.nativeElement;
    }));

    describe('mat-toolbar:', () => {
      let toolbar: Element;
      let toolbarRows: NodeListOf<Element>;
      
      beforeEach(() => {
        toolbar = rootElement.querySelector('mat-toolbar');
        toolbarRows = toolbar.querySelectorAll('mat-toolbar-row');
      });

      it('contains "Playlist View" in first row', () => {
        let firstRow: Element = toolbarRows.item(0);
        expect(firstRow.innerHTML).toContain("Playlist View");
      });

      it('contains playlist name if playlist exists', () => {
        component.currentPlaylist = ytServiceFake.fixedFakePlaylist;
        fixture.detectChanges();

        let firstRow = toolbarRows[0];
        expect(firstRow.innerHTML).toContain(component.currentPlaylist.id);
      });

      it('contains field for playlist ID and button to show playlist in second row', () => {
        let field: HTMLInputElement = toolbarRows.item(1).querySelector('mat-form-field').querySelector('input');
        let button: HTMLButtonElement = toolbarRows.item(1).querySelector('button');

        expect(field.getAttribute('placeholder').toLowerCase()).toContain('playlist id');
        expect(button.innerHTML.toLowerCase()).toContain('show playlist');

        spyOn(component, 'clearErrors');
        spyOn(component, 'clearPageToken');
        spyOn(component, 'getPlaylistItems');
        field.value = 'playlist_id_stub';
        field.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.getPlaylistItems).not.toHaveBeenCalled();
        button.click();
        expect(component.clearErrors).toHaveBeenCalled();
        expect(component.clearPageToken).toHaveBeenCalled();
        expect(component.getPlaylistItems).toHaveBeenCalledWith('playlist_id_stub');

        field.value = 'diff_playlist_id_stub';
        field.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.getPlaylistItems).toHaveBeenCalledTimes(1);
        button.click();
        expect(component.getPlaylistItems).toHaveBeenCalledWith('diff_playlist_id_stub');
      });

      it('calls methods when playlist ID form is selected and Enter key is pressed', () => {
        fixture.detectChanges();

        let secondRow = toolbarRows[1];
        let secondRowForm = secondRow.querySelector('mat-form-field');
        let secondRowInput = secondRowForm.querySelector('input');
        let newPlaylistId = 'test';
        spyOn(component, 'clearErrors');
        spyOn(component, 'clearPageToken');
        spyOn(component, 'getPlaylistItems');

        secondRowInput.value = newPlaylistId;
        secondRowForm.dispatchEvent(new KeyboardEvent('keyup', { 'key': 'Enter' }));
        expect(component.clearErrors).toHaveBeenCalled();
        expect(component.clearPageToken).toHaveBeenCalled();
        expect(component.getPlaylistItems).toHaveBeenCalledWith('test');
        expect(secondRowInput.value).toEqual('');
      });
    });

    describe('id=ytComponentErrorCard:', () => {
      let getErrorCard = function(): Element {
        return rootElement.querySelector('#ytComponentErrorCard');
      }

      it('only exists if error and errorSolution exist', () => {
        component.error = undefined;
        component.errorSolution = undefined;
        fixture.detectChanges();
        expect(getErrorCard()).toBeFalsy();

        component.error = 'error';
        component.errorSolution = 'solution';
        fixture.detectChanges();
        expect(getErrorCard()).toBeTruthy();

        component.error = undefined;
        component.errorSolution = undefined;
        fixture.detectChanges();
        expect(getErrorCard()).toBeFalsy();
      });

      it('contains header', () => {
        component.error = 'error';
        component.errorSolution = 'solution';
        fixture.detectChanges();

        let header: Element = getErrorCard().querySelector('mat-card-header');
        expect(header.innerHTML.toLowerCase()).toContain('error');
      });

      it('contains content with error and error solution', () => {
        component.error = 'error';
        component.errorSolution = 'solution';
        fixture.detectChanges();

        let content: Element = getErrorCard().querySelector('mat-card-content');
        expect(content.innerHTML.toLowerCase()).toContain(component.error);
        expect(content.innerHTML.toLowerCase()).toContain(component.errorSolution);

        component.error = 'different error this time';
        component.errorSolution = 'different solution this time';
        fixture.detectChanges();

        expect(content.innerHTML.toLowerCase()).toContain(component.error);
        expect(content.innerHTML.toLowerCase()).toContain(component.errorSolution);

        component.error = '213asdfsa!@#$#%^$%*';
        component.errorSolution = '(*^%$#@$%^hgfgh87654)';
        fixture.detectChanges();

        expect(content.innerHTML.toLowerCase()).toContain(component.error);
        expect(content.innerHTML.toLowerCase()).toContain(component.errorSolution);
      });
    });

    describe('id=mainYtComponentCard:', () => {
      let mainCard: Element;

      beforeEach(() => {
        mainCard = rootElement.querySelector('#mainYtComponentCard');
      })

      it('contains header with total results if playlistItems exists', () => {
        fixture.detectChanges();
        expect(mainCard.querySelector('mat-card-header')).toBeFalsy();
        component.playlistItems = [Object.assign({}, ytServiceFake.fixedFakePlaylistItem)];
        component.playlistItemListResponse = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
        component.playlistItemListResponse.pageInfo.totalResults = 70;
        fixture.detectChanges();
        expect(mainCard.querySelector('mat-card-header')).toBeTruthy();
        expect(mainCard.querySelector('mat-card-header').innerHTML.toLocaleLowerCase()).toContain(
          ('total results: ' + component.playlistItemListResponse.pageInfo.totalResults).toLocaleLowerCase()
        );
      });

      describe('mat-card-content:', () => {
        let content: Element;

        beforeEach(() => {
          content = mainCard.querySelector('mat-card-content');
        });

        it('exists', () => {
          expect(content).toBeTruthy();
          expect(content.innerHTML).toContain(
            'You can paste a YouTube playlist ID (or any URL that contains a playlist ID) above to display the contents of the playlist. From here, you can choose to watch the playlist immediately or view/edit the details of a video.'
          );
        });

        describe('id=videoListContainer:', () => {
          let getVideoListContainer = function(): Element {
            return content.querySelector('#videoListContainer');
          };

          it('only exists if a playlist exists and its length is > 0', () => {
            fixture.detectChanges();
            expect(getVideoListContainer()).toBeFalsy();

            component.playlistItems = [Object.assign({}, ytServiceFake.fixedFakePlaylistItem)];
            component.playlistItemListResponse = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
            fixture.detectChanges();
            expect(getVideoListContainer()).toBeTruthy();

            component.playlistItems = new Array<PlaylistItem>(0);
            fixture.detectChanges();
            expect(getVideoListContainer()).toBeFalsy();
          });

          it('contains Play and Delete Selected Videos buttons', () => {
            component.playlistItems = [Object.assign({}, ytServiceFake.fixedFakePlaylistItem)];
            component.playlistItemListResponse = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
            component.playlistListResponse = Object.assign({}, ytServiceFake.fixedFakePlaylistListResponse);
            component.currentPlaylist = Object.assign({}, ytServiceFake.fixedFakePlaylist);
            fixture.detectChanges();

            let container = getVideoListContainer();
            let playLink = container.querySelector('a');
            let buttons = container.querySelectorAll('button');
            let playButton = buttons[0];
            let deleteButton = buttons[1];

            expect(playLink.href).toContain('/play/' + component.currentPlaylist.id);
            expect(playButton.innerHTML).toContain('\u25BA');
            expect(deleteButton.innerHTML).toContain('DELETE SELECTED VIDEOS');
          });

          it('disables Play button if current playlist is private', () => {
            component.playlistItems = [Object.assign({}, ytServiceFake.fixedFakePlaylistItem)];
            component.playlistItemListResponse = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
            component.playlistListResponse = Object.assign({}, ytServiceFake.fixedFakePlaylistListResponse);
            component.currentPlaylist = Object.assign({}, ytServiceFake.fixedFakePlaylist);
            component.currentPlaylist.status.privacyStatus = 'private';
            fixture.detectChanges();

            let container = getVideoListContainer();
            let buttonTooltip = container.querySelector('span');
            let playButton = container.querySelectorAll('button')[0];

            expect(buttonTooltip.getAttribute('matTooltip')).toContain('You can\'t watch private playlists');
            expect(playButton.disabled).toBeTruthy();
          });

          it('contains a list of the videos in the playlist', () => {
            component.playlistItems = new Array<PlaylistItem>(50); 
            component.playlistItems.fill(Object.assign({}, ytServiceFake.fixedFakePlaylistItem));
            component.playlistItemListResponse = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
            fixture.detectChanges();
            let container = getVideoListContainer();
            let list: Element = container.querySelector('mat-list');
            expect(list.children.length).toBe(component.playlistItems.length);

            component.playlistItems = new Array<PlaylistItem>(15); 
            component.playlistItems.fill(Object.assign({}, ytServiceFake.fixedFakePlaylistItem));
            fixture.detectChanges();
            container = getVideoListContainer();
            list = container.querySelector('mat-list');
            expect(list.children.length).toBe(component.playlistItems.length);

            component.playlistItems = new Array<PlaylistItem>(1); 
            component.playlistItems.fill(Object.assign({}, ytServiceFake.fixedFakePlaylistItem));
            fixture.detectChanges();
            container = getVideoListContainer();
            list = container.querySelector('mat-list');
            expect(list.children.length).toBe(component.playlistItems.length);
          });

          describe('individual playlist item:', () => {
            it('contains checkbox to toggle delete status', () => {
              spyOn(component, 'toggleToDelete');
              expect(component.toggleToDelete).not.toHaveBeenCalled();
              component.playlistItems = new Array<PlaylistItem>(50);
              component.playlistItems.fill(Object.assign({}, ytServiceFake.fixedFakePlaylistItem));
              component.playlistItemListResponse = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);

              fixture.detectChanges();

              let children: HTMLCollection = getVideoListContainer().querySelector('mat-list').children;
              let checkbox: HTMLElement;
              let indexesToCheckAt: number[] = [0, 49, 25];
              indexesToCheckAt.forEach((index: number) => {
                checkbox = children[index].querySelector('mat-checkbox') as HTMLElement;
                expect(component.toggleToDelete).not.toHaveBeenCalledWith(index);
                checkbox.click();
                expect(component.toggleToDelete).toHaveBeenCalledWith(index);
              });
            });

            it('clears errors and calls deletePlaylistItems when Delete button is clicked', () => {
              component.playlistItems = new Array<PlaylistItem>(50);
              component.playlistItems.fill(Object.assign({}, ytServiceFake.fixedFakePlaylistItem));
              component.playlistItemListResponse = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
              component.allowDeleteButtonClick = true;
              fixture.detectChanges();

              let deleteButton = rootElement.querySelectorAll('button')[2];
              spyOn(component, 'clearErrors');
              spyOn(component, 'deletePlaylistItems');

              deleteButton.click();
              fixture.detectChanges();

              expect(component.allowDeleteButtonClick).toBeTruthy();
              expect(component.clearErrors).toHaveBeenCalled();
              expect(component.deletePlaylistItems).toHaveBeenCalled();
            });

            it('contains button and link to video page, along with position and title', () => {
              component.playlistItemListResponse = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
              component.playlistItems = new Array<PlaylistItem>(50);
              for (let i: number = 0; i < component.playlistItems.length; i++) {
                component.playlistItems[i] = new PlaylistItem();
                let current: PlaylistItem = Object.assign(component.playlistItems[i], ytServiceFake.fixedFakePlaylistItem);
                current.snippet = Object.assign({}, ytServiceFake.fixedFakePlaylistItem.snippet);
                current.id = i.toString();
                current.snippet.position = i;
                current.snippet.title = 'title' + i.toString();
              }

              fixture.detectChanges();

              let children: HTMLCollection = getVideoListContainer().querySelector('mat-list').children;
              for(let i = 0; i < component.playlistItems.length; i++) {
                let anchor: HTMLElement = children[i].querySelector('a') as HTMLElement;
                expect(anchor.getAttribute('href')).toContain(`/video/${component.playlistItems[i].id}`);
                expect(anchor.querySelector('button').innerHTML.toLocaleLowerCase()).toContain("view/edit");
                expect(children[i].innerHTML).toContain(component.playlistItems[i].snippet.title);
                expect(children[i].innerHTML).toContain(component.playlistItems[i].snippet.position.toString());
              }
            });
          });
        });

        describe('id=videoListFooter:', () => {
          let getVideoListFooter = function(): Element {
            return content.querySelector('#videoListFooter');
          };

          it('only exists if playlistItems exists', () => {
            component.playlistItems = undefined;
            fixture.detectChanges();
            expect(getVideoListFooter()).toBeFalsy();

            component.playlistItems = [Object.assign({}, ytServiceFake.fixedFakePlaylistItem)];
            component.playlistItemListResponse = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
            fixture.detectChanges();
            expect(getVideoListFooter()).toBeTruthy();

            component.playlistItems = undefined;
            fixture.detectChanges();
            expect(getVideoListFooter()).toBeFalsy();
          });

          it('contains some instructions', () => {
            component.playlistItems = [Object.assign({}, ytServiceFake.fixedFakePlaylistItem)];
            component.playlistItemListResponse = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
            fixture.detectChanges();
            expect(getVideoListFooter().innerHTML).toContain(
              'If you\'re signed-in, you can also add a video to the playlist by pasting a YouTube video ID (or any URL that contains a video ID) in the box at the bottom or delete videos by checking the boxes next to the videos you want to delete before clicking "Delete Selected Videos".'
            );
          });

          it('contains field for video id and button to add video', () => {
            component.playlistItems = [Object.assign({}, ytServiceFake.fixedFakePlaylistItem)];
            component.playlistItemListResponse = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
            fixture.detectChanges();

            let addVideoButton: HTMLButtonElement = getVideoListFooter().querySelectorAll('button')[2];
            let addVideoInput: HTMLInputElement = getVideoListFooter().querySelector('input'); 
            expect(addVideoInput.getAttribute('placeholder').toLowerCase()).toContain('video id');
            expect(addVideoButton.innerHTML.toLowerCase()).toContain('add video');

            spyOn(component, 'clearErrors');
            spyOn(component, 'addPlaylistItem');
            addVideoInput.value = 'video_id_stub';
            addVideoInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            addVideoButton.click();
            expect(component.clearErrors).toHaveBeenCalled();
            expect(component.addPlaylistItem).toHaveBeenCalledWith('video_id_stub');

            addVideoInput.value = 'diff_video_id_stub';
            addVideoInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            addVideoButton.click();
            expect(component.addPlaylistItem).toHaveBeenCalledWith('diff_video_id_stub');
          });

          it('calls methods and clears input field when video ID form is selected and Enter key is pressed', () => {
            component.playlistItemListResponse = ytServiceFake.fixedFakePlaylistItemListResponse;
            component.playlistItems = component.playlistItemListResponse.items;
            fixture.detectChanges();

            let playlistCardContent = rootElement.querySelector('mat-card').querySelector('mat-card-content');
            let playlistCardContentForm = playlistCardContent.querySelector('mat-form-field');
            let playlistCardContentInput = playlistCardContentForm.querySelector('input');
            let newVideoId = 'test';
            spyOn(component, 'clearErrors');
            spyOn(component, 'addPlaylistItem');

            playlistCardContentInput.value = newVideoId;
            playlistCardContentForm.dispatchEvent(new KeyboardEvent('keyup', { 'key': 'Enter' }));
            expect(component.clearErrors).toHaveBeenCalled();
            expect(component.addPlaylistItem).toHaveBeenCalledWith(newVideoId);
            expect(playlistCardContentInput.value).toEqual('');
          });

          describe('next page button:', () => {
            let nextPageButton: HTMLButtonElement;

            beforeEach(() => {
              component.playlistItems = [Object.assign({}, ytServiceFake.fixedFakePlaylistItem)];
              component.playlistItemListResponse = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
              fixture.detectChanges();
              nextPageButton = getVideoListFooter().querySelectorAll('button').item(1);
            });

            it('calls toNextPage when clicked, if nextPageToken exists & allowPageChangeButtonClick is true', () => {
              expect(nextPageButton.innerHTML.toLowerCase()).toContain('next page');
              spyOn(component, 'toNextPage');

              nextPageButton.click();
              expect(component.toNextPage).not.toHaveBeenCalled();

              component.allowPageChangeButtonClick = true;
              fixture.detectChanges();
              nextPageButton.click();
              expect(component.toNextPage).not.toHaveBeenCalled();

              component.allowPageChangeButtonClick = false;
              component.playlistItemListResponse.nextPageToken = 'next_page_token';
              fixture.detectChanges();
              nextPageButton.click();
              expect(component.toNextPage).not.toHaveBeenCalled();

              component.allowPageChangeButtonClick = true;
              fixture.detectChanges();
              nextPageButton.click();
              expect(component.toNextPage).toHaveBeenCalled(); 
            });
          });

          describe('prev page button:', () => {
            let prevPageButton: HTMLButtonElement;
            
            beforeEach(() => {
              component.playlistItems = [Object.assign({}, ytServiceFake.fixedFakePlaylistItem)];
              component.playlistItemListResponse = Object.assign({}, ytServiceFake.fixedFakePlaylistItemListResponse);
              fixture.detectChanges();
              prevPageButton = getVideoListFooter().querySelectorAll('button').item(0);
            });

            it('calls toPrevPage when clicked, if prevPageToken exists & allowPageChangeButtonClick is true', () => {
              expect(prevPageButton.innerHTML.toLowerCase()).toContain('previous page');
              spyOn(component, 'toPrevPage');

              prevPageButton.click();
              expect(component.toPrevPage).not.toHaveBeenCalled();

              component.allowPageChangeButtonClick = true;
              fixture.detectChanges();
              prevPageButton.click();
              expect(component.toPrevPage).not.toHaveBeenCalled();

              component.allowPageChangeButtonClick = false;
              component.playlistItemListResponse.prevPageToken = 'prev_page_token';
              fixture.detectChanges();
              prevPageButton.click();
              expect(component.toPrevPage).not.toHaveBeenCalled();

              component.allowPageChangeButtonClick = true;
              fixture.detectChanges();
              prevPageButton.click();
              expect(component.toPrevPage).toHaveBeenCalled();
            });
          });
        });
      });
    });
  });
});
