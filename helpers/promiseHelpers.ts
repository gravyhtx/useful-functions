import { RefObject } from "react";

//! //================\\ !//
//! || ERROR HANDLING || !//
//! \\================// !//

function CancelError(): void {
  Object.assign(new Error("The operation was canceled."), {name: "CancelError"});
}

//! //=================\\ !//
//! || PROMISE HELPERS || !//
//! \\=================// !//

//* ASYNC DELAY TIMER
//?   Adds a delay before performing an action in an async/await function
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// EXAMPLE
//  Performs a console.log with text in a callback after a delay
//
// const delayedLog = async callback => {
//   await timer(1000);  // Wait 1s
//   callback('Hello');  // Then perform callback action
// };
//
// delayedLog(text => console.log(text));

//* TIMED ASYNC CALLBACK
//?   Combines timer with callback to perform after set delay (ms)
export const startAsync = async(
  ms: number,
  callback: () => any,
  ) => {
  await delay(ms) 
  callback()
}

//? EXAMPLE
// In this example, it shows a message that appears
// for 2 seconds on subsission

//? const handleFormSubmit = () => {
//   //* Perform form submission logic here...
//?   startAsync(2000, () => {
//?     setFormSubmitted(true)
//?   })
//? }
//?
//? const Form = () => {
//?   const [formSubmitted, setFormSubmitted] = useState(false)
//?
//?   return (
//?     <div>
//?       <form onSubmit={handleFormSubmit}>
//?         {/* form inputs */}
//?       </form>
//?       {formSubmitted && <p>Form submitted!</p>}
//?     </div>
//?   )
//? }


export const timedPromise = (ms: number) => {
  let id: any;
  let isCancelled = false;
  const timeout = new Promise((resolve, reject) => {
    id = setTimeout(() => {
      if (!isCancelled) {
        reject(new CancelError());
      }
    }, ms);
  });
  const cancel = () => {
    isCancelled = true;
    clearTimeout(id);
  };
  return {
    promise: Promise.race([timeout]),
    cancel: cancel
  };
};

export const race = (ms, onCancel) => {
  let id: any;
  const both = (x: any) => [x, x];
  onCancel = onCancel.then(...both(() => Promise.reject(new CancelError())));
  onCancel.catch(() => clearTimeout(id));
  return Promise.race([new Promise(r => id = setTimeout(r, ms)), onCancel]);
};

export const cancel = (ref: RefObject<HTMLButtonElement | HTMLElement>) => {
  return new Promise(cancel => ref.current.onclick = cancel);
};


//* RACE & CANCEL EXAMPLE
//? const Timer = () => {
//?   const [isTimerRunning, setIsTimerRunning] = useState(false);
//?   const [isActionOccurred, setIsActionOccurred] = useState(false);
//?   const cancelButtonRef = useRef<HTMLButtonElement>(null);
//?   const startTimer = () => {
//?     setIsTimerRunning(true);
//?     race(10000, cancel(cancelButtonRef)).then(() => {
//?       setIsActionOccurred(true);
//?     }).catch((err) => {
//?       if (err.message === 'The operation was canceled.') {
//?         console.log('Timer was canceled');
//?       }
//?     });
//?   }
//?   return (
//?     <div>
//?       <button ref={cancelButtonRef} onClick={() => setIsTimerRunning(false)}>Cancel Timer</button>
//?       {!isTimerRunning && <button onClick={startTimer}>Start Timer</button>}
//?       {isActionOccurred && <p>The action has occurred!</p>}
//?     </div>
//?   );
//? }