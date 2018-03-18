import {
  AfterViewChecked, ApplicationRef, Component, ElementRef, NgZone, OnChanges, OnInit,
  ViewChild
} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Scheduler} from 'rxjs/Rx';
import {ISubscription} from 'rxjs/Subscription';
import {GoogleAuthService} from '../../google-oauth/service/google-auth.service';
import {AudioRecorderService, RecordingSession} from '../../audio-recorder/audio-recorder.service';
import {ResumeableUploadService} from '../../google-drive/resumeable-upload.service';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss']
})
export class RecorderComponent implements OnInit, AfterViewChecked {

  public mp3Url$: Observable<SafeResourceUrl> = Observable.never();

  @ViewChild('playback') playback: ElementRef;
  @ViewChild('playbackSource') playbackSource: ElementRef;
  @ViewChild('playbackSourceStored') playbackSourceStored: ElementRef;
  private prevAudioSrc: String;

  public storedMp3: SafeResourceUrl;
  private accessToken$: Observable<string>;

  private recordingSession: RecordingSession;

  public paused = true;
  public recording = false;
  private startTime: Date;
  public elapsedTime: Date = new Date(0);
  private timer: Observable<number>;
  private timeControl: ISubscription;


  constructor(private sanitizer: DomSanitizer,
              private googleAuthService: GoogleAuthService,
              private resumeableUpload: ResumeableUploadService,
              private audioRecorder: AudioRecorderService,
              private appRef: ApplicationRef
  ) { }

  ngOnInit() {
    const stored = localStorage.getItem('mp3');
    if (stored) {
      this.storedMp3 = this.sanitizer.bypassSecurityTrustResourceUrl(stored);
      setTimeout(() => this.playback.nativeElement.load(), 0);
    }
    this.accessToken$ = this.googleAuthService.googleUser$.map((user: gapi.auth2.GoogleUser) => {
      return user.getAuthResponse(true).access_token;
    });
  }

  ngAfterViewChecked() {
    if (this.prevAudioSrc !== this.playbackSource.nativeElement.getAttribute('src')) {
      this.prevAudioSrc = this.playbackSource.nativeElement.getAttribute('src');
      this.playback.nativeElement.load();
    }
  }

  getStoredMp3() {
    const stored = localStorage.getItem('mp3');
    if (stored) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(stored);
      // this.playback.nativeElement.load();
    }
  }

  private setMp3$() {
    this.mp3Url$ = this.recordingSession.mp3Complete$
      .map((blob: Blob) => {
        // TODO put in a function
        const fr = new FileReader();
        fr.onload = (e) => {
          if (e.type === 'load') {
            localStorage.setItem('mp3', fr.result);
          }
        };
        fr.readAsDataURL(blob);

        return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
      });
      // .do((blob) => console.log(blob), () => console.log('error'), () => console.log('complete'));
  }

  start() {
    this.recordingSession = this.audioRecorder.createRecordingSession(); // ensure this is stopped before dropping reference
    // this.gdriveUpload.init(this.recordingSession.mp3Chunk$); // make into operator
    // this.gdriveUpload.$.subscribe(); // start upload
    this.resumeableUpload.uploadBinary(this.recordingSession.mp3Chunk$, this.accessToken$).subscribe();
    this.setMp3$();
    this.recordingSession.start();
  }

  pause() {
    this.recordingSession.pause();
  }

  stop() {
    this.recordingSession.stop();
  }


  // ui logic
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
