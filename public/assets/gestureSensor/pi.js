function addSeparator (num, sep = ' ') {
  num += '';
  const isDecimal = num.indexOf('.');
  num = num.split('.');
  const integer = num[0].split('');
  for (let i = integer.length - 1, n = 1; i >= 0; i--, n++) {
    if (n % 3 === 0) integer.splice(i, 0, sep);
  }
  if (isDecimal !== -1) {
    const decimals = num[1].split('');
    for (let i = 1, n = 1; i < decimals.length; i++, n++) {
      if (n % 3 === 0) {
        decimals.splice(i, 0, sep);
        i++;
      }
    }
    return integer.join('') + '.' + decimals.join('');
  }

  return integer.join('');
}

const pi = (piApprox = 1, i = 1) => {
  const approxPerCycle = 110410182;
  for (let n = 0; n < approxPerCycle; n++, i++) {
    piApprox += ((-1) ** i) / (2 * i + 1);
  }
  const timeDelta = (Date.now() - lastTime) * 1000;
  lastTime = Date.now();
  console.clear();
  console.log(`PI is approximately: ${(piApprox * 4).toFixed(20).replace(/\.?0+$/, '')}\n` +
  `Difference from library: ${(piApprox * 4 - Math.PI).toFixed(20).replace(/\.?0+$/, '')}\n` +
  `Approximations done: ${addSeparator(i - 1)}\n` +
  `Speed: ${((i - iNow) / timeDelta).toFixed(2)} ops/s\n` +
  `Elapsed time: ${((Date.now() - start) / 1000).toFixed(1)} s\n`);

  iNow = i;

  pi(piApprox, i);
};

const start = Date.now();
let lastTime = start;
let iNow = 0;

pi();
