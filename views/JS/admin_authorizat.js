async function getAdmins() {
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
  
  fetch("http://localhost:3030/api/admin/all", {
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
    .then((admins) => {
      displayAdmin(admins);
    })
    .catch((error) => {
      console.error(error);
    });
}

function displayAdmin(admins) {
  const adminList = document.getElementById("admin-list");
  admins.forEach((admin) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${admin.name}-${admin.email}-${admin.phone}`;
    adminList.appendChild(listItem);
  });
}

function getTokenExpiration(token) {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  // console.log(decodedToken)
  if (decodedToken.exp) {
    return new Date(decodedToken.exp * 1000);
  }
  return null;
}

async function refreshTokenFunc() {
  try {
    const response = await fetch("http://localhost:3030/api/admin/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    // console.log(data)
    if (data.error && data.error == "jwt expired") {
      console.log("Refresh tokenni ham vaqti chiqib ketdi");
      return window.location.replace("/login_admin");
    }
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.log("RefreshToken:", error);
    return window.location.replace("/login_admin");
  }
}

