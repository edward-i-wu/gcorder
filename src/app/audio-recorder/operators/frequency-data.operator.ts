// init() {
//   const pipe = new Subject<MediaStream>();
//
//   this.frequencyData$ = pipe.switchMap((stream: MediaStream) => {
//     const audioCtx = new AudioContext();
//     const source = audioCtx.createMediaStreamSource(stream);
//     const analyser = audioCtx.createAnalyser();
//     source.connect(analyser);
//     analyser.fftSize = 32;
//     const frequencyData = new Uint8Array(analyser.frequencyBinCount);
//
//     return Observable.interval(0, Scheduler.animationFrame)
//       .map(() => {
//         analyser.getByteFrequencyData(frequencyData);
//         return frequencyData.slice();
//       });
//   })
//     .multicast(new Subject())
//     .refCount();
//
//   this.subscription = this.userMedia.$.subscribe(pipe);
//
// }
