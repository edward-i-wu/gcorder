import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {getUserMedia} from './sources/get-user-media.source';
import {convertToPcmData} from './operators/convert-to-pcm-data.operator';
import {createAudioContext} from './sources/create-audio-context.source';
import {mp3Encode} from './operators/mp3-encode.operator';
import {toBlob} from './operators/to-blob.operator';
import {aggregateBlobs} from './operators/aggregate-blobs.operator';
import {share, switchMap, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {ISubscription} from 'rxjs/Subscription';
import {ConnectableObservable} from 'rxjs/Rx';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {environment} from '../../environments/environment';

const mediaConstraints = environment.mediaConstraints;
const pcmDataBufferSize = environment.pcmDataBufferSize;
const driveUploadBufferSize = environment.driveUploadBufferSize;

@Injectable()
export class AudioRecorderService {

  private mediaStreamSwitch$: ReplaySubject<Observable<MediaStream>> = new ReplaySubject(1);
  private pcmDataSwitch$: ReplaySubject<Observable<Int16Array>> = new ReplaySubject(1);

  constructor() { this.init(); }

  get mediaStream$() {
    return this.mediaStreamSwitch$.pipe(switchMap((obs: Observable<MediaStream>) => obs));
  }

  get pcmData$() {
    return this.pcmDataSwitch$.pipe(switchMap((obs: Observable<Int16Array>) => obs));
  }

  createRecordingSession() {
    return new RecordingSession(this.pcmData$);
  }

  public init() {
    const audioContext$ = createAudioContext();

    this.mediaStreamSwitch$.next(getUserMedia(mediaConstraints));

    this.pcmDataSwitch$.next(
      this.mediaStream$.pipe(
        convertToPcmData(audioContext$, pcmDataBufferSize),
        share()
      )
    );
  }

}

export class RecordingSession {

  public mp3Chunk$: Observable<Blob>;
  public mp3Complete$: Observable<Blob>;

  private streamControl: ConnectableObservable<Int16Array>;
  private startStream: ISubscription;
  private endStream: Subject<void> = new Subject<void>();

  constructor(pcmData$: Observable<Int16Array>) {
    this.streamControl = pcmData$.publish();
    this.mp3Chunk$ = this.streamControl.pipe(
      takeUntil(this.endStream),
      mp3Encode(), // TODO encoder should be bundled with pcmData$. Need to figure out how to have pcmData$ initialize only after subscription
      share(),
      toBlob(driveUploadBufferSize)
    );
    this.mp3Complete$ = this.mp3Chunk$.pipe(
      aggregateBlobs('audio/mp3')
    );
  }

  start() {
    this.startStream = this.streamControl.connect();
  }

  pause() {
    if (this.startStream !== null) {
      this.startStream.unsubscribe();
    }
  }

  stop() {
    this.endStream.next();
    this.startStream.unsubscribe();
  }

}
