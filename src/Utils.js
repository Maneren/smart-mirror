import request from 'request-promise-native';

class Array {
  static swap (arr, a, b) {
    const temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
  }

  static shuffle (arr) {
    console.log('shuffle');
    for (let i = 0; i < arr.length * 2; i++) {
      const a = Array.randomIndex(arr);
      const b = Array.randomIndex(arr);
      Array.swap(arr, a, b);
    }
    return arr;
  }

  static randomIndex (arr) {
    return Math.floor(Math.random() * arr.length);
  }
}
class Network {
  static requestWithProxy (url, options) {
    return request(`http://127.0.0.1:3100/${url}`, options);
  }
}

const Utils = { Network, Array };
export default Utils;
