import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="drag"
const dataResourceID = "data-resource-id";
const dataParent = "data-parent";
let url;
let resourceID;
let newPosition;

export default class extends Controller {
  connect() {
  }

  dragStart(e){
    resourceID = e.target.getAttribute("data-resource-id");
    url = e.target.getAttribute("data-url");
    e.dataTransfer.effectAllowed = "move";
  }

  drop(e) {
    e.preventDefault();
    let parentID = e.target.getAttribute("data-parent");
    const dropTarget = this.findDropTarget(e.target, parentID); 
    const draggedItem = document.querySelector(`[data-resource-id="${resourceID}"]`);
    if (draggedItem === null || dropTarget === null) {
      return true;
    }
    this.setNewPosition(dropTarget, draggedItem, e);
    newPosition = [...this.element.parentElement.children].indexOf(draggedItem);
  }

  dragEnd(e) {
    e.preventDefault();
    if (resourceID === null || newPosition === null) {
      return;
    }
    let data = JSON.stringify({
      resource: {
        id: resourceID,
        position: newPosition
      }
    });
    fetch(url, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: {
        'X-CSRF-Token': this.getMetaValue('csrf-token'),
        'Content-Type': 'application/json'
      },
      body: data,
    })
  }

  dragOver(e) {
    e.preventDefault();
  }

  dragEnter(e) {
    e.preventDefault();
  }

  findDropTarget(target, parentID) {
    if (target === null) {
      return null;
    }
    if (target.id === parentID) {
      return null;
    }
    if (target.classList.contains("draggable")) {
      return target;
    }
    return this.findDropTarget(target.parentElement, parentID);
  }

  setNewPosition(dropTarget, draggedItem) {
    const positionComparison = dropTarget.compareDocumentPosition(draggedItem);
    if (positionComparison & Node.DOCUMENT_POSITION_FOLLOWING) {
      dropTarget.insertAdjacentElement("beforebegin", draggedItem);
    } else if (positionComparison & Node.DOCUMENT_POSITION_PRECEDING) {
      dropTarget.insertAdjacentElement("afterend", draggedItem);
    }
  }

  getMetaValue(name) {
    const element = document.head.querySelector(`meta[name='${name}']`);
    return element.getAttribute('content');
  }
}
