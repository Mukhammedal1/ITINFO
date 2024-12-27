async function getAuthors() {
  let accessToken = localStorage.getItem("accesToken");
  const accesTokenExpTime = getTokenExpiration(accessToken);

  if (accesTokenExpTime) {
    const currentTime = new Date();
    if (currentTime < accesTokenExpTime) {
      console.log("Acces Token faol");
    } else {
      console.log("Access Token vaqti chiqib ketdi");
      accessToken = await refreshTokenFunc();
      console.log("NewAccessToken", accessToken);
    }
  }

  fetch("http://45.130.148.240:3030/api/author/all", {
    method: "GET",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    mode: "cors",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("Request failed with status:" + response.status);
      }
    })
    .then((authors) => {
      displayAuthor(authors);
    })
    .catch((error) => {
      console.error(error);
    });
}

function displayAuthor(authors) {
  const authorList = document.getElementById("author-list");
  authors.forEach((author) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${author.first_name}-${author.last_name}-${author.email}`;
    authorList.appendChild(listItem);
  });
}

function getTokenExpiration(token) {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  if (decodedToken.exp) {
    return new Date(decodedToken.exp * 1000);
  }
  return null;
}

async function refreshTokenFunc() {
  try {
    const response = await fetch("http://45.130.148.240:3030/api/author/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    // console.log(data)
    if (data.error && data.error == "jwt expired") {
      console.log("Refresh tokenni ham vaqti chiqib ketdi");
      return window.location.replace("/login_author");
    }
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.log("RefreshToken:", error);
    return window.location.replace("/login_author");
  }
}
