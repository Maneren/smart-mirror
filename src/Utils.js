class Utils {
  static swap (arr, a, b) {
    const temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
  }

  static shuffle (arr) {
    console.log('shuffle');
    for (let i = 0; i < arr.length * 2; i++) {
      const a = this.randomIndex(arr);
      const b = this.randomIndex(arr);
      this.swap(arr, a, b);
    }
    return arr;
  }

  static randomIndex (arr) {
    return Math.floor(Math.random() * arr.length);
  }
}

export default Utils;
