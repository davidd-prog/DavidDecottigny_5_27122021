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
