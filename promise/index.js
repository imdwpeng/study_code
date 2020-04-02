class CustomPromise {
    constructor(executor){
        this._resolveQueue = [];
        this._rejectQueue = [];

        let _resolve = (val) => {
            while(this._resolveQueue.length){
                const callback = this._resolveQueue.shift();
                callback(val);
            }
        }

        let _reject = (val) => {
            while(this._rejectQueue.legnth) {
                const callback = this._rejectQueue.shift();
                callback(val);
            }
        }

        executor(_resolve,_reject);
    }

    then(resolveFn,rejectFn) {
        this._resolveQueue.push(resolveFn);
        this._rejectQueue.push(rejectFn);
    }
}

var p1 = new CustomPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('result')
  }, 1000);
})
p1.then(res => console.log(res));