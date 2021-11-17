export function shuffle<T>(arr: T[]) {
  let len = arr.length;
  const d = len;
  const array = [];
  let k, i;
  for (i = 0; i < d; i++) {
    k = Math.floor(Math.random() * len);
    array.push(arr[k]);
    arr.splice(k, 1);
    len = arr.length;
  }
  for (i = 0; i < d; i++) {
    arr[i] = array[i];
  }
  return arr;
}
