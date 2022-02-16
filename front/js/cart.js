// Récupération des produits présents dans le localStorage
let productsCheck = JSON.parse(localStorage.getItem("productKeys"));
// console.log(productsCheck);

// Sélection de la section pour l'injection des produits dans le DOM
const cartSelector = document.querySelector("#cart__items");
// console.log(cartSelector);

const getProduct = async (productId) => {
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

// Mise en place de l'affichage des produits du panier
const displayProductCart = async () => {
  // Si le panier est vide :
  if (productsCheck == null) {
    cartSelector.innerHTML = `<p>Votre panier est vide</p>`;
  } else {
    //   console.log("Le panier n'est pas vide");

    // Création d'un tableau support pour accueillir les tours de boucle du localStorage
    let cartProductsSupport = [];

    // Incrémentation en boucle des infos du localStorage et de l'API
    for (i = 0; i < productsCheck.length; i++) {
      // console.log(productsCheck.length);
      await getProduct(productsCheck[i].id);
      cartProductsSupport =
        cartProductsSupport +
        `<article
                class="cart__item"
                data-id="${productsCheck[i].id}"
                data-color="${productsCheck[i].colors}"
              >
                <div class="cart__item__img">
                  <img
                    src="${product.imageUrl}"
                    alt="${product.altTxt}"
                  />
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${productsCheck[i].colors}</p>
                    <p>${product.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté :</p>
                      <input
                        type="number"
                        class="itemQuantity"
                        name="itemQuantity"
                        min="1"
                        max="100"
                        value="${productsCheck[i].quantity}"
                      />
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
    }
    // console.log(product.price);
    // Injection du tableau dans le DOM
    cartSelector.innerHTML = cartProductsSupport;
  }
};
// Appel de la fonction pour afficher le panier
displayProductCart();

// Gestion du nombre total d'articles dans le panier et montant total du panier
const totalProductsQuantity = () => {
  const totalQuantitySelector = document.querySelector("#totalQuantity");
  // console.log(totalQuantitySelector);

  // Création d'un tableau pour accueillir les quantités des produits du panier
  let totalQuantity = [];

  // Je crée une boucle pour recueillir les quantités dans le localStorage et je les push dans le tableau
  productsCheck.forEach((cartProduct) => {
    totalQuantity.push(cartProduct.quantity);
  });

  // Addition des quantités et insertion du résultat dans le DOM
  totalQuantitySelector.innerText = eval(totalQuantity.join("+"));
};

// Appel de la fonction calculant le total d'articles dans le panier
totalProductsQuantity();

// Gestion du prix total du panier

const totalProductsPrice = async () => {
  const totalPriceSelector = document.querySelector("#totalPrice");
  // console.log(totalPriceSelector);

  // Création d'un tableau pour accueillir les prix des produits du panier
  let totalPrice = [];

  // Je crée une boucle pour recueillir les prix dans le localStorage et à l'aide de l'API, puis je les push dans le tableau
  for (j = 0; j < productsCheck.length; j++) {
    await getProduct(productsCheck[j].id);

    totalPrice.push(product.price);
  }
  console.log(totalPrice);

  // Addition des quantités et insertion du résultat dans le DOM
  totalPriceSelector.innerText = eval(totalPrice.join("+"));
};
totalProductsPrice();
