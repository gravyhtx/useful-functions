import { RefObject } from 'react';
import animate from 'web-animations-js';

interface Animationprops {
  element: RefObject<HTMLElement>;
  animations: object;
  opts: {
    duration: number;
    iterations?: number | typeof Infinity;
    easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  }
}

type WebAnimation = (props: Animationprops) => Animation;

const webAnimation: WebAnimation = (props: Animationprops) => {
  const { element, animations, opts } = props;
  const {easing, duration, iterations} = opts;

  const currentElement = element.current;
  const cssProps = ['color', 'transform', 'opacity', 'background-color', 'translate', 'text-shadow', 'font-size',
    'font-weight', 'border', 'border-color', 'border-radius', 'outline', 'outline-color', 'flex', 'box-shadow',
    'filter', 'rotate',  'scale', 'skew', 'perspective', 'perspective-origin', 'margin', 'padding', 'width', 'height',
    'min-width', 'min-height', 'top', 'right', 'bottom', 'left', 'text-indent', 'grid-template-rows', 'word-spacing',
    'letter-spacing', 'line-height', 'clip-path', 'grid-gap', 'column-count', 'offset-path', 'stroke-dasharray',
    'stroke-dashoffset', 'stroke-width'];
  const disallowedProps = ['display', 'content', 'cursor', 'visibility', 'clip-rule', 'color-interpolation',
    'color-interpolation', 'color-interpolation-filters', 'color-rendering', 'dominant-baseline', 'fill-opacity',
    'fill-rule', 'flood-color', 'flood-opacity', 'font-feature-settings', 'mask-type', 'glyph-orientation-horizontal',
    'glyph-orientation-vertical', 'image-rendering', 'lighting-color', 'marker-end', 'marker-mid', 'marker-start',
    'shape-rendering', 'stop-color', 'stop-opacity', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit',
    'stroke-opacity', 'stroke-opacity', 'text-anchor', 'vector-effect'];
  const hasCssProperty = Object.keys(animations).some((prop) => cssProps.includes(prop));
  const hasDisallowedProp = Object.keys(animations).some((prop) => disallowedProps.includes(prop));

  if(hasDisallowedProp) {
    Object.keys(animations).some((prop) => {
      if(disallowedProps.includes(prop)) {
        console.warn(`Unable to animate "${prop}" property.`)
      }
    });
  }

  if (hasCssProperty && element !== null) {
    return animate(currentElement, {
      ...animations,
      easing: easing?easing:'linear'
    },{
      duration: duration,
      iterations: iterations?iterations:Infinity,
    });
  } else {
    console.warn('Prop, "animation", does not contain a valid css animation.');
    return undefined;
  }
}

export default webAnimation;

// Example:
//
//  const anim = {
//    transform: [
//      'scaleY(0.5)',
//      'scaleX(0.5)',
//      'scaleY(0.5)', ],
//    background: [
//       'red',
//       'blue',
//       'orange',
//       'red', ]},

//  const opts = {
//    duration: 2000,
//    iterations: Infinity,
//    easing: 'ease-in-out' },

//  webAnimation(animateRef, anim, opts);