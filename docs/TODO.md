- [ ] useHttp 加入 token 的请求函数 （reactQuery 缓存中获取）
- [ ] 优化点：socket-io centent 携带 userId 作为 io(url) 中的 params，userId 从 reactQuery 缓存中获取，socket-io 移动到 Views/Main
- [ ] error-boundary
- [ ] 消息乐观更新

1. 状态管理思路：
   1. base hook 声明全部状态变量并实现 socket 监听，其他 hook 通过 prop 获取状态和 setter 函数，封装 handle 函数，在相应组件中调用对应 hook 获取 handle 函数。不全部放在一个 hook 里是因为多次调用同一个 hook 函数会重复 socket 监听。
      1. 优点：没有借助全局状态管理，代码实现简单直接
      2. 缺点：对状态的操作需要大量导出再导入 setter 函数，状态操作复杂的话不好实现，代码不够优雅高效
   2. 使用 react-query，通过不同的自定义 hooks 实现 socket 监听、封装函数操作 react-query cache。react-query 是单独的状态存储，hooks 可以直接获取并操作。
      1. 优点：代码量小，容易实现
      2. 缺点：全部状态操作都通过 setter/getter react-query cache 实现，不直观，可读性不好; 由于 hook 中有 socket 监听，这产生了一个限制：不能多次调用同一个 hook 以避免重复的 socket 监听
   3. 使用 useContext 和 useReducer ，声明状态、socket 监听和状态操作都放在 context 里，通过 useReducer 封装调用，不需要自定义 hooks。
      1. 优点：有效避免重复 socket 监听的风险，状态管理简单直观
      2. 缺点：所有内容都放在 context 里，单文件内容膨胀。useContext 需要优化性能避免重复渲染
   4. 尝试 recoil ？
