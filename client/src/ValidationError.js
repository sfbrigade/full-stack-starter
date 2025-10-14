import { capitalize } from 'inflection';

class ValidationError extends Error {
  constructor (data) {
    super();
    this.data = {};
    for (const error of data.errors) {
      this.data[error.path] ||= new Set();
      this.data[error.path].add(error.message);
    }
    for (const key of Object.keys(this.data)) {
      this.data[key] = capitalize([...this.data[key]].join(', '));
    }
  }
}

export default ValidationError;
