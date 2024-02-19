export function loadingElm(){
    return (
    <div className="rectangle">
        <div className="shine"></div>
    </div>  
    )
}

export function activeElm(event, parentElmClass) {
    let parentElm = document.querySelector('.' + parentElmClass);
    let elmList = parentElm.querySelectorAll('li');
    for (let listElement of elmList) {
        listElement.classList.remove("active");
    }

    const clickedElement = event.currentTarget;
    clickedElement.classList.toggle("active");
}

export function displaySideMenu(event){
    const sideMenu = document.querySelector('.sideMenu');
    if (sideMenu.classList.contains('d-none')) {
        sideMenu.classList.remove('d-none');
    } else {
        sideMenu.classList.add('d-none');
    }
}

export function displayElement(event, classParent, classEnfant){
    event.stopPropagation();
    const clickedElement = event.currentTarget;
    clickedElement.querySelector('.fa-angle-up').classList.toggle("rotateDown");
    let parent = clickedElement.parentNode;
    while (parent && !parent.classList.contains(classParent)) {
        parent = parent.parentNode;
    }
    
    let listComments = parent.querySelector("." + classEnfant);
    let listeLi = listComments.querySelectorAll(':scope > li');
  
    for (let li of listeLi) {
        li.classList.toggle('active');
    }
  }