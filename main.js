function login(){

const username = document.getElementById("username").value
const password = document.getElementById("password").value

if(username === "admin" && password === "admin123"){

window.location.href = "main.html"

}else{

alert("Invalid Credentials")

}

}

const loadissues =  () => {
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then((res) => res.json())
    .then((json) => displayIssues(json.data))
}

const displayIssues = (issues) => {
    const container = document.getElementById("issuesContainer");
    container.innerHTML = "";
    for(let issue of issues){
        const card = document.createElement("div");
        card.innerHTML = `
        <h3>${issue.title}</h3>
        <p>${issue.description}</p>
        <p>Status: ${issue.status}</p>
        `
        card.classList.add("card");
        card.style.borderTop = issue.status === "open" ? "5px solid green" : "5px solid red";
        container.appendChild(card);
    }
}

loadissues()

