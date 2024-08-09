export function obtenerElementos(nombre, tipo, all) {

    if (all) {
        if (tipo == "id") {
            return document.querySelectorAll(`#${nombre}`)
        }

        if (tipo == "class") {
            return document.querySelectorAll(`.${nombre}`)
        }

        if (tipo == "etiqueta") {
            return document.querySelectorAll(`${nombre}`)
        }

    } else {
        if (tipo == "id") {
            return document.querySelector(`#${nombre}`)
        }

        if (tipo == "class") {
            return document.querySelector(`.${nombre}`)
        }

        if (tipo == "etiqueta") {
            return document.querySelector(`${nombre}`)
        }

    }


}


export const getWordSecret = async () => {
    const response = await fetch("./palabras.json");
    const data = await response.json();
    return data;
}


export function ObtenerPalabraUsuario(inputs) {
    let userWord;
    inputs.forEach((input) => {
        userWord === undefined ? userWord = input.value : userWord += input.value

    })
    return userWord

}

export const allwords = async () => {
    const word = await getWordSecret();
    return word;

}


export function agregarPalabraLocalStorage(array, tipo){
    const acertada = localStorage.getItem("acertadas")
    const noAcertada = localStorage.getItem("noacertadas")
    console.log(acertada)
 switch(tipo){
    case "acetarda":

    if(acertada != null){
        localStorage.setItem("acertadas", JSON.stringify(array))
        console.log("existe!")
    }
    else{
        localStorage.setItem("acertadas", JSON.stringify(array));
        console.log("ingreso else")
    }


    break;
    case "noAcertada":

    break;
    case "racha":

    break;
    default:
    break;
 }


}


