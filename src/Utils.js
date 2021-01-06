import request from 'request-promise-native';

class Array {
  static swap (arr, a, b) {
    const temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
  }

  static shuffle (arr) {
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
class General {
  static randint () {
    if (arguments.length < 1) throw new Error('Missing arguments');
    else if (arguments.length > 2) throw new Error('Too many arguments');
    for (const arg of arguments) {
      if (typeof arg !== 'number' || arg % 1 > 0) throw new TypeError('All arguments must be integers');
    }
    if (arguments.length < 2) return Math.round(Math.random() * arguments[0]);
    else return Math.ceil(Math.random() * (arguments[1] - arguments[0]) + arguments[0]);
  }

  static * range () {
    if (arguments.length < 1) throw new Error('Missing arguments');
    else if (arguments.length > 3) throw new Error('Too many arguments');
    for (const arg of arguments) {
      if (typeof arg !== 'number' || arg % 1 > 0) throw new TypeError('All arguments must be integers');
    }
    if (arguments.length === 1) {
      const [max] = arguments;
      for (let i = 0; i < max; i++) yield i;
    } else if (arguments.length === 2) {
      const [min, max] = arguments;
      for (let i = min; i < max; i++) yield i;
    } else if (arguments.length === 3) {
      const [min, max, step] = arguments;
      for (let i = min; i < max; i += step) yield i;
    }
  }

  static mapRng (range, fn) {
    const result = [];
    let i = 0;
    for (const el of range) {
      result.push(fn(el, i));
      i++;
    }
    return result;
  }

  static reduceRng (range, fn, total = 0) {
    let i = 0;
    for (const el of range) {
      total = fn(total, el, i);
      i++;
    }
    return total;
  }
}
class Network {
  static requestWithProxy (url, options) {
    return request(`http://127.0.0.1:3100/${url}`, options);
  }
}

const Utils = { Network, Array, General };
export default Utils;
