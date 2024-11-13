const cor = ["red","yellow","#10a4e3"]
const pr = ["Alta","Media","Baixa"]
let cont = 1
function mudar(){
    if(cont > 2){
        cont = 0
    }
    document.getElementById("alt").style.backgroundColor = cor[cont];
    document.getElementById("alt").textContent = pr[cont]
    cont++
}