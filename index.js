const burger = document.getElementById("burger")
const navbar = document.getElementById("navbar")
const input = document.getElementById("input")
const errorMsg = document.getElementById("error-msg")
const shortenBtn = document.getElementById("url-btn")
const savedUrls = document.getElementById("saved-url")

const isValidUrl = urlString => {
	  	var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
	    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
	    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
	    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
	    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
	    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
	  return !!urlPattern.test(urlString);
}

displayUrlFromLocalStorage()

burger.addEventListener("click", function() {
    if (navbar.style.visibility == "hidden") {
        navbar.style.visibility = "visible"
    } else {
        navbar.style.visibility = "hidden"
    }
})

shortenBtn.addEventListener("click", function() {
    if (isValidUrl(input.value)) {
        normalStyling()
        fetch(`https://api.shrtco.de/v2/shorten?url=${input.value}`)
            .then(res => res.json())
            .then(data => displayUrl(data))
    }
    else if(!isValidUrl(input.value) && input.value.length != 0) {
        input.style.border = "2px red solid"
        document.querySelector(".form").style.height = "120px"
        errorMsg.style.display = "inline-block"
        errorMsg.textContent = "Please add a link"
    } 
    else {
        alert("You haven't entered any URL!")
    }
})

function createUrlCard(fullUrl, shortUrl) {
    const urlDiv = document.createElement("div")
    const fullLink = document.createElement("p")
    const shortenLink = document.createElement("p")
    const copyBtn = document.createElement("button")
    const hr = document.createElement("hr")
    hr.style.color = "gray"
    hr.style.height = "0.2px"
    hr.style.width = "100%"
    if (fullUrl.length >= 38 && window.innerWidth < 600) {
        fullLink.textContent = fullUrl.slice(0, 38) + "..."
    } else if (window.innerWidth >= 600 && window.innerWidth < 1100) {
        fullLink.textContent = fullUrl.slice(0, 50) + "..."
    } else {
        fullLink.textContent = fullUrl.slice(0, 36) + "..."
    }
    shortenLink.textContent = shortUrl
    copyBtn.textContent = "Copy"
    fullLink.classList.add("full-link")
    copyBtn.classList.add("copy-btn")
    copyBtn.addEventListener("click", function() {
        copyBtn.style.backgroundColor = "hsl(257, 27%, 26%)"
        copyBtn.textContent = "Copied!"
        setTimeout(function() {
            copyBtn.style.backgroundColor = "hsl(180, 66%, 49%)"
            copyBtn.textContent = "Copy"
        }, 4000);
        navigator.clipboard.writeText(shortenLink.textContent)
        alert("Copied the text: " + shortenLink.textContent)
    })
    urlDiv.append(fullLink, hr, shortenLink, copyBtn)
    urlDiv.classList.add("url-div")
    savedUrls.appendChild(urlDiv)
}

function displayUrl(urlData) {
    createUrlCard(urlData.result.original_link, urlData.result.short_link)    
    localStorage.setItem(urlData.result.short_link, urlData.result.original_link)
}

function displayUrlFromLocalStorage() {
    let keys = Object.keys(localStorage)
    for (let i = 0; i < keys.length; i++) {
        if (isValidUrl(keys[i])) {
            createUrlCard(localStorage.getItem(keys[i]), keys[i])
        }
    }
}

function normalStyling() {
    input.style.border = "none"
    document.querySelector(".form").style.height = "80px"
    errorMsg.style.display = "span"
    errorMsg.textContent = ""
}

/* GSAP animations */
gsap.from(".background", {opacity: 0, duration: 1.5, y: -50})
gsap.from("#input", {width: 0, duration: 2})