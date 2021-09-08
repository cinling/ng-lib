import {Observable, Subscriber} from "rxjs";
import {finalize} from "rxjs/operators";

/**
 * 等待工具
 */
export class WaitHelper {

    /**
     * 等待一定的毫秒数
     * @deprecated
     */
    static waitMS(ms: number = 100): Observable<void> {
        return WaitHelper.wait(ms)
    }

    /**
     * 等待一段时间后再运行
     * @param ms
     */
    static wait(ms: number = 100): Observable<void> {
        const subscribeHandle = (subscriber: Subscriber<void>) => {
            const handle = () => {
                subscriber.next()
                subscriber.complete()
            }
            setTimeout(handle, ms)
        }
        return new Observable<void>(subscribeHandle)
    }

    /**
     * 等待一段时间后再运行
     * @param ms
     */
    static waitPromise(ms: number = 100): Promise<void> {
        return WaitHelper.wait(ms).toPromise()
    }

    /**
     * 等待直至表达式为 true
     * @param boolFunction 表达式方法
     * @param ms 每次判断的等待时长
     */
    static whileTrue(boolFunction: () => boolean, ms: number = 100): Observable<void> {
        const subscriberHandle = (subscriber: Subscriber<void>) => {
            if (boolFunction()) {
                subscriber.next()
                subscriber.complete()
            } else {
                setTimeout(() => {
                    this.whileTrue(boolFunction)
                        .pipe(finalize(() =>
                            subscriber.complete()
                        ))
                        .subscribe(() => subscriber.next())
                }, ms)
            }
        }
        return new Observable<void>(subscriberHandle)
    }

    /**
     * 等待直至表达式为 true
     * @param boolFunction 表达式方法
     * @param ms 每次判断的等待时长
     */
    static whileTruePromise(boolFunction: () => boolean, ms: number = 100): Promise<void> {
        return WaitHelper.whileTrue(boolFunction, ms).toPromise()
    }
}