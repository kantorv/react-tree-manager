
// https://stackoverflow.com/a/2117523/592737

//const crypto = require("crypto"); //for jest.. TODO: fix it


export const  uuidv4 = ()=> { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}



// export const uuidv44 = () =>
//   '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
//     (
//       c ^
//       (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
//     ).toString(16)
//   ) as string;

export const bytesToSize = (bytes: number, decimals = 2) => {
  if (!Number(bytes)) {
    return '0 Bytes';
  }

  const kbToBytes = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const index = Math.floor(Math.log(bytes) / Math.log(kbToBytes));

  return `${parseFloat(
    (bytes / kbToBytes ** index).toFixed(dm)
  )} ${sizes[index]}`;
};

function getFilePathWithoutFilename(fullPath: string): string {
  const regex = /(.*\/)[^\/]+$/;
  const match = regex.exec(fullPath);
  return match ? match[1] : '/';
}


export { getFilePathWithoutFilename };
