importScripts('lame.min.js');

const CHANNELS = 1;
const SAMPLE_RATE = 44100;
const KBPS = 128;

class Converter {

    constructor() {
        this.mp3encoder = new lamejs.Mp3Encoder(CHANNELS, SAMPLE_RATE, KBPS);
        postMessage('ready');
    }

    consume(chunk) {
        const mp3buf = this.mp3encoder.encodeBuffer(chunk);
        if (mp3buf.length > 0) {
          postMessage(mp3buf);
        }
    }

    complete() {
        const mp3buf = this.mp3encoder.flush();   //finish writing mp3

        if (mp3buf.length > 0) {
            // why do we need an Int8Array for this call?
            postMessage(new Int8Array(mp3buf));
        }

        postMessage(null);
    }

}

onmessage = ({data}) => {
  if (data === null) {
    converter.complete();
    return;
  }
  converter.consume(data);
};

const converter = new Converter();
