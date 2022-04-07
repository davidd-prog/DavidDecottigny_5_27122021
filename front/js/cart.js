// Récupération des données produit et déclaration de variables
let productsCheck = JSON.parse(localStorage.getItem("productKeys"));

const cartSelector = document.querySelector("#cart__items");
const formRemove = document.querySelector(".cart__order__form");

const getProduct = async (productId) => {
  await fetch(`http://localhost:3000/api/products/${productId}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((response) => {
      product = response;
    })
    .catch((error) => {
      product = false;
      alert("Impossible de charger les informations de ce produit");
    });
};

// Fonction gérant l'affichage lorsque le panier est vide puis
// mise en place de l'affichage des produits du panier par la création d'un tableau dans lequel
// je boucle pour incrémenter les différents produits présents dans le localStorage dans le tableau support
// que j'injecte ensuite dans le DOM
// j'appelle les fonctions de mise à jour des quantités et de suppression des produits afin de pouvoir
// afficher dynamiquement un panier mis à jour.
const emptyCartMessage = () => {
  let emptyCartMessageSelector = document.createElement("p");
  emptyCartMessageSelector.textContent = "Votre panier est vide";
  cartSelector.innerHTML = "";
  cartSelector.appendChild(emptyCartMessageSelector);
  formRemove.style.display = "none";
};

const displayProductCart = async () => {
  if (
    productsCheck == null ||
    undefined == productsCheck ||
    productsCheck.length == 0
  ) {
    emptyCartMessage();
  } else {
    let cartProductsSupport = [];

    for (i = 0; i < productsCheck.length; i++) {
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

    cartSelector.innerHTML = cartProductsSupport;
    quantityUpdate();
    productRemove();
  }
};
displayProductCart();

// Gestion du nombre total d'articles dans le panier et montant total du panier
// Fonction calculant la quantité totale d'articles dans le panier
const totalProductsQuantity = () => {
  productsCheck = JSON.parse(localStorage.getItem("productKeys"));
  const totalQuantitySelector = document.querySelector("#totalQuantity");
  let quantity = 0;

  if (
    productsCheck != null &&
    undefined != productsCheck &&
    productsCheck.length > 0
  ) {
    productsCheck.forEach((cartProduct) => {
      quantity += cartProduct.quantity;
    });
  }

  totalQuantitySelector.textContent = quantity;
};
totalProductsQuantity();

// Fonction calculant le prix total du panier et insertion dans le DOM
const totalProductsPrice = async () => {
  productsCheck = JSON.parse(localStorage.getItem("productKeys"));
  const totalPriceSelector = document.querySelector("#totalPrice");
  let totalPrice = 0;

  if (
    productsCheck != null &&
    undefined != productsCheck &&
    productsCheck.length > 0
  ) {
    for (var i = 0; i < productsCheck.length; i++) {
      await getProduct(productsCheck[i].id);
      totalPrice += productsCheck[i].quantity * product.price;
    }
  }
  totalPriceSelector.textContent = totalPrice;
};
totalProductsPrice();

// Fonction validant la mise à jour des quantités dans le panier, boucle récupérant les inputs de quantité mis à jour dynamiquement
// et si la valeur de l'input est valide, je récupère l'index du produit correspondant en id et couleur puis modification et mise à jour de la valeur
// de la quantité du produit dans le localStorage puis appel des fonctions de quantité totale et de prix total afin pour la mise à jour dynamique du panier
const quantityUpdate = () => {
  quantitiesInput = document.querySelectorAll(".itemQuantity");

  productsCheck.forEach(function (product, i) {
    quantitiesInput[i].addEventListener("change", (event) => {
      event.preventDefault();

      if (quantitiesInput[i].value > 0 && quantitiesInput[i].value <= 100) {
        const productIndex = productsCheck.findIndex(
          (element) =>
            element.id === product.id && element.color === product.color
        );

        productsCheck[productIndex].quantity = Number(quantitiesInput[i].value);
        localStorage.setItem("productKeys", JSON.stringify(productsCheck));

        totalProductsQuantity();
        totalProductsPrice();
      } else {
        alert("Veuillez sélectionner une quantité entre 1 et 100");
      }
    });
  });
};

// Gestion de la suppression d'un article de la page panier
// affectation de l'id et de la couleur du produit cliqué puis filtre de tous ceux non identifiés
// puisque conservés pour mise à jour du localStorage et l'affichage du panier, rappel des fonctions de totaux pour mise à jour
// dynamique du panier. Alerte de confirmation de la suppression du produit puis rappel de l'insertion de message et suppression du formulaire
// en cas de panier vide après suppression du dernier produit.
const productRemove = () => {
  let deleteButton = document.querySelectorAll(".deleteItem");

  deleteButton.forEach(function (product, i) {
    deleteButton[i].addEventListener("click", (event) => {
      event.preventDefault();
      if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
        const idDelete = productsCheck[i].id;
        const colorDelete = productsCheck[i].color;
        const returnedStorage = productsCheck.filter(
          (product) => product.id !== idDelete || product.color !== colorDelete
        );
        localStorage.setItem("productKeys", JSON.stringify(returnedStorage));
        totalProductsQuantity();
        totalProductsPrice();
        alert("Ce produit a bien été supprimé");
        if (productsCheck.length == 0) {
          emptyCartMessage();
        } else {
          displayProductCart();
        }
      }
    });
  });
};

// Gestion du formulaire

// Fonction de vérification du prénom
const firstNameInputCheking = () => {
  let firstNameInputCheking = false;
  let firstNameSelector = document.getElementById("firstName");
  let firstNameValue = firstNameSelector.value;
  let firstNameErrorMessage = document.getElementById("firstNameErrorMsg");
  let firstNameRegex = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç' ,.'-]{3,15}$");
  if (firstNameRegex.test(firstNameValue)) {
    firstNameErrorMessage.textContent = "prénom valide";
    firstNameErrorMessage.style.color = "green";
    firstNameInputCheking = true;
  } else {
    firstNameErrorMessage.style.color = "red";
    firstNameErrorMessage.textContent =
      "Veuillez renseigner votre prénom s'il vous plaît";
  }
  return firstNameInputCheking;
};

// Fonction de vérification immédiate de la validité du prénom
const firstNameChangeAlert = () => {
  let firstNameSelector = document.getElementById("firstName");
  firstNameSelector.addEventListener("change", (event) => {
    event.preventDefault();
    firstNameInputCheking();
  });
};
firstNameChangeAlert();

// Fonction de vérification du nom
const lastNameInputCheking = () => {
  let lastNameInputCheking = false;
  let lastNameSelector = document.getElementById("lastName");
  let lastNameValue = lastNameSelector.value;
  let lastNameErrorMessage = document.getElementById("lastNameErrorMsg");
  let lastNameRegex = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]{1,25}$");
  if (lastNameRegex.test(lastNameValue)) {
    lastNameErrorMessage.textContent = "Nom valide";
    lastNameErrorMessage.style.color = "green";
    lastNameInputCheking = true;
  } else {
    lastNameErrorMessage.style.color = "red";
    lastNameErrorMessage.textContent =
      "Veuillez renseigner votre nom s'il vous plaît";
  }
  return lastNameInputCheking;
};

// Fonction de vérification immédiate de la validité du nom
const lastNameChangeAlert = () => {
  let lastNameSelector = document.getElementById("lastName");
  lastNameSelector.addEventListener("change", (event) => {
    event.preventDefault();
    lastNameInputCheking();
  });
};
lastNameChangeAlert();

// Fonction de vérification de l'adresse
const addressInputCheking = () => {
  let addressInputCheking = false;
  let addressSelector = document.getElementById("address");
  let addressValue = addressSelector.value;
  let addressErrorMessage = document.getElementById("addressErrorMsg");
  let addressRegex = new RegExp(
    "^[0-9]{1,3}[a-z]{0,3}[,. ]{1}[ ]{0,1}[-a-zA-Zàâäéèêëïîôöùûüç']+"
  );
  if (addressRegex.test(addressValue)) {
    addressErrorMessage.textContent = "Adresse valide";
    addressErrorMessage.style.color = "green";
    addressInputCheking = true;
  } else {
    addressErrorMessage.style.color = "red";
    addressErrorMessage.textContent =
      "Veuillez renseigner votre adresse s'il vous plaît";
  }
  return addressInputCheking;
};

// Fonction de vérification immédiate de la validité de l'adresse
const addressChangeAlert = () => {
  let addressNameSelector = document.getElementById("address");
  addressNameSelector.addEventListener("change", (event) => {
    event.preventDefault();
    addressInputCheking();
  });
};
addressChangeAlert();

// Fonction de vérification de la ville
const cityInputCheking = () => {
  let cityInputCheking = false;
  let citySelector = document.getElementById("city");
  let cityValue = citySelector.value;
  let cityErrorMessage = document.getElementById("cityErrorMsg");
  let cityRegex = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$");
  if (cityRegex.test(cityValue)) {
    cityErrorMessage.textContent = "Ville valide";
    cityErrorMessage.style.color = "green";
    cityInputCheking = true;
  } else {
    cityErrorMessage.style.color = "red";
    cityErrorMessage.textContent =
      "Veuillez renseigner votre ville s'il vous plaît";
  }
  return cityInputCheking;
};

// Fonction de vérification immédiate de la validité de la ville
const cityChangeAlert = () => {
  let cityNameSelector = document.getElementById("city");
  cityNameSelector.addEventListener("change", (event) => {
    event.preventDefault();
    cityInputCheking();
  });
};
cityChangeAlert();

// Fonction de vérification de l'email
const emailInputCheking = () => {
  let emailInputCheking = false;
  let emailSelector = document.getElementById("email");
  let emailValue = emailSelector.value;
  let emailErrorMessage = document.getElementById("emailErrorMsg");
  let emailRegex = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
  );
  if (emailRegex.test(emailValue)) {
    emailErrorMessage.textContent = "email valide";
    emailErrorMessage.style.color = "green";
    emailInputCheking = true;
  } else {
    emailErrorMessage.style.color = "red";
    emailErrorMessage.textContent =
      "Veuillez renseigner votre email s'il vous plaît";
  }
  return emailInputCheking;
};

// Fonction de vérification immédiate de la validité de l'email
const emailChangeAlert = () => {
  let emailNameSelector = document.getElementById("email");
  emailNameSelector.addEventListener("change", (event) => {
    event.preventDefault();
    emailInputCheking();
  });
};
emailChangeAlert();

// Envoi du formulaire

const submitForm = () => {
  let orderSelector = document.getElementById("order");

  orderSelector.addEventListener("click", (event) => {
    event.preventDefault();

    let validFirstName = firstNameInputCheking();
    let validlastName = lastNameInputCheking();
    let validAddress = addressInputCheking();
    let validCity = cityInputCheking();
    let validEmail = emailInputCheking();

    if (
      validFirstName &&
      validlastName &&
      validAddress &&
      validCity &&
      validEmail &&
      productsCheck.length != 0
    ) {
      let contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value,
      };
      let products = [];
      for (i = 0; i < productsCheck.length; i++) {
        products.push(productsCheck[i]["id"]);
      }
      var order = {
        contact,
        products,
      };
    } else {
      alert("Données erronées");
    }
    var init = {
      method: "POST",
      body: JSON.stringify(order),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    // requête POST sur l'API et récupération de l'identifiant de commande dans l'URL
    const postOrder = () => {
      if (
        validFirstName &&
        validlastName &&
        validAddress &&
        validCity &&
        validEmail
      ) {
        fetch("http://localhost:3000/api/products/order", init)
          .then((res) => {
            return res.json();
          })
          .then((order) => {
            localStorage.removeItem("productKeys");
            document.location.href = `confirmation.html?orderId=${order.orderId}`;
          })
          .catch((error) => {
            alert("error");
          });
      }
    };
    postOrder();
  });
};
submitForm();
