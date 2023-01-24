export const responsiveSize = (
  itemSpace: number, // 0-100 (percentage)
  totalSpace: number, // 0-100 (percentage)
  windowSize: number, // useWindowSize().width (or height)
  units?: 'px' | '%' | 'vw' | 'vh',
) => {
  units = units ? units : '%';
  const windowSpace = (windowSize * totalSpace) / 100;
  const responsiveSpace = (itemSpace * windowSpace) / 100;
  if(units === 'px') {
    return responsiveSpace.toFixed(2) + 'px'
  }
  return ((responsiveSpace / windowSpace) * 100).toFixed(2) + units;
}