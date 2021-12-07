/**
 * This file contains some generic utilities
 */

/**
 * Convert a text into a slug (valid for URI construction)
 * @param str the input text
 * @returns {string}
 */
function slugify(str) {
  // modified from https://gist.githubusercontent.com/codeguy/6684588/raw/f2fb4c43a2834717939ecc986484b645e8250443/slugify.js
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to   = "aaaaeeeeiiiioooouuuunc------";
  for (let i = 0, l = from.length ; i < l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  // modification: allow '.'
  str = str.replace(/[^a-z0-9 \.-]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}

/**
 * Convert a text into a mixed character/hex representation; useful for looking at strange characters in the output...
 * @param str the input text
 * @returns {string}
 */
function convertToMixedHex(str) {
  let hex, i;

  let result = "";
  for (i=0; i< str.length; i++) {
    hex =  str.charCodeAt(i).toString(16);
    result +=  str[i] + " " + ("000"+hex).slice(-4) + "\n";
  }
  return result;
}

module.exports = {
  slugify,
  convertToMixedHex
}