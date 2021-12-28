/* Prise de contact avec l'API */

fetch("http://localhost:3000/api/products")
  /* Récupération du résultat de la requête */

  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })

  /* Affichage du résultat sur la page d'accueil */

  .then((jsonListProducts) => {
    for (let jsonProduct of jsonListProducts) {
      let product = new Product(jsonProduct);
      document.querySelector(
        ".items"
      ).innerHTML += `<a href="./product.html?id=${product._id}">
            <article>
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
          </a>`;
    }
  });
