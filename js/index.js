
const loadingElement = document.querySelector("#loading")
const postsContainer = document.querySelector("#posts-container")
const botao = document.querySelector("#botaoBuscar")
const url = "https://jsonplaceholder.typicode.com/posts"
//Pegar a url
const urlParametros = new URLSearchParams(window.location.search)
const idPost = urlParametros.get("id")
const comentariosContainer = document.querySelector("#comentarios-container")

const comentarioForm = document.querySelector("#comentario-form")
const emailinput = document.querySelector("#email")
const comentarioinput = document.querySelector("#tcomentario")

if (!idPost) {
    BuscarTodosPosts()
}
else {
        BuscarPostEspecifico(idPost)

        comentarioForm.addEventListener("submit",(e) =>{
            e.preventDefault()
            let comentarioInserido = {
                email: emailinput.value,
                body: comentarioinput.value,
           
            }

comentarioInserido = JSON.stringify(comentarioInserido)

postComentario(comentarioInserido)
        })

}

async function BuscarTodosPosts() {
    const resposta = await fetch(url)

    console.log(resposta)

    const data = await resposta.json()

    console.log(data)

    loadingElement.classList.add("hide")

    data.map((postagem) => {
        const div = document.createElement("div")
        const title = document.createElement("h2")
        const body = document.createElement("p")
        const link = document.createElement("a")

        title.innerText = postagem.title
        body.innerText = postagem.body
        link.innerText = "Ler"
        link.setAttribute("href", './post.html?id=' + postagem.id)

        div.appendChild(title)
        div.appendChild(body)
        div.appendChild(link)
        postsContainer.appendChild(div)
    })
}

async function BuscarPostEspecifico(id) {
    //const respostaPost = await fetch(`${url}/${id}`)
   // const respostaComentario = await fetch(`${url}/${id}/comments`)

const[respostaPost, respostaComentario] = await Promise.all([
    fetch(`${url}/${id}`),
    fetch(`${url}/${id}/comments`),

])

    const dataPostagem = await respostaPost.json()
    const datacomentario = await respostaComentario.json()

    loadingElement.classList.add("hide")

    const title = document.createElement("h1")
    const body = document.createElement("p")

    title.innerText = dataPostagem.title
    body.innerText = dataPostagem.body

    postsContainer.appendChild(title)
    postsContainer.appendChild(body)

    datacomentario.map((comentario) => {
        criarComentario(comentario)
    })
}


function criarComentario(comentario){
const divComentario = document.createElement("div")
const email = document.createElement("h3")
const paragrafocomentario = document.createElement("p")

email.innerText = comentario.email
paragrafocomentario.innerText = comentario.body

divComentario.appendChild(email)
divComentario.appendChild(paragrafocomentario)
comentariosContainer.appendChild(divComentario)
}

async function postComentario (comentario)
{
    const resposta = await fetch(url, {
        method: "POST",
        body: comentario,
        headers:{
            "Content-type": "application/json",
        }
      })
      const dataResposta = await resposta.json()
      criarComentario(dataResposta)
}