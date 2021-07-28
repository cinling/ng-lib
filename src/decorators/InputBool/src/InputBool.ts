
import { coerceBooleanProperty } from '@angular/cdk/coercion';


export function toBool(value: boolean | string): boolean {
  return coerceBooleanProperty(value);
}

function propDecoratorFactory<T, D>(name: string, fallback: (v: T) => D): (target: any, propName: string) => void {
  function propDecorator(target: any, propName: string, originalDescriptor?: TypedPropertyDescriptor<any>): any {
    const privatePropName = `$$__${propName}`;

    if (Object.prototype.hasOwnProperty.call(target, privatePropName)) {
      console.warn(`The prop "${privatePropName}" is already exist, it will be overrided by ${name} decorator.`);
    }

    Object.defineProperty(target, privatePropName, {
      configurable: true,
      writable: true
    });

    return {
      get(): string {
        // get 雷同于Setter解释
        return originalDescriptor && originalDescriptor.get
          ? originalDescriptor.get.bind(this)()
          : this[privatePropName];
      },
      set(value: T): void {
        // 首先判断修饰器下是否存在Setter，setter存在于originalDescriptor中，我们将先进行规定的format
        // 然后将format值传入其中，调用set 方法继续按照开发者的要求执行
        // 所以如下一个使用的执行顺序是:
        // @Input @InputBoolean set value(v){ this._v = v }
        //  1.调用Object.defineProperty对target上的$$__value进行监听，创建setter + getter
        //  2.setter（内） 触发 ,对传入的值进行格式化(即：调用传入的fallback(v))，拿到格式化的值后format_v
        //  3.调用originalDescriptor 中的setter（外：即开发者创建）方法，传入格式化的值format_v进行做后续处理
        // 因此此处只会对传入的值进行格式化，不会做任何操作。
        if (originalDescriptor && originalDescriptor.set) {
          originalDescriptor.set.bind(this)(fallback(value));
        }
        this[privatePropName] = fallback(value);
      }
    };
  }

  return propDecorator;
}

export function InputBool(): any {
  return propDecoratorFactory('InputBool', toBool);
}
