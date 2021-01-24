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

  static generateArr (length, f = _ => undefined) {
    const { range, mapRng } = General;
    return mapRng(range(length), f);
  }

  static toFixedLengthArr (arr, len, f = _ => undefined) {
    return [
      ...arr,
      ...Array.generateArr(len - arr.length, f)
    ];
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
    // for (const el of range) {
    //   result.push(fn(el, i));
    //   i++;
    // }
    // return result;

    while (true) {
      const next = range.next();
      if (next.done) return result;
      result.push(fn(next.value, i));
      i++;
    }
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
    if (process) return request(`${url}`, { origin: 'smart-mirror', ...options });
    return request(`http://127.0.0.1:3100/${url}`, { origin: 'smart-mirror', ...options });
  }

  static decodeURL (url) {
    if (typeof url === 'string') {
      let prefix;
      if (url[4] === ':') prefix = 'http://';
      else if (url[5] === ':') prefix = 'https://';

      url = url.substr(8);

      const [domain, ...target] = url.split('/');
      const [page, params] = target[target.length - 1].split('?');

      const parameters = {};
      params.split('&').forEach(param => {
        const [key, value] = param.split('=');
        parameters[key] = value;
      });

      return {
        prefix,
        domain,
        pages: target,
        page,
        parameters
      };
    }
  }
}

const Utils = { Network, Array, General };
export default Utils;
