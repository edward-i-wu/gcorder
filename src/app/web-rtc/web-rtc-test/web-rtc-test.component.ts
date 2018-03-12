import {
  AfterViewChecked, ApplicationRef, Component, ElementRef, NgZone, OnChanges, OnInit,
  ViewChild
} from '@angular/core';
import {UserMediaService} from '../services/user-media.service';
import {PcmDataService} from '../services/pcm-data.service';
import {Mp3BlobService} from '../services/mp3-blob.service';
import {Observable} from 'rxjs/Observable';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {GdriveUploadService} from '../services/gdrive-upload.service';
import {Scheduler} from 'rxjs/Rx';
import {ISubscription} from 'rxjs/Subscription';
import {GoogleAuthService} from '../../google-oauth/service/google-auth.service';
import {GoogleUserService} from '../../google-oauth/service/google-user.service';

@Component({
  selector: 'app-web-rtc-test',
  templateUrl: './web-rtc-test.component.html',
  styleUrls: ['./web-rtc-test.component.scss']
})
export class WebRtcTestComponent implements OnInit, AfterViewChecked {

  public mp3Url$: Observable<SafeResourceUrl> = Observable.never();

  @ViewChild('playback') playback: ElementRef;
  @ViewChild('playbackSource') playbackSource: ElementRef;
  @ViewChild('playbackSourceStored') playbackSourceStored: ElementRef;
  private prevAudioSrc: String;

  public storedMp3: SafeResourceUrl;
  private accessToken: string;
  public userProfile$: Observable<any>;
  public userProfile;
  public googleAuth$: Observable<any>;
  public googleAuth;
  public paused = true;
  public recording = false;
  private startTime: Date;
  public elapsedTime: Date = new Date(0);
  private timer: Observable<number>;
  private timeControl: ISubscription;


  constructor(private userMedia: UserMediaService,
              private pcmData: PcmDataService,
              private mp3Blob: Mp3BlobService,
              private sanitizer: DomSanitizer,
              private googleAuthService: GoogleAuthService,
              private gdriveUpload: GdriveUploadService,
              private googleUser: GoogleUserService,
              private appRef: ApplicationRef
  ) { }

  ngOnInit() {
    this.gdriveUpload.init();
    this.gdriveUpload.$.subscribe(console.log, console.error);
    this.googleAuth$ = this.googleAuthService.$;
    this.googleAuth$.subscribe(auth => this.googleAuth = auth);
    // this.userProfile$ = this.googleAuthService.$.map(auth => auth.currentUser.get().getBasicProfile());
    // TODO hacking change detection b/c I can't figure out running the auth init in ngZone
    // this.userProfile$.subscribe(userProfile => {
    //   this.userProfile = userProfile;
    //   this.appRef.tick();
    // }, console.error);

    const stored = localStorage.getItem('mp3');
    if (stored) {
      this.storedMp3 = this.sanitizer.bypassSecurityTrustResourceUrl(stored);
      this.playback.nativeElement.load();
    }


    this.userMedia.getUserMedia();

    this.mp3Url$ = this.mp3Blob.$
      .map((blob: Blob) => {
      // TODO put in a function
        const fr = new FileReader();
        fr.onload = (e) => {
          if (e.type === 'load') {
            console.log(fr.result);
            localStorage.setItem('mp3', fr.result);
          }
        };
        fr.readAsDataURL(blob);

        return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
      })
      .do((blob) => console.log(blob), () => console.log('error'), () => console.log('complete'));
  }

  ngAfterViewChecked() {
    if (this.prevAudioSrc !== this.playbackSource.nativeElement.getAttribute('src')) {
      this.prevAudioSrc = this.playbackSource.nativeElement.getAttribute('src');
      this.playback.nativeElement.load();
    }
  }

  start() {
    this.mp3Blob.init();
    this.pcmData.start();
  }

  pause() {
    this.pcmData.pause();
  }

  stop() {
    this.pcmData.stop();
  }

  signOut() {
    // TODO signOut from googleAuthService
    // this.googleUser.signOut();
  }

  initUpload() {
    this.appRef.tick();
  }

  record() {
    this.recording = true;
    if (this.paused) {
      this.start();
      this.startTime = new Date(Date.now() - this.elapsedTime.getTime());
      if (this.elapsedTime.getTime() === new Date(0).getTime()) { // start timer if not started
        this.timer = Observable.interval(0, Scheduler.animationFrame).share();
      }
      this.timeControl = this.timer.subscribe(() => {
        this.elapsedTime = new Date(Date.now() - this.startTime.getTime());
        this.appRef.tick();
      });
    }
    if (!this.paused) {
      this.pause();
      this.timeControl.unsubscribe();
    }
    this.paused = !this.paused;
    // TODO got to figure out ngZone!
    this.appRef.tick();
  }

  stopRecording() {
    this.stop();
    this.recording = false;
    this.paused = true;
    this.timeControl.unsubscribe();
    this.elapsedTime = new Date(0);
  }

}
