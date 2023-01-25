import { useEffect, useState } from "react";

const useColorScheme = () => {
  const [dark, setIsDarkMode] = useState<boolean | null>(null);
  useEffect(() => {
    setIsDarkMode(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? true : false);
  })
  return {
    mode: dark === true ? 'dark' : 'light',
    prefersDark: dark === true ? true : false,
    prefersLight: dark === false ? true : false,
  }
}

export default useColorScheme;