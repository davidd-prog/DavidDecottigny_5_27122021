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
      const errorMessage = () => {
        const itemsSelector = document.querySelector("#items");
        const newParagraph = document.createElement("p");
        newParagraph.textContent =
          "Les produits ne peuvent être affichés en raison d'un soucis de connexion";
        itemsSelector.appendChild(newParagraph);
      };
      errorMessage();
    });
};

//Collecte des données produits via une boucle
// et affichage des produits par l'appel de la fonction

const displayProducts = async () => {
  await getProducts();
  products.forEach(function (product) {
    const itemsSelector = document.querySelector("#items");

    let productLinkSelector = document.createElement("a");
    productLinkSelector.href = "./product.html?id=" + product._id;

    let productArticleSelector = document.createElement("article");

    let productImageSelector = document.createElement("img");
    productImageSelector.alt = product.altTxt;
    productImageSelector.src = product.imageUrl;

    let productNameSelector = document.createElement("h3");
    productNameSelector.textContent = product.name;
    productNameSelector.classList.add("productName");

    let productDescriptionSelector = document.createElement("p");
    productDescriptionSelector.textContent = product.description;
    productDescriptionSelector.classList.add("productdescription");

    productArticleSelector.appendChild(productImageSelector);
    productArticleSelector.appendChild(productNameSelector);
    productArticleSelector.appendChild(productDescriptionSelector);

    productLinkSelector.appendChild(productArticleSelector);

    itemsSelector.appendChild(productLinkSelector);
  });
};

displayProducts();
