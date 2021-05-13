function initDragAndDrop() {
    const draggableItemsContainer = document.querySelector('ul');

draggableItemsContainer.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.dataset.index); 
    e.target.classList.add('dragged');
});
draggableItemsContainer.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragged');
});   

draggableItemsContainer.addEventListener('dragenter', (e) => {
    if (e.target.dataset && e.target.dataset.index) {
        e.target.classList.add('dragover');
    }    
});
draggableItemsContainer.addEventListener('dragleave', (e) => {
    if (e.target.dataset && e.target.dataset.index) {
        e.target.classList.remove('dragover');
    }
}); 
 
draggableItemsContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
});

draggableItemsContainer.addEventListener('drop', (e) => {
    e.target.classList.remove('dragover');
    e.preventDefault();
    const index1 = e.dataTransfer.getData('text/plain');
    const index2 = e.target.dataset.index;
    const node1 = document.querySelector("[data-index='" + index1 + "']");
    const node2 = document.querySelector("[data-index='" + index2 + "']");
    swap(node1,node2);
});
}
 
function swap(nodeA, nodeB) {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
    nodeB.parentNode.insertBefore(nodeA, nodeB);
    parentA.insertBefore(nodeB, siblingA);
}

function initTouch() {
    const draggableItemsContainer = document.querySelector('ul');
    let initialX = 0;
    let initialY = 0;
    let lastX = 0;
    let lastY = 0;

    draggableItemsContainer.addEventListener('touchstart', (e) => {
        if(e.target.tagName == 'LI'){
            initialX = e.touches[0].clientX;
            initialY = e.touches[0].clientY;
            e.target.classList.add('dragged');
        }
    });

    draggableItemsContainer.addEventListener('touchmove', (e) => {
        if(e.target.tagName == 'LI'){
            const x = e.touches[0].clientX - initialX;
            const y = e.touches[0].clientY - initialY;
            lastX = e.touches[0].clientX;
            lastY = e.touches[0].clientY;
            e.target.style.transform = "translate(" + x + "px, " + y + "px)";

            const elementList = document.elementsFromPoint(lastX, lastY);
            //if(elementList.length !== 4 && elementList.length > 0){
            if(elementList.length > 4){
                if(!elementList[1].classList.contains('dragover')){
                    elementList[1].classList.add('dragover');
                }
            } else {
                let list = document.getElementsByClassName('dragover');
                if(list.length > 0){
                    list[0].classList.remove('dragover');
                }
            }
        }
    });
    draggableItemsContainer.addEventListener('touchend', (e) => {
        if(e.target.tagName == 'LI'){
            const elementList = document.elementsFromPoint(lastX, lastY);
            if (elementList.length > 1 && elementList[1].hasAttribute('draggable')) {
                const node1 = document.querySelector("[data-index='" + e.target.dataset.index + "']");
                const node2 = document.querySelector("[data-index='" + elementList[1].dataset.index + "']");
                swap(node1, node2);
            }
            //e.target.style.transform = "translate(0px, 0px)";
            e.target.style.transform = "";
            e.target.classList.remove('dragged');
            elementList[1].classList.remove('dragover');
        }
    });
}


// check if javascript gets called on mobile
function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

if (detectMob()) {
    initTouch();
} else {
    initDragAndDrop();
}