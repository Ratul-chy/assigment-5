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

    for (let issue of issues) {

        const card = document.createElement("div");

        const statusImg = issue.status === "open"
        ? "./assets/open.png"
        : "./assets/closed.png";

        const labelAdd = issue.label
        ? `<span class="badge">${issue.label}</span>`
        : "";

        card.innerHTML = `

        <div class="issue-card space-y-4 shadow-sm p-4 rounded-lg">

            <!-- card status img -->
            <div class="card-img-priority flex justify-between items-center">

                <div>
                    <img width="30px" src="${statusImg}" alt="">
                </div>

                <button class="btn btn-soft btn-secondary rounded-full">
                    ${issue.priority}
                </button>

            </div>

            <!-- card header -->
            <div class="card-header space-y-2">

                <h2 class="font-semibold">${issue.title}</h2>

                <p class="text-[#64748B] text-[14px]">
                    ${issue.description}
                </p>

            </div>

            <!-- label -->
            ${labelAdd}

            <!-- date -->
            <div class="date py-4 border-t border-[#64748B]">

                <p class="text-[#64748B]">
                    #${issue.id} by ${issue.author}
                </p>

                <p class="text-[#64748B]">
                    ${new Date(issue.createdAt).toLocaleDateString()}
                </p>

            </div>

        </div>
        `;

        card.classList.add("card");

        card.style.borderTop =
        issue.status === "open"
        ? "5px solid green"
        : "5px solid red";

        container.appendChild(card);
    }
}

loadissues()

