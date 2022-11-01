import {CartItem} from "../modal/cartItem.js";

let productList = [];

let cartList = [];

//------------------ Popup Cart --------------------
const cartShow = document.querySelector(".fa-shopping-cart");
const cartClose = document.querySelector(".fa-times");
cartShow.addEventListener("click", function () {
  document.querySelector(".card__total").style.right = "0";
  document.querySelector(".card__overlay").style.display = "block";
});
cartClose.addEventListener("click", function () {
  document.querySelector(".card__total").style.right = "-100%";
  document.querySelector(".card__overlay").style.display = "none";
});

// 3)--------- Hiển thị danh sách sản phẩm ---------
const renderProduct = (data) => {
  if (!data) data = productList;

  let tableHTML = "";

  for (let i in data) {
    let productItem = data[i];
    tableHTML += `
      <div class="col shopping__item">

        <div class="shopping__header">
          <i class="fa fa-heart icon1"></i>
          <i class="fa fa-shopping-cart icon2"></i>
        </div>
      
        <div class="shopping__body">
        <a href="#" 
          ><img
            src="${productItem.img}"
            width="180px"
        /></a>
        <div class="shopping__text text-center">
          <h2 class="cartProduct">${productItem.name}</h2>
          <h3>$<span class="price">${productItem.price}</span></h3>
        </div>
        </div>
        
        <div class="shopping__footer">
          <div class="shopping__size d-flex">
            <h4 class="">Size:</h4>
            <span><button class="btn btn-secondary">64GB</button></span>
            <span><button class="btn btn-secondary">128GB</button></span>
            <span><button class="btn btn-secondary">256GB</button></span>
            <span><button class="btn btn-secondary">512GB</button></span>
          </div>
          <div class="shopping__color d-flex mt-3">
            <h4>Color:</h4>
            <span><button class="btn btn-success"></button></span>
            <span><button class="btn btn-danger"></button></span>
            <span><button class="btn btn-dark"></button></span>
          </div>
          <div class="shopping__cpu">
            <div class="screen d-flex">
              <i class="fa fa-mobile-alt"></i>
              <p>${productItem.screen}</p>
            </div>
            <div class="backFront d-flex">
              <i class="fa fa-camera"></i>
              <p><span>${productItem.backCamera}</span> + <span>${productItem.frontCamera}</span></p>
            </div>
            <div class="desc d-flex">
              <i class="fa fa-database"></i>
              <p>${productItem.desc}</p>
            </div>
            <div class="type d-flex">
              <i class="fa fa-tablet-alt"></i>
              <p>${productItem.type}</p>
            </div>
        </div>
        <div class="shopping__buy">
          <button  class="btn btn-success buy">
            Buy now
          </button>
          <button onclick="addCart(${i})" class="btn btn-success add">
            Add
          </button>
        </div>
      </div>

    </div>
    `;
  }
  document.querySelector("#cartProduct").innerHTML = tableHTML;
};

// ------- Call API lụm danh sách sản phẩm về -------
const getProduct = async () => {
  try {
    const res = await axios({
      url: "https://6336fc755327df4c43cdbe89.mockapi.io/ProductCart/",
      method: "GET",
    });
    console.log(res.data);
    productList = [...res.data];
    renderProduct();
  } catch (error) {
    console.log(error);
  }
};

// 4) --------------- Select Cart  ---------------
window.onChange = () => {
  let result = [];
  let typeSelection = document.getElementById("typeSelection").value;
  if (!typeSelection) {
    result = [...productList]; //biến đổi array qua obj
    console.log(result);
  } else {
    for (let i in productList) {
      if (productList[i].type == typeSelection) result.push(productList[i]);
    }
  }
  renderProduct(result);
};

// 5) ----------------- Add Cart  ---------------
window.addCart = (index) => {
  let productItem = productList[index];
  let checkID = cartList.find((item) => item.product.id === productItem.id);

  if (checkID) checkID.quantity += 1;
  else {
    let cartItem = new CartItem(
      productItem.id,
      productItem.name,
      productItem.price,
      productItem.screen,
      productItem.backCamera,
      productItem.frontCamera,
      productItem.img,
      productItem.desc,
      productItem.type,
      1
    );
    cartList.push(cartItem);
  }
  updateCartList(cartList);
  renderCart(cartList);
  setLocalCartList(cartList);
};

const renderCart = (cartList) => {
  let renderCartItem = cartList.map((item, index) => {
    return `<div
    class="cart__content d-flex justify-content-between align-items-center text-center row py-3"
  >
    <div class="col cart__img">
      <img src="${item.product.img}" width="150px" class="rounded" />
    </div>
    <div class="col cart__name text-white">
      <h3>${item.product.name}</h3>
    </div>
    <div class="col cart__quantity">
      <span class="qty-change">
        <div class="d-flex ml-3 mt-3">
          <button onclick="updownQuantity(${item.product.id},-1),${index}" type="button" class="btnQuantity">
            <i class="fas fa-chevron-left text-white"></i>
          </button>
          <h4 class="quantity text-white pl-2 pr-2">${item.quantity}</h4>
          <button onclick="updownQuantity(${item.product.id},1),${index}" type="button" class="btnQuantity">
            <i class="fas fa-chevron-right text-white"></i>
          </button>
        </div>
      </span>
    </div>
    <div class="col cart__price text-white">
      <h4 class="price" id="price">$${item.product.price}</h4>
    </div>
    <div class="col cart__iconTrash">
      <i onclick="deleteCart(${index})" class="fa fa-trash-alt iconTrash ml-2"></i>
    </div>
  </div> `;
  });

  let totalPrice = 0;
  for (let i in cartList) {
    totalPrice += cartList[i].quantity * (cartList[i].product.price * 1);
  }

  document.getElementById("total").innerHTML = totalPrice;
  document.getElementById("cart").innerHTML = renderCartItem;
};
// ---------- Lưu sản phẩm khi add dưới trang web -------
const setLocalCartList = () => {
  // JSON.stringify : chuyển object sang chuỗi (vì data dưới web chỉ chấp nhận dạng chuỗi)
  let cartListJSON = JSON.stringify(cartList);

  localStorage.setItem("CartList", cartListJSON);
};

// -------- Lưu sản phẩm khi refesh lại trang  -------
const getLocalCartList = () => {
  let cartListJSON = localStorage.getItem("CartList");

  if (!cartListJSON) return;

  // JSON.parse : chuyển chuỗi sang mảng
  cartList = mapData(JSON.parse(cartListJSON));
  renderCart(cartList);
};

const mapData = (cartListJSON) => {
  let result = [];

  for (let i in cartListJSON) {
    let oldCartItem = cartListJSON[i];
    let newCartItem = new CartItem(
      oldCartItem.product.id,
      oldCartItem.product.name,
      oldCartItem.product.price,
      oldCartItem.product.screen,
      oldCartItem.product.backCamera,
      oldCartItem.product.frontCamera,
      oldCartItem.product.img,
      oldCartItem.product.des,
      oldCartItem.product.type,
      oldCartItem.quantity
    );
    result.push(newCartItem);
  }
  return result;
};

let updateCartList = (cartList) => {
  let cartListQuantity = 0;

  for (let i in cartList) {
    cartListQuantity += cartList[i].quantity;
  }

  document.getElementById("cartTotal").innerHTML = cartListQuantity;
};

// 9)------------------ Up Down Quantity ---------------
window.updownQuantity = (id, status, index) => {
  let currentCartList = cartList.find((item) => {
    return item.product.id == id;
  });
  currentCartList.quantity += status;
  if (currentCartList.quantity <= 0) deleteCart(index);
  console.log(currentCartList);
  updateCartList(cartList);
  renderCart(cartList);
  setLocalCartList();
};

window.deleteCart = (i) => {
  cartList.splice(i, 1);
  renderCart(cartList);
  setLocalCartList();
  updateCartList(cartList);
};

window.clearCartList = () => {
  cartList.length = 0;
  console.log(cartList);
  setLocalCartList();
  renderCart(cartList);
  updateCartList();
};

window.purchase = () => {
  // document.querySelector(".card__total").style.right = "-100%";
  // document.querySelector(".card__overlay").style.display = "none";
  let totalPrice = 0;
  for (let i in cartList) {
    totalPrice += cartList[i].quantity * (cartList[i].product.price * 1);
  }

  let totalName = "";
  for (let i in cartList) {
    let itemPrice = cartList[i].quantity * cartList[i].product.price;
    totalName += `<div class="modal__item d-flex justify-content-between">
    <div id="modal__details" class="modal__details d-flex">
      <h4 id="modal__quantity">${cartList[i].quantity}</h4>
      <h4 class="px-2">x</h4>
      <h3 id="modal__name">${cartList[i].product.name}</h3>
    </div>
    <div id="modal__total" class="modal__total">
      <h4>$<span id="modal__price">${itemPrice}</span></h4>
    </div>
  </div>`;
  }

  if (totalPrice > 0) {
    document.querySelector(".card__total").style.right = "-100%";
    document.querySelector(".card__overlay").style.display = "none";

    document.querySelector(".modal").style.display = "block !important";
    document.querySelector("#exampleModal").style.left = "50%";
    document.querySelector("#exampleModal").style.top = "50%";
    document.querySelector(".fade:not(.show)").style.opacity = "1";

    document.querySelector("#totalPrice").innerHTML = totalPrice;

    document.querySelector("#modal__total").innerHTML = totalName;
  } else {
    // document.querySelector(".card__total").style.right = "-100%";
    // document.querySelector(".card__overlay").style.display = "none";

    // for (let i in cartList) {
    //   document.getElementsByClassName[i](".modal-backdrop.show").style.opacity =
    //     "0 ";
    //   document.querySelector[i](".modal-backdrop").style.position =
    //     "inherit !important";
    // }
    return;
  }
};

window.order = () => {
  let totalPrice = 0;
  for (let i in cartList) {
    totalPrice += cartList[i].quantity * (cartList[i].product.price * 1);
  }

  let html = "";
  for (const i in cartList) {
    html = `<i class="fa fa-money-bill"></i>
    <p class="ml-2">
      You can pay <strong>$ ${totalPrice}</strong> by card or any online transaction
      method after the products have been dilivered to you
    </p>`;
  }
  document.querySelector("#totalOrder").innerHTML = html;
  document.querySelector("#order").style.top = "50%";
  document.querySelector("#exampleModal").style.top = "-100%";
  clearCartList();
  updateCartList(cartList);
  renderCart(cartList);
};

window.next = () => {
  document.querySelector("#order").style.top = "-100%";
  document.querySelector("#continue").style.top = "50%";
};
window.thanks = () => {
  document.querySelector("#continue").style.top = "-100%";
  document.querySelector(".modal-backdrop.show").style.opacity = "0";
  document.querySelector(".modal-backdrop").style.position = "relative";
};
window.onload = () => {
  getProduct();
  getLocalCartList();
  renderCart(cartList);
  updateCartList(cartList);
};
