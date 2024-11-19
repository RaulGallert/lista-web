const cor = ["red","yellow","#10a4e3"]
const pr = ["Alta","Media","Baixa"]
let lista = []
let cont = 1
function mudar(){
    if(cont > 2){
        cont = 0
    }
    document.getElementById("alt").style.backgroundColor = cor[cont];
    document.getElementById("alt").textContent = pr[cont]
    cont++
}

function adicionar() {
    const at = document.getElementById("inptxt").value
    const pr =  document.getElementById("alt").textContent

    if(pr == "Alta"){
        lista.unshift(at)

    }else if(pr == "Media"){
        let a = lista.length/2
        lista.splice(a , 0,at)

    }else{
        lista.push(at)
    }

    for (let i = 0; i < lista.length; i++) {
        let child = document.createElement('li')
        child.innerHTML = lista
        document.getElementById("lista").appendChild(child)
    }

    console.log(lista)
    
}