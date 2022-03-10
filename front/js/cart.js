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
  // Si le panier est vide, qu'aucun élément n'est présent dans le tableau :
  if (productsCheck.length == 0) {
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
  // Récupération du localStorage
  productsCheck = JSON.parse(localStorage.getItem("productKeys"));
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
  // Récupération du localStorage
  productsCheck = JSON.parse(localStorage.getItem("productKeys"));
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
      event.preventDefault();
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

        // Je conclue en appelant les dernières mises à jour du localStorage en terme de quantité de produits et de montant total du panier
        totalProductsQuantity();
        totalProductsPrice();
      } else {
        alert("Veuillez sélectionner une quantité entre 1 et 100");
      }
    });
  });
};

// Gestion de la suppression d'un article de la page panier
const productRemove = () => {
  // console.log(productsCheck);

  //Ciblage dans le DOM des boutons de suppression
  let deleteButton = document.querySelectorAll(".deleteItem");
  // console.log(deleteButton);

  // Boucle pour retrouver le bouton de suppression correspondant au produit à supprimer
  deleteButton.forEach(function (product, i) {
    deleteButton[i].addEventListener("click", (event) => {
      event.preventDefault();
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
        // Rappel des fonctions pour mettre à jour instantanément la quantité totale des articles et le montant total
        totalProductsQuantity();
        totalProductsPrice();
        // Suppression instantanée de l'élément supprimé sur la page
        deleteButton[
          i
        ].parentElement.parentElement.parentElement.parentElement.remove();

        // Pop up de confirmation de suppression du produit
        alert("Ce produit a bien été supprimé");
        // Condition affichée sans rechargement de la page
        // Si le panier est vide
        if (productsCheck.length == 0) {
          cartSelector.innerHTML = `<p>Votre panier est vide</p>`;
        } else {
          // si le panier n'est pas vide
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
  // console.log(firstNameSelector);
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
    console.log("étape du prénom");
    firstNameInputCheking();
  });
};
firstNameChangeAlert();

// Fonction de vérification du nom
const lastNameInputCheking = () => {
  let lastNameInputCheking = false;
  let lastNameSelector = document.getElementById("lastName");
  // console.log(lastNameSelector);
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
    console.log("étape du nom");
    lastNameInputCheking();
  });
};
lastNameChangeAlert();

// Fonction de vérification de l'adresse
const addressInputCheking = () => {
  let addressInputCheking = false;
  let addressSelector = document.getElementById("address");
  // console.log(addressSelector);
  let addressValue = addressSelector.value;
  let addressErrorMessage = document.getElementById("addressErrorMsg");
  let addressRegex = new RegExp(
    "^[0-9]{1,3}[a-z]{0,3}[,. ]{1}[ ]{0,1}[-a-zA-Zàâäéèêëïîôöùûüç']+"
  );
  if (addressRegex.test(addressValue)) {
    addressErrorMessage.textContent = "Adresse valide";
    addressErrorMessage.style.color = "green"
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
    console.log("étape de l'adresse");
    addressInputCheking();
  });
};
addressChangeAlert();

// Fonction de vérification de la ville
const cityInputCheking = () => {
  let cityInputCheking = false;
  let citySelector = document.getElementById("city");
  // console.log(citySelector);
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
    console.log("étape de la ville");
    cityInputCheking();
  });
};
cityChangeAlert();

// Fonction de vérification de l'email
const emailInputCheking = () => {
  let emailInputCheking = false;
  let emailSelector = document.getElementById("email");
  // console.log(emailSelector);
  let emailValue = emailSelector.value;
  let emailErrorMessage = document.getElementById("emailErrorMsg");
  let emailRegex = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
  );
  if (emailRegex.test(emailValue)) {
    emailErrorMessage.textContent = "email valide";
    emailErrorMessage.style.color = "green"
    emailInputCheking = true;
    console.log(emailInputCheking);
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
    console.log("étape de l'email");
    emailInputCheking();
  });
};
emailChangeAlert();

// Click event pour envoi du formulaire

const submitForm = () => {
  // Ciblage du bouton commander ! dans le DOM
  let orderSelector = document.getElementById("order");

  orderSelector.addEventListener("click", (event) => {
    event.preventDefault();
    // console.log("Tout fonctionne !");

    // if (productsCheck.length != 0) {
    //   // console.log(productsCheck);
    //   // console.log("Je ne suis pas vide");

    let validFirstName = firstNameInputCheking();
    let validlastName = lastNameInputCheking();
    let validAddress = addressInputCheking();
    let validCity = cityInputCheking();
    let validEmail = emailInputCheking();
    console.log(
      validFirstName,
      validlastName,
      validAddress,
      validCity,
      validEmail
    );
    // console.log(orderSelector);
    if (
      // Si les inputs sont validés
      validFirstName &&
      validlastName &&
      validAddress &&
      validCity &&
      validEmail &&
      productsCheck.length != 0
    ) {
      // Rassemble dans une variable client les inputs recueuillis
      let contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value,
      };
      // Creation d'un tableau recueuillant les produits commandés
      let products = [];
      for (i = 0; i < productsCheck.length; i++) {
        products.push(productsCheck);
        // console.log(products);
      }
      // Regroupement des produits et des coordonnées du client
      let order = {
        contact,
        products,
      };
      console.log(order);
    } else {
      alert("Données erronées");
    }
    // requête POST sur l'API et récupération de l'identifiant de commande
    const init = {
      method: 'POST',
      body: JSON.stringify(order),
      headers: {
        "Content-type": "application/json"
      }
    };
    const postOrder = () => {
      fetch("http://localhost:3000/api/products/order", init)
        .then(() => {
          (res) =>
            res.json().then((response) => {
              productsCheck.clear();
              console.log("requête envoyée avec succès à l'API !");
              window.location.href = "confirmation.html";
            });
        })
        .catch((error) => {
          alert(
            "Une erreur s'est produite lors de la transmission des informations, veuillez réessayer ultérieurement"
          );
        });
    }
    postOrder();
    
    
  });
};
submitForm();
