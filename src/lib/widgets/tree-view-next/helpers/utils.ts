
// https://stackoverflow.com/a/2117523/592737

const crypto = require("crypto").webcrypto; //for jest.. TODO: fix it






export const uuidv4 = () =>
  '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  ) as string;

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
