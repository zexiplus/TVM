import Dep from "./dep";

class Observer {
  constructor(data, vm) {
    this.observer(data);
    this.vm = vm;
  }

  observer(data) {
    // 递归的终止条件： 当观察数据不存在或不再是对象是停止
    if (!data || typeof data !== "object") {
      return;
    }
    Object.keys(data).forEach(key => {
      // 递归调用自身， 遍历对象上的所有属性都为响应式的
      this.observer(data[key]);
      this.setReactive(data, key);
    });
  }
  // 响应式  对数据的修改会触发相应的功能
  setReactive(obj, key) {
    let value = obj[key];
    let _this = this;
    let dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 依赖收集 进行订阅, 在编译阶段， compiler会给template中的每个指令增加一个watcher， Dep.target 为一个watcher
        Dep.target && dep.addSubs(Dep.target);

        return value;
      },
      set(newValue) {
        if (newValue !== obj[key]) {
          // 对新值继续劫持
          _this.observer(newValue);
          // 用新值替换旧值
          _this.vm.callHook("beforeUpdate");
          value = newValue;
          // 发布通知
          dep.notify();
          _this.vm.callHook("updated");
          // update
        }
      }
    });
  }
}

export default Observer;
