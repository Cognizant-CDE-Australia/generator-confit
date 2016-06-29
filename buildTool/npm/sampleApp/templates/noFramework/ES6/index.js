'use strict';

const MAX = 10;

let getMaxPlus = x => MAX + x;

function hello(name) {
  return `hello ${name}`;
}

module.exports = {
  hello,
  getMaxPlus
};
