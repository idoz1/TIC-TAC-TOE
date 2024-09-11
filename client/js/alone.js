const cell = document.querySelectorAll('.cell');

function addTicOrTac (){
    let tic = false;
    cell.forEach((i) => {
        i.addEventListener('click', () => 
            {
                if(tic === false){
                    i.classList.add('O')
                    tic = true
                }else{
                    i.classList.add('X')
                    tic = false;
                }
            })
    })
}

addTicOrTac();