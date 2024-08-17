const CODEMOD_REPO_PULL_REQUESTS =
  "https://api.github.com/repos/codemod-com/codemod/pulls";

async function getPullRequestTitles() {
  const params = new URLSearchParams({
    state: "closed",
    sort: "created",
    direction: "desc",
    base: "main",
  });

  try {
    const response = await fetch(`${CODEMOD_REPO_PULL_REQUESTS}?${params}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const pullRequests = await response.json();
    return pullRequests.map((pullRequest) => pullRequest.title);
  } catch (error) {
    console.error("Failed to fetch pull requests:", error);
    return [];
  }
}

async function generateReleaseNotes() {
  const titles = await getPullRequestTitles();
  let releaseNotes = "## Release Notes\n\n";
  titles.forEach((title) => {
    releaseNotes += `- ${title}\n`;
  });
  return releaseNotes;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateReleaseNotes()
    .then((releaseNotes) => console.log(releaseNotes))
    .catch((error) => console.error(error));
}
