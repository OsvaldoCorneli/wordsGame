import { obtenerElementos, getWordSecret, ObtenerPalabraUsuario, allwords } from "./functions.js"

let palabraSecreta;
const botonSend = obtenerElementos("sendButton", "id", false)
const botonNext = obtenerElementos("nextButton", "id", false)
const botonReset = obtenerElementos("resetButton", "id", false)
const inputs = obtenerElementos("inputs_word input", "class", true)
let borderindex = 1
let palabrasUsadas = []
let palabrasNoAcertadas = []
console.log("palabrasUsadas", palabrasUsadas)
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
    const palabraUsuario = ObtenerPalabraUsuario(inputs);
    console.log(palabraSecreta)
    const words = await allwords()
    if (!words.palabras.includes(palabraUsuario)) {
        inputs.forEach((input) => {
            input.style.backgroundColor = "red";
            setTimeout(() => {
                input.style.backgroundColor = "white";

            }, [100])

        })
        return
    }


    if (palabraSecreta == palabraUsuario) {
        colorearLetras(true)

        botonSend.style.display = "none";
        botonSend.disabled = true;
        botonNext.style.display = "block"
        botonNext.disabled = false;
        inputs.forEach(element => element.disabled = true)
        palabrasUsadas.push(palabraSecreta)
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
    console.log("palabrasUsadas", palabrasUsadas)
    console.log("palabrasNoAcertadas", palabrasNoAcertadas)
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
    if (borderindex <= 5) {
        const inputsDivs = obtenerElementos(`borders-${borderindex} div`, "class", true)

        const secretWord = palabraSecreta.split("")

        if (value) {

            inputs.forEach((element, index) => {
                inputsDivs[index].innerHTML = element.value
                setTimeout(() => {
                    inputsDivs[index].style.backgroundColor = "green"
                    inputsDivs[index].classList.add('zoom-in');
                }, [index * 100])
                return;
            })
        } else {

            let secretsWords = palabraSecreta.split("");

            inputs.forEach((element, index) => {
                if (secretsWords.includes(element.value)) {
                    if (secretWord[index] == element.value) {
                        inputsDivs[index].innerHTML = element.value
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

                if (secretWord[index] != null && secretsWords.includes(element.value)) {
                    inputsDivs[index].innerHTML = element.value
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
                    inputsDivs[index].innerHTML = element.value
                    setTimeout(() => {
                        inputsDivs[index].style.backgroundColor = "grey"
                        inputsDivs[index].classList.add('zoom-in');

                    }, [index * 100])
                }

            })

        }
        console.log(borderindex)
        borderindex++;
        if(borderindex == 6){
            botonSend.style.display = "none";
            botonSend.disabled = true;
            botonReset.style.display = "block"
            botonReset.disabled = false;
            inputs.forEach(element => element.disabled = true)
            palabrasNoAcertadas.push(palabraSecreta)
        }
    }
}



