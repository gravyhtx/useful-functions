import { Keyframe, KeyframeAnimationOptions } from 'web-animations-js';

export function animateTo(
  element: Element,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions
): Animation {
  const anim = element.animate(
    keyframes,
    { ...options, fill: 'both' },
  );
  anim.addEventListener('finish', () => {
    anim.commitStyles();
    anim.cancel();
  });
  return anim;
}