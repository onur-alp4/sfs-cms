function slashReplacer(str, isReverse) {
  var newStr = isReverse
    ? str.replace(/__-__/g, "/")
    : str.replace(/[/]/g, "__-__");
  return newStr;
}

export {slashReplacer}