// ExpressJs -ын Error -оос удамшуулж авч байна.
class MyError extends Error {
  constructor(message, statusCode) {
    super(message);
    console.log("MyError.js");
    this.statusCode = statusCode;
  }
}

module.exports = MyError;
