import { RefObject } from "react";
//? https://www.w3schools.com/howto/howto_js_draggable.asp


//* DRAG ELEMENT
const dragElement = ( elementRef: any, headerRef?: any ) => {
  const el = elementRef.current; // Ref from Element container
  const header = headerRef.current; // Ref from Header inside of container
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(el.id + "-header") && !headerRef) {
    //? Include a div with component id plus "-header
    //? if present, the header is where you move the div from:
    document.getElementById(el.id + "-header").onmousedown = dragMouseDown;
  } if(headerRef) {
    header.onmousedown = dragMouseDown;
  } else {
    //? otherwise, move the DIV from anywhere inside the DIV:
    el.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e: MouseEvent) {
    const event = e || window.event;
    event.preventDefault();
    //? Get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    //? Call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e: MouseEvent) {
    const event = e || window.event;
    event.preventDefault();
    //? Calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    //? Set the element's new position:
    el.style.top = (el.offsetTop - pos2) + "px";
    el.style.left = (el.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    //? Stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

export default dragElement;