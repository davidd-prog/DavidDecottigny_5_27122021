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
    // appel de la fonction afin de récupérer les valeurs des input
    quantityUpdate();
    // appel de la fonction afin de pouvoir récupérer les boutons de suppression de produits
    productRemove();
  }
};
// Appel de la fonction pour afficher le panier
displayProductCart();

// Gestion du nombre total d'articles dans le panier et montant total du panier

const totalProductsQuantity = () => {
  // Ciblage dans le DOM pour afficher la quantité totale de produits dans le panier
  const totalQuantitySelector = document.querySelector("#totalQuantity");
  // console.log(totalQuantitySelector);

  // Initialisation de la base du calcul de la quantité totale du panier
  let quantity = 0;
  // Je crée une boucle pour recueillir les quantités dans le localStorage et j'additionne les quantités croisées à chaque tour de boucle
  productsCheck.forEach((cartProduct) => {
    quantity += cartProduct.quantity;
  });

  // Insertion du résultat dans le DOM

  totalQuantitySelector.innerText = quantity;
};

// Appel de la fonction calculant le total d'articles dans le panier
totalProductsQuantity();

// Gestion du prix total du panier

const totalProductsPrice = async () => {
  // Ciblage dans le DOM pour afficher le montant total du panier
  const totalPriceSelector = document.querySelector("#totalPrice");
  // console.log(totalPriceSelector);

  // Initialisation de la base du calcul du prix total
  let totalPrice = 0;

  // Je crée une boucle pour recueillir les prix dans le localStorage et à l'aide de l'API, puis je les cumule
  for (var i = 0; i < productsCheck.length; i++) {
    await getProduct(productsCheck[i].id);
    totalPrice += productsCheck[i].quantity * product.price;
    // totalPrice.push(product.price);
  }
  // console.log(totalPrice);

  // Insertion du résultat dans le DOM
  totalPriceSelector.innerText = totalPrice;
};
totalProductsPrice();

// Gestion de la mise à jour des quantités d'articles sur la page panier

// Fonction validant la mise à jour des quantités dans le panier
const quantityUpdate = () => {
  // Ciblage dans le DOM des input de quantité
  quantitiesInput = document.querySelectorAll(".itemQuantity");
  // console.log(quantitiesInput);

  // Vérification d'accès aux infos du localStorage
  // console.log(productsCheck);

  // Boucle sollicitant la mise à jour de la quantité
  productsCheck.forEach(function (product, i) {
    // Change event sur les input de quantité
    quantitiesInput[i].addEventListener("change", (event) => {
      // Si la valeur de l'index est valide
      if (quantitiesInput[i].value > 0 && quantitiesInput[i].value <= 100) {
        // Je récupère l'index du produit ciblé en fonction de la similarité de l'id et de la couleur
        const productIndex = productsCheck.findIndex(
          (element) =>
            element.id === product.id && element.color === product.color
        );
        // puis je modifie la quantité du produit en fonction de la valeur de l'input et enregistre cette nouvelle quantité dans le localStorage
        productsCheck[productIndex].quantity = Number(quantitiesInput[i].value);
        localStorage.setItem("productKeys", JSON.stringify(productsCheck));
        // Et enfin je recharge la page mise à jour
        location.reload();
      } else {
        alert("Veuillez sélectionner une quantité entre 1 et 100");
      }
    });
  });
};

// Gestion de la suppression d'un article de la page panier
const productRemove = () => {
  // console.log(productsCheck);

  // Ciblage dans le DOM des boutons de suppression
  let deleteButton = document.querySelectorAll(".deleteItem");
  console.log(deleteButton);

  // Boucle pour retrouver le bouton de suppression correspondant au produit à supprimer
  deleteButton.forEach(function (product, i) {
    deleteButton[i].addEventListener("click", (event) => {
      if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
        // Sélection du produit à supprimer en fonction de l'id et de la couleur de l'index
        const idDelete = productsCheck[i].id;
        const colorDelete = productsCheck[i].color;
        // Renvoi des données en conservant tous les produits différents du produit cliqué
        const returnedStorage = productsCheck.filter(
          (product) => product.id !== idDelete || product.color !== colorDelete
        );
        // Stockage du tableau mis à jour dans le localStorage
        localStorage.setItem("productKeys", JSON.stringify(returnedStorage));
        // Pop up de confirmation de suppression du produit
        alert("Ce produit a bien été supprimé");
        // rechargement de la page mise à jour
        location.reload();
      }
    });
  });
};
