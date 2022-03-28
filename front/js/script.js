// Prise de contact avec l'API et récupération des données
// méthode fetch dont résulte une promise traitée ou
// non en cas d'erreur.

const getProducts = async () => {
  await fetch("http://localhost:3000/api/products")
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((response) => {
      products = response;
    })
    .catch(() => {
      document.querySelector("#items").innerHTML =
        "L'affichage de nos produits est impossible à cause d'un soucis de connexion";
      document.querySelector("#items").style.background = "red";
    });
};

//Collecte des données produits via une boucle
// et affichage des produits par l'appel de la fonction

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

displayProducts();
