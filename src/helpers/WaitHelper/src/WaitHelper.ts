import {Observable, Subscriber} from "rxjs";

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
    static waitPromise(ms: number): Promise<void> {
        return WaitHelper.wait(ms).toPromise()
    }
}