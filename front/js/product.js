// Déclaration de constantes

const imagePlace = document.querySelector(".item__img");
const namePlace = document.querySelector("#title");
const pricePlace = document.querySelector("#price");
const descriptionPlace = document.querySelector("#description");
const colorPlace = document.querySelector("#colors");
console.log(pricePlace);
// Récupération de l'id produit

let params = new URL(window.location).searchParams;
let productId = params.get("id");
console.log(productId);

// Contact avec l'API pour les infos du produit concerné

const getProduct = async () => {
  await fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => res.json())
    .then((response) => {
      product = response;
      console.log(product);
    })
    // Alerte en cas d'erreur de chargement de l'API
    .catch((error) => {
      alert("Impossible de charger les informations de ce produit");
    });
};

// appel de la fonction pour récupérer la promise
getProduct();

// Complétion des informations produit sur la page

const displayProduct = async () => {
  await getProduct();
  imagePlace.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
  namePlace.innerHTML = `<h1 id="title">${product.name}</h1>`;
  pricePlace.innerHTML = `<span id="price">${product.price}</span>`;
  descriptionPlace.innerHTML = `<p id="description">${product.description}</p>`;
};

const displayColors = async () => {
  await getProduct();
  product.colors.forEach(function (color) {
    colorPlace.innerHTML += `<option value="${color}">${color}</option></p>`;
  });
  console.log(product.color);
};

displayColors();
displayProduct();
console.log(colorPlace);
