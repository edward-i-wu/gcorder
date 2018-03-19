// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  clientId: '<your google drive client id>',
  mediaConstraints: { audio: true }, // passed to getUserMedia
  pcmDataBufferSize: 2048,  // buffer size for pcm data
  driveUploadBufferSize: 256 * 1024 // buffer size for drive upload
};

// you must create an environment.ts file in this directory with these values
