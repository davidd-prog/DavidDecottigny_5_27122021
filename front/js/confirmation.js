// Récupération du numéro de commande

let params = new URL(window.location).searchParams;
let orderId = params.get("orderId");

// Insertion du numéro de commande dans le DOM

const getOrderNumber = async () => {
  let orderNumber = document.querySelector("#orderId");
  orderNumber.textContent = orderId;
};

getOrderNumber();
