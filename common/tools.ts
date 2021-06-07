
export const base64 = (buffer: ArrayBuffer) => btoa(
  new Uint8Array(buffer)
    .reduce((data, byte) => data + String.fromCharCode(byte), ''),
);

const pad2 = (num) => {
  const numString = `${num}`;
  return numString.length < 2 ? `0${numString}` : numString;
};
