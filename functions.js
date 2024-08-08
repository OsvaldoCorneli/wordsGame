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