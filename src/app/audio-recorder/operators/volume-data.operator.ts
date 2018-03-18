// init() {
//   const pipe = new Subject<Uint8Array>();
//
//   // "volume" strategy is to take the value of the highest bin
//   this.volumeData$ = pipe.map((frequencyData: Uint8Array) => {
//     return frequencyData.reduce((prev, curr) => {
//       return Math.max(prev, curr);
//     });
//   });
//
//   this.subscription = this.frequencyData.$.subscribe(pipe);
// }
