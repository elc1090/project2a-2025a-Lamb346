// Get the GitHub username input form
const gitHubForm = document.getElementById("gitHubForm");

// Listen for submissions on GitHub username input form
gitHubForm.addEventListener("submit", (e) => {
  // Prevent default form submission action
  e.preventDefault();

  // Get the GitHub username input field on the DOM
  let usernameInput = document.getElementById("usernameInput");

  // Get the value of the GitHub username input field
  let gitHubUsername = usernameInput.value;

  // Get the GitHub repository input field on the DOM
  let repositoryInput = document.getElementById("repositoryInput");

  // Get the value of the GitHub repository input field
  let gitHubRepository = repositoryInput.value;

  // Get the ul with id of userRepos
  let divp = document.getElementById("userRepos");

  while (divp.firstChild) {
    divp.removeChild(divp.firstChild);
  }
  let hi = document.getElementById("title");
  try {
    if (gitHubRepository == "") {
      hi.textContent = `${gitHubUsername}`;
      repoList(gitHubUsername, divp);
    } else {
      hi.textContent = `${gitHubUsername}: ${gitHubRepository}`;
      commitList(gitHubUsername, gitHubRepository, divp);
    }
  } catch (error) {
    console.error(error);
    hi.textContent = `Error`;
  }
});

function repoList(username, divp) {
  // Run GitHub API function, passing in the GitHub username
  requestUserRepos(username)
    .then((response) => {
      if (!response.ok || response.status === 404) {
        // response.status está disponível aqui
        if (response.status === 403 || response.status === 429) {
          throw new Error("Forbidden: API rate limit or permission denied.");
        } else {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
      }
      return response.json(); // só chama .json() se estiver tudo ok
    }) // parse response into json
    .then((data) => {
      // update html with data from github
      for (let i in data) {
        // Create variable that will create li's to be added to ul
        let div = document.createElement("div");

        // Add Bootstrap list item class to each li
        div.classList.add("row", "rounded", "bg-secondary", "mb-3", "d-flex", "flex-column", "p-2");

        if (data.message === "Not Found") {
          // Create the html markup for each li
          div.innerHTML = `
                <p><strong>No account exists with username:</strong> ${username}</p>`;
          // Append each li to the ul
          divp.appendChild(div);
        } else {
          // Create the html markup for each li
          div.innerHTML = `
                <p><strong>Repo:</strong> ${data[i].name}</p>
                <p><strong>Description:</strong> ${data[i].description}</p>
                <p><strong>URL:</strong> <a href="${data[i].html_url}">${data[i].html_url}</a></p>
            `;

          // Append each li to the ul
          divp.appendChild(div);
        }
      }
    });
}

function commitList(username, repo, divp) {
  // Run GitHub API function, passing in the GitHub username
  requestUserRepoCommits(username, repo)
    .then((response) => {
      if (!response.ok || response.status === 404) {
        // response.status está disponível aqui
        if (response.status === 403 || response.status === 429) {
          throw new Error("Forbidden: API rate limit or permission denied.");
        } else {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
      }
      return response.json(); // só chama .json() se estiver tudo ok
    }) // parse response into json
    .then((data) => {
      for (let i in data) {
        // Create variable that will create li's to be added to ul
        let div = document.createElement("div");

        // Add Bootstrap list item class to each li
        div.classList.add("row", "rounded", "bg-secondary", "mb-3", "d-flex", "flex-column", "p-2");

        if (data.message === "Not Found") {
          // Create the html markup for each li
          div.innerHTML = `
              <p class="text-break"><strong>No account exists with username:</strong> ${username}</p>
              <p class="text-break"><strong>or no repository exists with that name in the user account:</strong> ${username}</p>`;
          // Append each li to the ul
          divp.appendChild(div);
        } else {
          // Create the html markup for each li
          div.innerHTML = `
              <p class="text-break"><strong>Date:</strong> ${DateStringConfig(data[i].commit.committer.date)}</p>
              <p class="text-break"><strong>Message:</strong> ${data[i].commit.message}</p>
          `;

          // Append each li to the ul
          divp.appendChild(div);
        }
      }
    });
}

function requestUserRepos(username) {
  // create a variable to hold the `Promise` returned from `fetch`
  return Promise.resolve(
    fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    })
  );
}

function requestUserRepoCommits(username, repo) {
  // create a variable to hold the `Promise` returned from `fetch`
  return Promise.resolve(
    fetch(`https://api.github.com/repos/${username}/${repo}/commits`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    })
  );
}

function DateStringConfig(date) {
  return date.replace("Z", "").replace("T", " ");
}
