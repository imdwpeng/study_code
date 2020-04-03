const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class CustomPromise {
    constructor(executor){
        this._status = PENDING;
        this._value = undefined;
        this._resolveQueue = [];
        this._rejectQueue = [];

        let _resolve = (val) => {
            const run = () => {
                if (this._status !== PENDING) return;
                this._status = FULFILLED;
                this._value = val;
    
                while(this._resolveQueue.length){
                    const callback = this._resolveQueue.shift();
                    callback(val);
                }
            }
            setTimeout(run);
        }

        let _reject = (val) => {
            const run = () => {
                if (this._status !== PENDING) return;
                this._status = REJECTED;
                this._value = val;
                
                while(this._rejectQueue.length) {
                    const callback = this._rejectQueue.shift();
                    callback(val);
                }
            }
            setTimeout(run);
        }

        executor(_resolve,_reject);
    }

    then(resolveFn,rejectFn) {
        if ( typeof resolveFn !== 'function' ) {
            resolveFn = value => value;
        }
        if (typeof rejectFn !== 'function' ) {
            rejectFn = error => {
                throw new Error(error instanceof Error ? error.message : error);
            }
        }

        return new CustomPromise((resolve, reject) => {
            const fulfilledFn = value => {
                try {
                    let x = resolveFn(value);
                    x instanceof CustomPromise ? x.then(resolve, reject) : resolve(x);
                } catch (error) {
                    reject(error);
                }
            }

            const rejectedFn = error => {
                try {
                    let x = rejectFn(error);
                    x instanceof CustomPromise ? x.then(resolve, reject) : resolve(x);
                } catch (error) {
                    reject(error);
                }
            }

            switch (this._status) {
                case PENDING:
                    this._resolveQueue.push(fulfilledFn);
                    this._rejectQueue.push(rejectedFn);
                    break;
                case FULFILLED:
                    fulfilledFn(this._value);
                    break;
                case REJECTED:
                    rejectedFn(this._value);
                    break;
            }
        });
    }
}

var p1 = new CustomPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 1000);
});

p1.then(res => {
    console.log(res)
    return 2;
}).then()
.then(res => {
    console.log(res);
    return new CustomPromise((resolve,reject) => {
        resolve(3);
    })
}).then((res) => {
    console.log(res);
    throw new Error('reject测试');
}).then(()=>{},error => {
    console.log(error);
})