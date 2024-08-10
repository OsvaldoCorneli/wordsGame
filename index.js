import { obtenerElementos, getWordSecret, ObtenerPalabraUsuario, allwords, agregarPalabraLocalStorage } from "./functions.js"

let palabraSecreta;
const botonSend = obtenerElementos("sendButton", "id", false)
const botonNext = obtenerElementos("nextButton", "id", false)
const botonReset = obtenerElementos("resetButton", "id", false)
const senddatos = obtenerElementos("sendDatos", "id", false)
let inputs = obtenerElementos("inputs_word input", "class", true)
let racha = 0
let borderindex = 1
let palabrasUsadas = []
let palabrasNoAcertadas = []
let rachaMaxima = 0;
let ultimaRacha = 0;

botonNext.addEventListener("click", () => {
    nextWordGame(true)
})

botonSend.addEventListener("click", () => {
    trueOrFalse()
})
botonReset.addEventListener("click", () => {
    nextWordGame(false)
})

senddatos.addEventListener("click",()=>{
    popUp(null, true)
})


const getTheWord = async () => {
    const word = await getWordSecret();
    const indice = Math.floor(Math.random() * word.palabras.length)
    palabraSecreta = word.palabras[indice]
    if (!palabrasUsadas.includes(palabraSecreta)) {
        return;
    } else {
        getTheWord()
    }

}

getTheWord()
primeraCarga()


inputs.forEach((input, index, inputs) => {

    input.addEventListener("input", () => {
        if (input.value.length === input.maxLength) {
            const nextInput = inputs[index + 1];
            if (nextInput) {
                nextInput.focus();
            }
        }

    })

    input.addEventListener("keydown", (event) => {
        if (event.key == "Backspace" && input.value.length === 0) {
            const previusInput = inputs[index - 1]
            if (previusInput) {
                previusInput.focus()
            }
        } else if (event.key == "Enter") {
            if (!botonSend.disabled)
                trueOrFalse()
        }
    })

    
})


async function trueOrFalse() {
    const palabraUsuario = ObtenerPalabraUsuario(inputs);

    const words = await allwords()
    if (!words.palabras.includes(palabraUsuario.toLowerCase())) {
        inputs.forEach((input) => {
            input.style.backgroundColor = "red";
            setTimeout(() => {
                input.style.backgroundColor = "white";

            }, [100])

        })
        return
    }


    if (palabraSecreta == palabraUsuario.toLowerCase()) {
        colorearLetras(true)
        racha++;
        if(rachaMaxima < racha){
            rachaMaxima = racha;
            agregarPalabraLocalStorage(rachaMaxima ,"rachaMaxima")
        }
        agregarPalabraLocalStorage(racha ,"racha")
        botonSend.style.display = "none";
        botonSend.disabled = true;
        botonNext.style.display = "block"
        botonNext.disabled = false;
        inputs.forEach(element => element.disabled = true)
        palabrasUsadas.push(palabraSecreta)
        setTimeout(()=>{
            popUp(true)

        },[1600])
        agregarPalabraLocalStorage(palabrasUsadas ,"acetarda")
        return;
    } else {
        colorearLetras(false)
        inputs.forEach((input) => {
            input.value = ""
        })
        inputs[0].focus()



    }

}

const nextWordGame = (value) => {

    for (let i = 1; i <= borderindex; i++) {
        const inputsDivs = obtenerElementos(`borders-${i} div`, "class", true)
        inputsDivs.forEach((element) => {
            element.style.backgroundColor = "transparent"
            element.classList.remove("zoom-in")
            element.innerHTML = ""
        }
        )
    }
   
    inputs.forEach(element => {
        element.disabled = false;
        element.value = ""
    })
    inputs[0].focus()
    borderindex = 1;

    if(value){
        botonNext.style.display = "none"
        botonNext.disabled = true;
        botonSend.style.display = "block"
        botonSend.disabled = false;
        getTheWord()
    }else{
        botonReset.style.display = "none"
        botonReset.disabled = true;
        botonSend.style.display = "block"
        botonSend.disabled = false;
        getTheWord()

    }


}


function colorearLetras(value) {
    if (borderindex <= 7) {
        
        const inputsDivs = obtenerElementos(`borders-${borderindex} div`, "class", true)

        const secretWord = palabraSecreta.split("")

        if (value) {

            inputs.forEach((element, index) => {
                element.value = element.value.toLowerCase()
                inputsDivs[index].innerHTML = element.value.toUpperCase()
                setTimeout(() => {
                    inputsDivs[index].style.backgroundColor = "green"
                    inputsDivs[index].classList.add('zoom-in');
                }, [index * 100])
                
                return;
            })
        } else {

            let secretsWords = palabraSecreta.split("");

            inputs.forEach((element, index) => {
                element.value = element.value.toLowerCase()
                if (secretsWords.includes(element.value)) {
                    if (secretWord[index] == element.value) {
                        inputsDivs[index].innerHTML = element.value.toUpperCase()
                        setTimeout(() => {
                            inputsDivs[index].style.backgroundColor = "green"
                            inputsDivs[index].classList.add('zoom-in');
                        }, [index * 100])


                        const indice = secretsWords.indexOf(element.value);

                        if (indice !== -1) {
                            secretsWords.splice(indice, 1);
                        }
                        secretWord[index] = null;

                    }
                }
            })

            inputs.forEach((element, index) => {
                element.value = element.value.toLowerCase()
                if (secretWord[index] != null && secretsWords.includes(element.value)) {
                    inputsDivs[index].innerHTML = element.value.toUpperCase()
                    setTimeout(() => {
                        inputsDivs[index].style.backgroundColor = "yellow"
                        inputsDivs[index].classList.add('zoom-in');
                    }, [index * 100])

                    const indice = secretsWords.indexOf(element.value);

                    if (indice !== -1) {
                        secretsWords.splice(indice, 1);
                    }
                    secretWord[index] = null;

                } else if (secretWord[index] != null) {
                    inputsDivs[index].innerHTML = element.value.toUpperCase()
                    setTimeout(() => {
                        inputsDivs[index].style.backgroundColor = "grey"
                        inputsDivs[index].classList.add('zoom-in');

                    }, [index * 100])
                }

            })

            borderindex++;
            if(borderindex === 7){
                botonSend.style.display = "none";
                botonSend.disabled = true;
                botonReset.style.display = "block"
                botonReset.disabled = false;
                inputs.forEach(element => element.disabled = true)
                palabrasNoAcertadas.push(palabraSecreta)
                if(rachaMaxima < racha){
                    rachaMaxima = racha;
                    agregarPalabraLocalStorage(rachaMaxima ,"rachaMaxima")
                }
                setTimeout(()=>{
                    popUp(false)
                    
                },[1500])
                ultimaRacha = racha;
                agregarPalabraLocalStorage(palabrasNoAcertadas ,"noAcertada")
                agregarPalabraLocalStorage(ultimaRacha ,"ultimaRacha")
                racha = 0;
                agregarPalabraLocalStorage(racha ,"racha")
        }
        }
    }
}



function popUp(value , botons){

    
    const body = obtenerElementos("body","etiqueta", false)
    const spanPop = document.createElement("span")
    spanPop.classList.add("popup")
    
    if(value){
        spanPop.innerHTML=`
        <div id="contenedor1">
            <div id="congrats">
                <h3>¡Felicidades!</h3>
                <h3>¡Adivinaste la palabra!</h3>
            </div>
            <h3>"${palabraSecreta.toUpperCase()}"</h3>
            <div id="data">
                <h4>Racha maxima: ${rachaMaxima}</h4>
                <h4>Racha: ${racha}</h4>
                <h4>Acertadas: ${palabrasUsadas.length}</h4>
                <h4>No acertadas: ${palabrasNoAcertadas.length}</h4>
            </div>
            <button id="popupboton" type="boton">Aceptar</button>
        </div>
        `;
    }else{
        spanPop.innerHTML=`
             <div id="contenedor1">
        <div id="congrats">
        <h3>¡Perdiste!</h3>
        <h3>¡Sigue intentando!</h3>
        </div>
        <h3>La palabra era:</h3>
        <h3 style="background-color: red; color: white; width: 100%; text-align: center;">"${palabraSecreta.toUpperCase()}"</h3>
        <div id="data">
        <h4>Racha Maxima ${rachaMaxima}</h4>
        <h4>Ultima racha: ${ultimaRacha}</h4>
        <h4>Acertadas: ${palabrasUsadas.length}</h4>
        <h4>No acertadas: ${palabrasNoAcertadas.length}</h4>
    </div>
        <button id="popupboton" type="boton">Aceptar</button>
    </div>
        `;

    }

    if(botons){
        spanPop.innerHTML=`
        <div id="contenedor1">
           <button id="deleteAll" type="boton">Borrar todo</button>
   <div id="congrats">
   <h3>Estadistica</h3>
   </div>
   <div id="data">
   <h4>Racha Maxima: ${rachaMaxima}</h4>
   <h4>Ultima racha: ${ultimaRacha}</h4>
   <h4>Racha actual ${racha}</h4>
   <h4>Acertadas: ${palabrasUsadas.length}</h4>
   <h4>No acertadas: ${palabrasNoAcertadas.length}</h4>
</div>

    <div>
 
   <button id="popupboton" type="boton">Aceptar</button>

    </div>
</div>
   `;
    }

    body.appendChild(spanPop)

    const boton = obtenerElementos("popupboton","id", false)
    const botonDelete = obtenerElementos("deleteAll", "id", false);
    const cancelarboton = obtenerElementos("cancelarboton", "id", false)
    boton.addEventListener("click",()=>{

        closePopup(body,spanPop)

    })
    
    botonDelete.addEventListener("click",()=>{

        deleteAll()

    })

    cancelarboton.addEventListener("click",()=>{
        closePopup(body,spanPop)
    })
}


function closePopup(body, pop){

    body.removeChild(pop)


}


export function primeraCarga(){
    const acertadas = localStorage.getItem("acertadas")
    const noacertadas = localStorage.getItem("noacertadas")
    const rachas = localStorage.getItem("racha")
    const rachasM = localStorage.getItem("rachaM")
    const ultimaRachas = localStorage.getItem("rachaM")

    if(acertadas != null){
        palabrasUsadas = JSON.parse(acertadas)
    }
    if(noacertadas != null){
        palabrasNoAcertadas = JSON.parse(noacertadas)
    }
    if(rachas != null){
        racha = rachas
    } 

    if(rachasM != null){
        rachaMaxima = rachasM
    } 

    if(ultimaRachas != null){
        ultimaRacha = ultimaRachas;
    }
    



}

function deleteAll(){

    localStorage.removeItem("acertadas")
    localStorage.removeItem("noacertadas")
    localStorage.removeItem("racha")
    localStorage.removeItem("rachaM")
    localStorage.removeItem("rachaM")
    window.location.reload(true);
}