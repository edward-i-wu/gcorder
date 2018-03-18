import {Observable} from 'rxjs/Observable';
import {mergeAll, switchMap, zip} from 'rxjs/operators';

// TODO need complete and error functions
export function convertToPcmData(audioContext$: Observable<AudioContext>, bufferSize: number) {
  return (mediaStream$: Observable<MediaStream>) => {
    const createPCMStream = zip(audioContext$, (mediaStream: MediaStream, audioContext: AudioContext) => {
      return new Observable(observer => {
        const source = audioContext.createMediaStreamSource(mediaStream);
        const processor = audioContext.createScriptProcessor(bufferSize);
        // apparently data flows only once there is a destination?
        processor.connect(audioContext.destination);
        // TODO onError?
        processor.onaudioprocess = (event: AudioProcessingEvent) => {
          const float32Data = event.inputBuffer.getChannelData(0);
          const data = _float32toInt16(float32Data);
          observer.next(data);
        };
        source.connect(processor);
      });
    });
    return mediaStream$.pipe(createPCMStream, switchMap((obs: Observable<Int16Array>) => obs));
  };
}

function _float32toInt16(float32: Float32Array): Int16Array {
  const int16 = new Int16Array(float32.length);
  float32.forEach((element, index) => int16[index] = _convert(element));
  return int16;
}

function  _convert(n) {
  // https://stackoverflow.com/questions/25839216/convert-float32array-to-int16array
  // TODO is there a better way to do this? Why are floats always [-1, 1]
  const v = n < 0 ? n * 32768 : n * 32767;       // convert in range [-32768, 32767]
  return Math.max(-32768, Math.min(32768, v)); // clamp
}
