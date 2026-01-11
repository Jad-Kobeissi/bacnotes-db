export function isEmpty(arr: string[]) {
  for (let i in arr) {
    if (arr[i].trim() == "") {
      return true;
    }
  }
  return false;
}
