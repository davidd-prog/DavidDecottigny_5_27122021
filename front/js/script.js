// Prise de contact avec l'API et récupération des données

const getProducts = async () => {
  await fetch("http://localhost:3000/api/products")
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((response) => {
      products = response;
      // console.log(products);
    })
    .catch(() => {
      document.querySelector("#items").innerHTML =
        "L'affichage de nos produits est impossible à cause d'un soucis de connexion";
      document.querySelector("#items").style.background = "red";
    });
};

//Affichage des produits sur la page index.html

const displayProducts = async () => {
  await getProducts();
  products.forEach(function (product) {
    document.querySelector(
      "#items"
    ).innerHTML += `<a href="./product.html?id=${product._id}">
            <article>
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
          </a>`;
  });
};

// Appel de la fonction afin d'afficher les produits
displayProducts();
