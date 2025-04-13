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

  if (gitHubRepository == "") {
    repoList(gitHubUsername);
  } else {
    commitList(gitHubUsername, gitHubRepository);
  }
});

function repoList(username) {
  // Run GitHub API function, passing in the GitHub username
  requestUserRepos(username)
    .then((response) => response.json()) // parse response into json
    .then((data) => {
      // update html with data from github
      for (let i in data) {
        // Get the ul with id of userRepos
        let ul = document.getElementById("userRepos");

        // Create variable that will create li's to be added to ul
        let li = document.createElement("li");

        // Add Bootstrap list item class to each li
        li.classList.add("list-group-item");

        if (data.message === "Not Found") {
          // Create the html markup for each li
          li.innerHTML = `
                <p><strong>No account exists with username:</strong> ${username}</p>`;
          // Append each li to the ul
          ul.appendChild(li);
        } else {
          // Create the html markup for each li
          li.innerHTML = `
                <p><strong>Repo:</strong> ${data[i].name}</p>
                <p><strong>Description:</strong> ${data[i].description}</p>
                <p><strong>URL:</strong> <a href="${data[i].html_url}">${data[i].html_url}</a></p>
            `;

          // Append each li to the ul
          ul.appendChild(li);
        }
      }
    });
}

function commitList(username, repo) {
  // Run GitHub API function, passing in the GitHub username
  requestUserRepoCommits(username, repo)
    .then((response) => response.json()) // parse response into json
    .then((data) => {
      // update html with data from github
      for (let i in data) {
        // Get the ul with id of userRepos
        let divp = document.getElementById("userRepos");

        // Create variable that will create li's to be added to ul
        let div = document.createElement("div");

        // Add Bootstrap list item class to each li
        div.classList.add("row", "rounded", "bg-secondary", "mb-3", "d-flex", "flex-column", "p-2");

        if (data.message === "Not Found") {
          // Create the html markup for each li
          div.innerHTML = `
              <p class="text-start"><strong>No account exists with username:</strong> ${username}</p>
              <p class="text-start"><strong>or no repository exists with that name in the user account:</strong> ${username}</p>`;
          // Append each li to the ul
          divp.appendChild(li);
        } else {
          let hi = document.getElementById("title");
          hi.textContent = `${username}: ${repo}`;
          // Create the html markup for each li
          div.innerHTML = `
              <p class="text-start"><strong>Date:</strong> ${DateStringConfig(data[i].commit.committer.date)}</p>
              <p class="text-start"><strong>Message:</strong> ${data[i].commit.message}</p>
          `;

          // Append each li to the ul
          divp.appendChild(div);
        }
      }
    });
}

function requestUserRepos(username) {
  // create a variable to hold the `Promise` returned from `fetch`
  return Promise.resolve(fetch(`https://api.github.com/users/${username}/repos`));
}

function requestUserRepoCommits(username, repo) {
  // create a variable to hold the `Promise` returned from `fetch`
  return Promise.resolve(
    fetch(`https://api.github.com/repos/${username}/${repo}/commits`, {
      headers: {
        Authorization: TOKEN,
        Accept: "application/vnd.github + json",
      },
    })
  );
}

function DateStringConfig(date) {
  return date.replace("Z", "").replace("T", " ");
}
