// Récupération de l'id produit

let params = new URL(window.location).searchParams;
let productId = params.get("id");

// Contact avec l'API pour les infos du produit concerné

const getProduct = async () => {
  await fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => res.json())
    .then((response) => {
      product = response;
      // console.log(product);
    })
    // Alerte en cas d'erreur de chargement de l'API
    .catch((error) => {
      product = false;
      alert("Impossible de charger les informations de ce produit");
    });
};

// appel de la fonction pour récupérer la promise
getProduct();

// Complétion des informations produit sur la page

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
    const itemSelector = document.querySelector(".item");
    itemSelector.innerHTML = `<p>Ce produit n'existe pas</p>`;
    itemSelector.style.background = "red";
  }
};

displayProduct();

// Envoyer les données produits vers le panier

// Sélection du bouton "Ajouter au panier" pour le click-event
const sendToCart = document.querySelector("#addToCart");
// console.log(sendToCart);

// Click event sur le bouton "Ajouter au panier"
sendToCart.addEventListener("click", (event) => {
  event.preventDefault();

  // Récupération des couleurs
  const colorChoice = document.querySelector("#colors");
  const colorSelect = colorChoice.value;
  // console.log(colorSelect);

  // Récupération de la quantité
  const quantityChoice = document.querySelector("#quantity");
  const quantitySelect = quantityChoice.value;
  // console.log(quantitySelect);

  // Récupération des infos à envoyer vers le panier
  let productKeys = {
    id: productId,
    quantity: quantitySelect,
    colors: colorSelect,
  };
  // console.log(productKeys);

  // Vérification de la validité des options choisies
  if (colorSelect === "") {
    alert("Veuillez choisir une couleur pour votre produit");
  } else if (quantitySelect <= 0 || quantitySelect > 100) {
    alert("Veuillez choisir une quantité valide comprise entre 0 et 100");
  } else {
    // console.log(productKeys);
  }

  // Gestion du localStorage

  // Check des produits présents dans le localStorage

  let productsCheck = JSON.parse(localStorage.getItem("keyProduct"));

  // Conditions pour l'ajout de nouveaux objets dans le localStorage

  // constante transfert du produit vers le localStorage
  const productValidate = () => {
    productsCheck.push(productKeys);
    localStorage.setItem("keyProduct", JSON.stringify(productsCheck));
  };

  if (productsCheck == null) {
    productsCheck = [];
    productValidate();
  } else {
    productValidate();
  }
  console.log(productsCheck);
});
