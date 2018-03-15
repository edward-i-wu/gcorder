import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {getUserMedia} from './sources/get-user-media.source';
import {convertToPcmData} from './operators/convert-to-pcm-data.operator';
import {createAudioContext} from './sources/create-audio-context.source';
import {mp3Encode} from './operators/mp3-encode.operator';
import {toBlob} from './operators/to-blob.operator';
import {aggregateBlobs} from './operators/aggregate-blobs.operator';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {ISubscription} from 'rxjs/Subscription';
import {ConnectableObservable} from 'rxjs/Rx';

// TODO fetch from environment?
const mediaConstraints = { audio: true };
const pcmDataBufferSize = 2048;
const blobBufferSize = 256 * 1024;

@Injectable()
export class AudioRecorderService {

  public mediaStream$: Observable<MediaStream>;
  public pcmData$: ConnectableObservable<Int16Array>;
  public mp3Chunk$: Observable<Blob>;
  public mp3Complete$: Observable<Blob>;

  private recordEnd$: Subject<void> = new Subject<void>();
  private recording: ISubscription;

  start() {
    this.recording = this.pcmData$.connect();
  }

  pause() {
    if (this.recording !== null) {
      this.recording.unsubscribe();
    }
  }

  stop() {
    this.recordEnd$.next();
    this.recording.unsubscribe();
  }

  init() {
    const audioContext$ = createAudioContext();

    this.mediaStream$ = getUserMedia(mediaConstraints);

    this.pcmData$ = this.mediaStream$.pipe(
      convertToPcmData(audioContext$, pcmDataBufferSize),
      takeUntil(this.recordEnd$)
    ).multicast(new Subject()); // TODO using patch operator. Need to figure out type error

    this.mp3Chunk$ = this.pcmData$.pipe(
      mp3Encode(),
      toBlob(blobBufferSize)
    );

    this.mp3Complete$ = this.mp3Chunk$.pipe(
      aggregateBlobs('audio/mp3')
    );
  }

}
