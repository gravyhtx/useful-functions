const useDebounce = (
  callback: () => void,
  delay?: number,
) => {
  let timer = null;
  delay = delay ? delay : 210;
  return (): any => {
    clearTimeout(timer)
    timer = setTimeout(function(){
      timer = null;
      callback.apply(this, arguments)
    }, delay)
  }
}

export default useDebounce;