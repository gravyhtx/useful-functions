import useColorScheme from "./useColorScheme";

const useConsole = (
  message: string,
  useColorTheme?: boolean | 'dark' | 'light',
) => {

  const dark = (useColorTheme === true && useColorScheme().prefersDark === false) || useColorTheme === 'light'
      ? false
      : true;

  const styles = {
    success: {
      label: 'SUCCESS: ',
      bkg: dark ? '#222' : '#59d883',
      color: dark ? '#59d883' : '#222'
    },
    warn: {
      label: 'WARNING: ',
      bkg: dark ? '#222' : '#d1dd8c',
      color: dark ? '#d1dd8c' : '#222'
    },
    error: {
      label: 'ERROR: ',
      bkg: dark ? '#222' : '#e05858',
      color: dark ? '#e05858' : '#222'
    },
    note: {
      label: 'NOTE: ',
      bkg: dark ? '#222' : '#80ecc3',
      color: dark ? '#80ecc3' : '#222'
    }
  }

  //? FUNCTIONS
  const log = () => console.log(message);
  const styledLog = (bkg: string, color: string, label: string, message: string) => {
    return console.log(`%c${label+message}`, `background: ${bkg}; color: ${color}`)
  }
  const warn = () => console.warn(message);
  const error = () => console.error(message);

  //? STYLES
  const s = styles.success;
  const w = styles.warn;
  const e = styles.error;
  const n = styles.note;

  return {
    logSuccess: () => styledLog(s.bkg,s.color,s.label,message),
    logWarn: () => styledLog(w.bkg,w.color,w.label,message),
    logError: () => styledLog(e.bkg,e.color,e.label,message),
    logNote: () => styledLog(n.bkg,n.color,n.label,message),
    warn: () => warn(),
    error: () => error(),
    log: () => log()
  } 

}

export default useConsole;

//! HOW TO USE
//* SIMPLE EXAMPLE USING DESTRUCTURING
//? const note = "This is a SUPER descriptive note!"
//? const { logNote } = useConsole(note);
//? if(condition) {
//?  logNote()
//? }

//* USING WITH DOT NOTATION
//? useConsole("Maybe don't do that thing you did.").logWarn();

//* FUNCTION EXAMPLE (TYPESCRIPT)
//!   // Pass & fail messages
//?   const passMsg = msg?.pass ? msg.pass : "This totally succeeded!!";
//?   const failMsg = msg?.fail ? msg.fail : "This caused an error!!";
//!   // Choose correct message on pass/fail
//?   const message = passed ? passMsg : failMsg;
//?
//!   // Destructure 'useConsole' for success & error states
//?   const { logSuccess, logError } = useConsole(message);
//?
//!  // Show appropriate log based on state of 'passed'
//?   if (passed) {
//?     logSuccess();
//?   } else {
//?     logError();
//?   }
//? }
//?
//! logOutcome(true);  // SUCCESS: This totally succeeded!!