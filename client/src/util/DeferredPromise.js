/**
 * Class for easily creating a promise for use with
 * callback code.
 *
 * Usage:
 *
 * let deferred = new DeferredPromise():
 * someWorkWithCallback(
 *  result => deferred.resolve(result),
 *  err => deferred.reject(err)
 * )
 *
 * return deferred.promise;
 */
class DeferredPromise {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}

export default DeferredPromise;
