const BASE_PATH = "https://api.jikan.moe/v3"

async function onClickSearch(event) {
    event.preventDefault()
    const text = getSearchInputValue()
    const results = await searchResults(text)
    generateSearchList(results)
}

function getSearchInputValue() {
    return document.getElementById("search-field").value
}

async function searchResults(text) {
    const path = BASE_PATH + `/search/anime?q=${text}`
    const { results } = await fetch(path).then(resp => resp.json())
    return results
}

function generateSearchList(animes) {
    const html = animes.reduce((acc, item) => {
        let synopsis = ""
        if (item.synopsis) {
            synopsis = `
                <div class="anime-synopsis">
                    <p>Synopsis</p>
                    <div>${item.synopsis}</div>
                </div>
            `
        }

        acc += `
            <div class="anime-card">
                <div class="anime-title">${item.title}</div>
                <div class="anime-content"> 
                    <img class="anime-image" src="${item.image_url}">
                    <div>
                        ${synopsis}
                        <div>
                            <p>Score: ${item.score}</p>
                            <p>Episodes: ${item.episodes}</p>  
                            <p>Transmission date: ${formatDate(item.start_date)} ~ ${formatDate(item.end_date)}</p>
                        </div>
                    </div>
                </div>
            </div>   
        `
        return acc
    }, "")

    document.getElementById("list").innerHTML = html
}

function formatDate(value) {
    if (value == null || value == undefined) {
        return ''
    }

    const date = new Date(value)
    const year = date.getFullYear()
    const month = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
    const day = date.getDay() < 10 ? `0${date.getDay()}` : date.getDay()

    return `${day}/${month}/${year}`;
}

function generateTopList(list) {
    console.log(list)
    const listHtml = list.reduce((acc, item) => {
        acc += `
            <div class="anime-card">
                <div class="anime-title">${item.title}</div>
                <img class="anime-image" src="${item.image_url}">
            </div>
        `
        return acc
    }, "")

    return `<div class="anime-top-list">${listHtml}</div>`
}

function init() {
    fetch(BASE_PATH + "/top/anime/1")
        .then(resp => resp.json())
        .then(resp => generateTopList(resp.top))
        .then(html => {
            document.getElementById("list").innerHTML = html
        })
}

init()