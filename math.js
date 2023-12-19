exports.add = (a, b) => a + b;
exports.substract = (a, b) => a - b;
exports.multiply = (a, b) => a * b;
exports.divide = (a, b) => a / b;

console.log("helloo");

function rangeOfNumbers(startNum, endNum) {
  if (endNum < startNum) {
    return [];
  } else {
    const arr = rangeOfNumbers(startNum, endNum - 1);
    arr.push(endNum);
    return arr;
  }
}

console.log(rangeOfNumbers(89, 89));

//module.exports = { add, substract, multiply, divide };
