import { checkType } from "../utils/validation";

export const useHandleTxt = (
  file: any,
  outputArray: boolean,
  format: {
    classes?: string | string[] | undefined,
    id?: string | string[] | undefined,
    tag?: 'div' | 'span' | 'p' | string[] | undefined,
  } = {}
) => {

  const split = file.split('\n');

  if(outputArray === true) {
    return split;
  }

  let content = [];

  split.forEach((el: any, index: number) => {

    const classes = format.classes === undefined
        ? null
      : checkType(format.classes, 'array')
        ? format.classes[index].toString()
      : checkType(format.classes, 'string')
        ? format.classes.toString()
        : null;
    const id = format.id === undefined
        ? null
      : checkType(format.id, 'array')
        ? format.id[index].toString()
      : !checkType(format.id, 'array') && checkType(format.id, 'string')
        ? format.id + '-' + index.toString()
        : null;
    const tag = format.tag === undefined
        ? 'div'
      : checkType(format.tag, 'array')
        ? format.tag[index].toString()
      : checkType(format.tag, 'string')
        ? format.tag.toString()
        : 'div';

    content.push(
      tag === 'span' ? <span className={classes} id={id} key={index}>{el}</span>
      : tag === 'p' ? <p className={classes} id={id} key={index}>{el}</p>
      : <div className={classes} id={id} key={index}>{el}</div>
    );
  });

  return <>{content}</>;
}

export default useHandleTxt;