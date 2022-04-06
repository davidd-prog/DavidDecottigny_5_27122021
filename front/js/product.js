// Récupération de l'id produit et contact ou non avec l'API pour les données du produit concerné

let params = new URL(window.location).searchParams;
let productId = params.get("id");

const getProduct = async () => {
  await fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => res.json())
    .then((response) => {
      product = response;
    })
    .catch((error) => {
      product = false;
      alert("Impossible de charger les informations de ce produit");
    });
};

// Complétion des informations produit sur la page
// Ciblage dans le DOM et boucle pour complétion des données du produit
// Ou affichage d'un message d'erreur

const displayProduct = async () => {
  await getProduct();
  if (Object.keys(product).length > 0) {
    const imageSelector = document.querySelector(".item__img");
    const nameSelector = document.querySelector("#title");
    const priceSelector = document.querySelector("#price");
    const descriptionSelector = document.querySelector("#description");
    const colorSelector = document.querySelector("#colors");
    imageSelector.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    nameSelector.innerHTML = `<h1 id="title">${product.name}</h1>`;
    priceSelector.innerHTML = `<span id="price">${product.price}</span>`;
    descriptionSelector.innerHTML = `<p id="description">${product.description}</p>`;
    product.colors.forEach(function (color) {
      colorSelector.innerHTML += `<option value="${color}">${color}</option></p>`;
    });
  } else {
    const errorMessage = () => {
      const itemSelector = document.querySelector(".item");
      const newParagraph = document.createElement("p");
      const messageSelector = document.querySelector("p");
      itemSelector.appendChild(newParagraph);
      const newContent = document.createTextNode("Ce produit n'existe pas");
      newParagraph.appendChild(newContent);
    };
    errorMessage();
    articleSelector = document.querySelector("article");
    console.log(articleSelector);
    articleSelector.style.display = "none";
  }
};

displayProduct();

// Envoyer les données produits vers le panier

const sendToCart = document.querySelector("#addToCart");

sendToCart.addEventListener("click", (event) => {
  event.preventDefault();

  const colorChoice = document.querySelector("#colors");
  const colorSelect = colorChoice.value;
  const quantityChoice = document.querySelector("#quantity");
  const quantitySelect = quantityChoice.value;

  // Gestion du localStorage
  // Ciblage dans le DOM, préparation et conditions de l'envoi du produit

  if (colorSelect === "") {
    alert("Veuillez choisir une couleur pour votre produit");
  } else if (quantitySelect <= 0 || quantitySelect > 100) {
    alert("Veuillez choisir une quantité valide comprise entre 0 et 100");
  } else {
    let productKeys = {
      id: productId,
      quantity: Number(quantitySelect),
      colors: colorSelect,
    };

    let productsCheck = JSON.parse(localStorage.getItem("productKeys"));

    const productValidate = () => {
      productsCheck.push(productKeys);
      localStorage.setItem("productKeys", JSON.stringify(productsCheck));
    };

    const popUpConfirmation = () => {
      if (
        window.confirm(`${quantitySelect} canapé ${product.name} de couleur 
        ${colorSelect} a bien été ajouté au panier. Cliquez sur OK 
        pour consulter votre panier ou sur ANNULER pour continuer vos achats`)
      ) {
        window.location.href = "cart.html";
      } else {
        window.location.href = "index.html";
      }
    };

    if (productsCheck == null) {
      productsCheck = [];
      productValidate();
      popUpConfirmation();
    } else {
      const foundProducts = productsCheck.find(
        (element) =>
          element.id === productKeys.id && element.colors === productKeys.colors
      );
      if (foundProducts != undefined) {
        parseInt((foundProducts.quantity += productKeys.quantity));
        localStorage.setItem("productKeys", JSON.stringify(productsCheck));
        popUpConfirmation();
      } else {
        productValidate();
        popUpConfirmation();
      }
    }
  }
});
