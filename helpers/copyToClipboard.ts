import { MutableRefObject } from "react";

function copyToClipboard(ref: MutableRefObject<HTMLInputElement>, showMessages: boolean) {
  showMessages = showMessages === true ? true : false;
  const success = () => showMessages ? console.log('Text copied to clipboard!') : null;
  const error = (err?: any) => showMessages ? console.error('Could not copy text: ', err) : null;
  const text = ref.current.value;
  navigator.clipboard.writeText(text).then(
    function() { success(); },
    function(err) { error(err); }
  );
}

export default copyToClipboard;