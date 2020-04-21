// ExpressJs -ын Error -оос удамшуулж авч байна.
class MyError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = MyError;
