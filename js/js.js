const button = `<button onclick="Editar(this)"> <i class="fa fa-pencil"></i> Editar</button>
<button onclick="remover(this)"> <i class="fa fa-ban"></i> Cancelar</button>
<button onclick="confirmar(this)"> <i class="fa fa-check"></i> Confirmar</button>`

function adicionar(){
    const at = document.getElementById("inptxt").value.trim()
    const select = document.getElementById("select")
    const pr = select.value
    const lista = document.getElementById("lista")
    const li = document.createElement("li")
    const cor = nocor(pr)
    if(!at){
        alert("Por favor, insira um texto.")
        return;
    }
    else{
        
        let noat = `${at} ${button}`
        noat.style.backgroundColor = cor
        li.setAttribute("id",noat)
        ul.appendChild(li)


        
        at.value = ''
    }
}

function nocor(cor) {
    if(cor == "Alta"){
        return "#FF474780"
    }
    else if(cor == "Media"){
        return "#FFF94580"
    }
    else{
        return "#3BFFEC94"
    }
}

function remover(){
        this.remove()
}

function confirmar() {
    const del = document.createElement("del")
    del.appendChild(document.createTextNode(this))
}

function Editar(){
    let nome = prompt("Mudar trabalho")
    this.textContent = nome
}