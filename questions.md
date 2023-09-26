1. What is the difference between Component and PureComponent? Give an example where it might break my app.
    1. A regular component can have the lifecycle method shouldComponentUpdate, where the developer needs to define the logic for when the component should update. This is required, because sometimes even if the parent update the child props, it may not require a new rendering.
    2. A pure component is a class based component which internally manage the shouldComponentUpdate in a shallow manner.
    3. A pure component should only be used if the component is dealing with primitive and simple props. Otherwise, since it's shallowing compares the props, if some prop of an object changes in the parent, the child won't detect the change, because it only compares oldProp === newProp, instead of deeply analysing the entire object's props. 
    4. An example could be a UserComments component, which has the object userComponent = {id, author, message}. if the user modify his comment with an edit (message), then the pure component won't notice the change.

2. Context + ShouldComponentUpdate might be dangerous. Why is that?
    1. Because if the context changes every component which is consuming it, will trigger a rendering, even if it doesn't require, because maybe the componentA uses just a portion of that context. This can generate performance issues caused by the multiple re-rendering
3. Describe 3 ways to pass information from a component to its PARENT.
    1. using callbacks functions props. The parent passes to the child a function and the child can communicate with the parent by calling back the same function with the updated argument
    2. using object props passed to the child. The child can modify the object and, since it's not a primitive type, it will actually write in the original memory address of the object, so the parent will have the updated values.
    3. using a context. A context is a "global state" and every component that want to communicate inside it, has to consuming it in order to send or receive information to and from the others.
4. Give 2 ways to prevent components from re-rendering.
    1. using a well written shouldComponentUpdate for class-based components or use React.memo for functional components.
    2. using proper keys, if array or maps are involved. 
5. What is a fragment and why do we need it? Give an example where it might break my app
   1. a fragment is a react way that makes you able to group multiple portion of code without using a DOM node, such a div or a span.
   2. in the actual html of the rendered page the fragment doesn't exist, so it may be in the same level of the father. That could lead in some style issues
6. Give 3 examples of the HOC pattern.
   1. a HOC pattern is a way to make a component capable to receive another component as a prop, wrap it and doing something with it, such add information to it's state, logging, etc. Some example of HOC componets could be:
      1. a logging component: logs the wrapped lifecycle or any required information
      2. a gateway component: check if the component can do something and can redirect it otherwise. For example a component which check if a page could be reached if the user is logged. If the user tries to reach it, the HOC before redirect the user to the page, should check if he's logged, redirect him to the login page if he is not.
      3. the "connect" hook from Redux is a HOC that connect the component to the store (or slices)
7. What's the difference in handling exceptions in promises, callbacks and async…await?
   1. promises: method().catch((e) console.error(e)). The method must return a promise.
   2. callbacks: method((callBackSuccess, callBackError)). The method should call the function callBackError in case of something went wrong. it could be a void without any return. The parent has to declare its own function callBackError and manage it there
   3. async...await: wrapping the method in a try-catch block and check if there is an error in the catch
8. How many arguments does setState take and why is it async
   1. the setState has two arguments:
      1. the first argument can be an object or a function. if it's an object then it will shallow-merged to the state. if it's a function, the arguments will be the prevState and the prevProps and you have to return the updated state. This is the best solution, because since the setState is async, you don't know if this.state has been already updated from another method, however by having the prevState, you can be sure that is the most recent one
      2. the second argument is a callback function, triggered once the state is updated.
9. List the steps needed to migrate a Class to Function Component.
   1. change the declaration of the component, from class Component extends React.Component to export const Component = (params)
   2. change the render method. from render() { return (<div></div>) } to return (<div></div>)
   3. change the state. from declaring the state like an object this.state = {prop: value} to using useState's hook: const [value, setValue] = useState(value)
   4. remove all lifecycle methods such onComponentDidMount and convert them using the appropriate hooks, like useEffect(()=>console.log(), [])
10. List a few ways styles can be used with components.
    1. create a css file and include it in the component: import './style.css'. in this case, style.css is in the same folder of the component
    2. use a javascript object in the style. <div style={{ background: 'red' }} />, or declaring an object const styleObj = {{ background: 'red' }} and then <div style={styleObj} />
    3. styled-component. it's a recent library to style the components. There isn't any css code, but the entire component is styled thought javascript
11. How to render an HTML string coming from the server
    1. assuming that the api is already called and the html is stored in a variable:
       1. <div dangerousHtml={__html:HTML_VARIABLE} /> this it may lead to dangerous security situation, such as cross-site scripting or javascript injection, if not correctly parsed
       2. declaring a ref and modify it's innerHtml prop:
          1. const ref = useRef(null); 
          2. useEffect(()=>{ if(ref) ref.current.innerHTML = HTML_VARIABLE}). Although i'm not sure if every tag will be correctly rendered, like &amp; etc
          3. then in the render: <div ref={ref} />