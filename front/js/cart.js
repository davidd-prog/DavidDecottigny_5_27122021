// Récupération des produits présents dans le localStorage
let productsCheck = JSON.parse(localStorage.getItem("productKeys"));
console.log(productsCheck);

// Sélection de la section pour l'injection des produits dans le DOM
const cartSelector = document.querySelector("#cart__items");
console.log(cartSelector);

// Si le panier est vide :
if (productsCheck == null) {
  cartSelector.innerHTML = `<p>Votre panier est vide</p>`;
} else {
  //   console.log("Le panier n'est pas vide");

  // Création d'un tableau support pour accueillir les tours de boucle du localStorage
  let cartProductsSupport = [];

  // Incrémentation en boucle des infos du localStorage
  for (i = 0; i < productsCheck.length; i++) {
    // console.log(productsCheck.length);
    cartProductsSupport =
      cartProductsSupport +
      `<article
                class="cart__item"
                data-id="${productsCheck[i].id}"
                data-color="${productsCheck[i].colors}"
              >
                <div class="cart__item__img">
                  <img
                    src="${productsCheck[i].imageUrl}"
                    alt="${productsCheck[i].altTxt}"
                  />
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${productsCheck[i].name}</h2>
                    <p>${productsCheck[i].colors}</p>
                    <p>${productsCheck[i].price}</p>
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
  // Injection du tableau dans le DOM
  cartSelector.innerHTML = cartProductsSupport;
}
