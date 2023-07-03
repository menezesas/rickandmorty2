const api = axios.create({
    baseURL: 'https://rickandmortyapi.com/api'
})

const espacoCardsRow = document.getElementById('espaco-cards')
const botaoPrev = document.getElementById('botao-prev')
const botaoAtual = document.getElementById('botao-atual')
const botaoNext = document.getElementById('botao-next')
const footer = document.getElementById('footer')

let paginaAtual = 1
let totalPaginas = 0


document.addEventListener('DOMContentLoaded', async () => {
    const dadosRetornados = await buscarPersonagens(paginaAtual);
    const episodios = await pegarEpisodios()
    const localizacoes = await pegarLocalizacao()
    const totalPersonagens = await pegarPersonagens()

    montarColunasCards(dadosRetornados.personagens)
    mudarBotoes(dadosRetornados.paginaAnterior, dadosRetornados.proximaPagina)
    montarFooter(episodios, localizacoes, totalPersonagens)

});

botaoNext.addEventListener('click', proximaPagina)
botaoPrev.addEventListener('click', paginaAnterior)

function montarFooter (episodios, localizacoes, totalPersonagens) {
    footer.innerHTML = ``

    const divFooter = document.createElement('div')
    divFooter.setAttribute('class', 'container-fluid h-100 p-0 d-flex justify-content-between flex-column w-100')
    divFooter.setAttribute('id', 'container-info')

    const divRow = document.createElement('div')
    divRow.setAttribute('class', 'row  w-100 mt-5 text-center informacoes')

    const divColP = document.createElement('div')
    divColP.setAttribute('class', 'col-12 col-md-2  offset-md-3 verde')

    divColP.innerHTML = `<p>PERSONAGENS: <span id='branco'>${totalPersonagens}</span></p>` 
    
    const divColL = document.createElement('div')
    divColL.setAttribute('class', 'col-12 col-md-2   verde')

    divColL.innerHTML = `<p>LOCALIZAÇÕES: <span id='branco'>${localizacoes}</span></p>`

    const divColE = document.createElement('div')
    divColE.setAttribute('class', 'col-12 col-md-2  verde')

    divColE.innerHTML = `<p>EPISÓDIOS: <span id='branco'>${episodios}</span> </p>`

    const divRow2 = document.createElement('div')
    divRow2.setAttribute('class', 'row m-0')

    const divCol2 = document.createElement('div')
    divCol2.setAttribute('class', 'col-12 text-center')
    divCol2.innerHTML = `<p class='verde'>Desenvolvido por: <span id='branco'>Arthur Menezes Silva</span> em 2023</p>`

    divRow2.appendChild(divCol2)

    divRow.appendChild(divColP)
    divRow.appendChild(divColL)
    divRow.appendChild(divColE)

    divFooter.appendChild(divRow)
    divFooter.appendChild(divRow2)

    footer.appendChild(divFooter)
}

function detalhesPersonagem(personagemId) {
    console.log(personagemId)
    localStorage.setItem('personagemId', personagemId)
    document.location.href = './personagens.html'
}

function montarColunasCards(listaPersonagens) {
    espacoCardsRow.innerHTML = ""

    listaPersonagens.forEach(async (personagem) => {

        
        const divCol = document.createElement('div')
        divCol.setAttribute('class', 'col-12 col-md-6 col-lg-4')
      
        const divCard = document.createElement('div')
        divCard.setAttribute('class', 'card w-100 cardCss')
 
        const imgCard = document.createElement('img')
        imgCard.setAttribute('src', `${personagem.image}`)
        imgCard.setAttribute('class', 'card-img-top')
        imgCard.setAttribute('alt', `${personagem.name}`)

        const divCardBody = document.createElement('div')
        divCardBody.setAttribute('class', 'card-body px-4')
        
        const tituloCard = document.createElement('h5')
        tituloCard.setAttribute('class', 'card-title')
        tituloCard.innerText = personagem.name

        const descricaoPersonagem = document.createElement('p')
        descricaoPersonagem.setAttribute('class', 'card-text')
        descricaoPersonagem.innerHTML = `
            <span class="${personagem.status === 'Alive' ? 'text-success' : personagem.status === 'Dead' ? 'text-danger' : 'text-secondary'}">
                <i class="bi bi-caret-right-fill"></i>
            </span>
            ${personagem.status} - ${personagem.species}
        `

        const urlEpisodio = personagem.episode[personagem.episode.length -1]
        const nomeEpisodio = await buscarEpisodio(urlEpisodio)

        const detalhamentoPersonagem = document.createElement('dl');
        detalhamentoPersonagem.innerHTML = `
            <dt class = 'cinza'>Última localização conhecida:</dt>
            <dd>${personagem.location.name}</dd>

            <dt class = 'cinza'>Visto a última vez em:</dt>
            <dd>${nomeEpisodio}</dd>
        `
        const linkA = document.createElement('a')
        linkA.setAttribute('class', 'btn-personagem')
        linkA.innerText ='Detalhes do personagem'

        linkA.addEventListener('click', () => {
            localStorage.setItem('id', personagem.id)
            console.log(personagem.id)

            window.location.href = './personagens.html'
        })


        divCardBody.appendChild(tituloCard)
        divCardBody.appendChild(descricaoPersonagem)
        divCardBody.appendChild(detalhamentoPersonagem)
        divCardBody.appendChild(linkA)

        divCard.appendChild(imgCard)
        divCard.appendChild(divCardBody)

        divCol.appendChild(divCard)

        espacoCardsRow.appendChild(divCol)

    })
}


async function buscarEpisodio (url) {
    try{
        const respostaURL = await axios.get(url)

        return respostaURL.data.name
    } catch (erro) {
        return 'N/D'
    }
}

function mudarBotoes(prev, next) {
    botaoAtual.children[0].innerText = paginaAtual

    if (!prev) {
        botaoPrev.classList.remove('cursor-pointer')
        botaoPrev.classList.add('disabled')
    } else {
        botaoPrev.classList.add('cursor-pointer')
        botaoPrev.classList.remove('disabled')
    }

    if (!next) {
        botaoNext.classList.remove('cursor-pointer')
        botaoNext.classList.add('disabled')
    } else {
        botaoNext.classList.add('cursor-pointer')
        botaoNext.classList.remove('disabled')
    }
}

async function buscarPersonagens(pagina) {
    try {
        const resposta = await api.get(`/character?page=${pagina}`)

        const dadosApi = {
            totalPaginas: resposta.data.info.pages,
            totalPersonagens: resposta.data.info.pages * resposta.data.info.count,
            personagens: resposta.data.results,
            proximaPagina: resposta.data.info.next,
            paginaAnterior: resposta.data.info.prev
        }

        return dadosApi

    } catch (erro) {
        console.log(erro)
        alert('Erro na busca de personagens.')
    }
}

async function proximaPagina() {
    if (!botaoNext.classList.contains('disabled')) {
        paginaAtual = paginaAtual + 1

        const dadosAPI = await buscarPersonagens(paginaAtual)
        console.log(dadosAPI)
        montarColunasCards(dadosAPI.personagens)
        mudarBotoes(dadosAPI.paginaAnterior, dadosAPI.proximaPagina)
    }
}

async function paginaAnterior() {
    if (!botaoPrev.classList.contains('disabled')) {
        
        paginaAtual = paginaAtual -1

        const dadosAPI = await buscarPersonagens(paginaAtual)

        montarColunasCards(dadosAPI.personagens)
        mudarBotoes(dadosAPI.paginaAnterior, dadosAPI.proximaPagina)
    }
}

async function pegarLocalizacao () {
    try {
        const resposta = await api.get('/location')

        const localizacao = resposta.data.info.count

        return localizacao

    } catch (erro) {
        console.log(erro)
        alert('Erro na busca pelo número total de localizações.')
    }
}
async function pegarEpisodios () {
    try {
        const resposta = await api.get('/episode')

        const episodios = resposta.data.info.count

        return episodios

    } catch (erro) {
        console.log(erro)
        alert('Erro na busca pelo número total de episódios.')
    }
}
async function pegarPersonagens () {
    try {
        const resposta = await api.get('/character')

        const personagens = resposta.data.info.count

        return personagens

    } catch (erro) {
        console.log(erro)
        alert('Erro na busca pelo número total de personagens.')
    }
}