let lista = []
const button = `<button onclick="Editar"> <i class="fa fa-pencil"></i> Editar</button>
<button onclick="remover"> <i class="fa fa-ban"></i> Cancelar</button>
<button onclick=""> <i class="fa fa-check"></i> Confirmar</button>`

function adicionar() {
    const at = document.getElementById("inptxt").value.trim()
    const pr = document.getElementById("alt").textContent
    const tarefas = document.getElementById("lista")
    const div = document.createElement("div")
    if(!at){
        alert("Por favor, insira um texto.")
        return;
    }
    else{
        if(pr = "Alta"){
            lista.unshift(at);
        }
        else if(pr = "Media"){
            
        }
        else if(pr = "Baixa"){
            lista.push(at);
        }

    }
}

function remover(){
        this.remove()
}

function Editar(){
    let nome = prompt("Mudar trabalho")
    this.textContent = nome
}