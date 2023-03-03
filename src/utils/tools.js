/**
 * 产生指定长度随机字母数字特殊字符组合（此方法因为生产的字符串中必须包含 
 * 大小写字母、数字和特殊字符，所以最短长度都是4）
 * @param {number} strLength  指定生成字符串的长度
 * @returns {string}
 */
const randomWord = function (strLength) {
  let str = "",
    pos = 0,
    range = strLength,
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      '-', '.', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', ':', '<', '>', '?'],
    numArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    capital = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    minuscule = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    spechars = ['-', '.', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', ':', '<', '>', '?'];
  // 因为要求生产的字符串中必须包含大小写字母、数字和特殊字符，所有把定义 
  // 好的存储大小写字母、数字和特殊字符的数组放到一个数组中，遍历取值
  let arrName = [numArr, capital, minuscule, spechars, arr, arr];
  if (strLength > 6) {
    for (let i = 0; i < (strLength - 6); i++) {
      arrName.push(arr);
    }
  }
  for (let i = 0; i < range; i++) {
    pos = Math.round(Math.random() * (arrName[i].length - 1));
    str += arrName[i][pos];
  }
  return str;
}
/**
 * 随机6到16位，包含大小写字母、数字、特殊字符
 * @param {number} strLength  指定生成字符串的长度
 * @returns {string}
*/
function randomPassword(length) {
  length = Number(length)
  // Limit length
  if (length < 6) {
    length = 6
  } else if (length > 16) {
    length = 16
  }
  let passwordArray = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890', '!@#$%&*()'];
  let password = [];
  let n = 0;
  for (let i = 0; i < length; i++) {
    // If password length less than 9, all value random
    if ( password.length < (length - 4) ) {
      // Get random passwordArray index
      let arrayRandom = Math.floor(Math.random() * 4);
      // Get password array value
      let passwordItem = passwordArray[arrayRandom];
      // Get password array value random index
      // Get random real value
      let item = passwordItem[Math.floor(Math.random() * passwordItem.length)];
      password.push(item);
    } else {
      // If password large then 9, lastest 4 password will push in according to the random password index
      // Get the array values sequentially
      let newItem = passwordArray[n];
      let lastItem = newItem[Math.floor(Math.random() * newItem.length)];
      // Get array splice index
      let spliceIndex = Math.floor(Math.random() * password.length);
      password.splice(spliceIndex, 0, lastItem);
      n++
    }
  }
  return password.join("");
}
/**
 * 随机生成两个数之间的数字
 * @param {number,number} 
 * @returns {number}
 **/
function randomBetweenNumber(min, max){
  return min + Math.floor(Math.random() * (max - min + 1));
}
export {
  randomWord,
  randomPassword,
  randomBetweenNumber
}