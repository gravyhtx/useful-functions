import useColorScheme from "./useColorScheme";

const useConsole = (
  message: string,
  type?: 'log' | 'logSuccess' | 'logWarn' | 'logError' | 'logNote' | 'warn' | 'error',
  useColorTheme?: boolean,
) => {

  const dark = useColorTheme === true ? useColorScheme().prefersDark : true;

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
  const log = () => console.log(message);
  const styledLog = (bkg: string, color: string, label: string) => {
    return console.log(`%c${label+message}`, `background: ${bkg}; color: ${color}`)
  }
  const warn = () => console.warn(message);
  const error = () => console.error(message);
  console.log(type)
  switch(type) {
    case 'logSuccess':
      const s = styles.success
      return console.log(`%c${s.label+message}`, `background: ${s.bkg}; color: ${s.color}`);
    case 'logWarn':
      const w = styles.warn
      return console.log(`%c${w.label+message}`, `background: ${w.bkg}; color: ${w.color}`);
    case 'logError':
      const e = styles.error
      return console.log(`%c${e.label+message}`, `background: ${e.bkg}; color: ${e.color}`);
    case 'logNote':
      const n = styles.note
      return console.log(`%c${n.label+message}`, `background: ${n.bkg}; color: ${n.color}`);
    case 'warn':
      return warn();
    case 'error':
      return error();
    default:
      return log();
  }
}

export default useConsole;