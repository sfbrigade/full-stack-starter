class UnexpectedError extends Error {
  constructor (error) {
    super('An unexpected error has occurred. Please try again.');
    this.error = error;
  }
}

export default UnexpectedError;
