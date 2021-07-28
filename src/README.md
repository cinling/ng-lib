## decorators
 - InputBool

```ts
import {InputBool} from "@cinling/lib/decorators/InputBool";

class DemoCompoent {
    @InputBool()
    readonly: boolean = flase
}
```

```html
<Demo readonly></Demo> <!-- 組件中 readonly = true -->
<Demo></Demo> <!-- 組件中 readonly = false -->
```