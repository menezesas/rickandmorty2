const api = axios.create({
    baseURL: 'https://rickandmortyapi.com/api'
})

const espacoCards = document.getElementById('espaco-cards')
const btnHome = document.getElementById('btn-home')
const footer = document.getElementById('footer')
const personagemId = localStorage.getItem('id')
console.log({ personagemId })

btnHome.addEventListener('click', () => {
    window.location.href = ('/index.html')
})

document.addEventListener('DOMContentLoaded', async () => {

    const dadosRetornados = await pegarDadosPersonagem(personagemId)
    const episodios = await pegarEpisodios()
    const localizacoes = await pegarLocalizacao()
    const totalPersonagens = await pegarPersonagens()


    montarCardPersonagem(dadosRetornados)
    montarFooter(episodios, localizacoes, totalPersonagens)
})

async function montarCardPersonagem(personagem) {
    espacoCards.innerHTML = ``
    console.log(personagem)

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

        const urlEpisodio = personagem.episode[personagem.episode.length - 1]
        const nomeEpisodio = await buscarEpisodio(urlEpisodio)

        const detalhamentoPersonagem = document.createElement('dl');
        detalhamentoPersonagem.innerHTML = `
            <dt class = 'cinza'>Última localização conhecida:</dt>
            <dd>${personagem.location.name}</dd>

            <dt class = 'cinza'>Visto a última vez em:</dt>
            <dd>${nomeEpisodio}</dd>

            <dt class = 'cinza'>Planeta originário</dt>
            <dd>${personagem.origin.name}</dd>
            
            <dt class = 'cinza'>Gênero:</dt>
            <dd>${personagem.gender}</dd>
        `
        divCardBody.appendChild(tituloCard)
        divCardBody.appendChild(descricaoPersonagem)
        divCardBody.appendChild(detalhamentoPersonagem)

        divCard.appendChild(imgCard)
        divCard.appendChild(divCardBody)

        divCol.appendChild(divCard)

        espacoCards.appendChild(divCol)
}


async function buscarEpisodio (url) {
    try{
        const respostaURL = await axios.get(url)

        return respostaURL.data.name
    } catch (erro) {
        return 'N/D'
    }
}


async function pegarDadosPersonagem(personagemId) {
    try {
        const resposta = await api.get(`/character/${personagemId}`);
        console.log(resposta)
        const personagem = resposta.data
        console.log(personagem)

        return personagem

    } catch (erro) {
        console.log(erro) 
        alert('Erro na busca de personagens.')
    }
}

function montarFooter (episodios, localizacoes, totalPersonagens) {
    footer.innerHTML = ``

    const divFooter = document.createElement('div')
    divFooter.setAttribute('class', 'container-fluid h-100 p-0 d-flex justify-content-between flex-column w-100')
    divFooter.setAttribute('id', 'container-info')

    const divRow = document.createElement('div')
    divRow.setAttribute('class', 'row h-100 w-100 mt-5 text-center informacoes')

    const divColP = document.createElement('div')
    divColP.setAttribute('class', 'col-12 col-md-2  offset-md-3 verde')
 
    divColP.innerHTML = `<p>PERSONAGENS: <span id='branco'>${totalPersonagens}</span></p>` 
    
    const divColL = document.createElement('div')
    divColL.setAttribute('class', 'col-12 col-md-2  verde')

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