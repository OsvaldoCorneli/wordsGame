import { obtenerElementos, getWordSecret, ObtenerPalabraUsuario, allwords } from "./functions.js"

let palabraSecreta;
const botonSend = obtenerElementos("sendButton", "id", false)
const botonNext = obtenerElementos("nextButton", "id", false)
const botonReset = obtenerElementos("resetButton", "id", false)
let inputs = obtenerElementos("inputs_word input", "class", true)
let racha = 0
let borderindex = 1
let palabrasUsadas = []
let palabrasNoAcertadas = []

botonNext.addEventListener("click", () => {
    nextWordGame(true)
})

botonSend.addEventListener("click", () => {
    trueOrFalse()
})
botonReset.addEventListener("click", () => {
    nextWordGame(false)
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
    console.log(palabraSecreta)
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
        botonSend.style.display = "none";
        botonSend.disabled = true;
        botonNext.style.display = "block"
        botonNext.disabled = false;
        inputs.forEach(element => element.disabled = true)
        palabrasUsadas.push(palabraSecreta)
        setTimeout(()=>{
            popUp(true)

        },[1600])
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
    if (borderindex <= 6) {
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
            if(borderindex == 6){
                botonSend.style.display = "none";
                botonSend.disabled = true;
                botonReset.style.display = "block"
                botonReset.disabled = false;
                inputs.forEach(element => element.disabled = true)
                palabrasNoAcertadas.push(palabraSecreta)
                racha = 0;
                setTimeout(()=>{
                    popUp(false)
    
                },[1500])
        }
        }
    }
}



function popUp(value){

    
    const body = obtenerElementos("body","etiqueta", false)
    const spanPop = document.createElement("span")
    spanPop.classList.add("popup")
    
    if(value){
        spanPop.innerHTML=`
            <div id="contenedor1">
                <h3>¡Felicidades!</h3>
                <h3>¡Adivinaste la palabra!</h3>
                <h3>""</h3>
                <h4></h4>
                <h4></h4>
                <h4></h4>
                <button id="popupboton" type="boton">Aceptar</button>
            </div>
            <span class="popup">
        <div id="contenedor1">
            <div id="congrats">
                <h3>¡Felicidades!</h3>
                <h3>¡Adivinaste la palabra!</h3>
            </div>
            <h3>"${palabraSecreta.toUpperCase()}"</h3>
            <div id="data">
                <h4>Racha: ${racha}</h4>
                <h4>Acertadas: ${palabrasUsadas.length}</h4>
                <h4>No acertadas: ${palabrasNoAcertadas.length}</h4>
            </div>
            <button id="popupboton" type="boton">Aceptar</button>
        </div>
    </span>
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
        <h4>Racha: ${racha}</h4>
        <h4>Acertadas: ${palabrasUsadas.length}</h4>
        <h4>No acertadas: ${palabrasNoAcertadas.length}</h4>
    </div>
        <button id="popupboton" type="boton">Aceptar</button>
    </div>
        `;

    }

    body.appendChild(spanPop)

    const boton = obtenerElementos("popupboton","id", false)

    boton.addEventListener("click",()=>{

        closePopup(body,spanPop)

    })
    
}


function closePopup(body, pop){

    body.removeChild(pop)


}