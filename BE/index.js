let productList = [];
const URLs = "https://6336fc755327df4c43cdbe89.mockapi.io/ProductCart/";

let addProduct = () => {
  let name = document.getElementById("name").value;
  let price = document.getElementById("price").value * 1;
  let screen = document.getElementById("screen").value;
  let backCamera = document.getElementById("backCamera").value;
  let frontCamera = document.getElementById("frontCamera").value;
  let img = document.getElementById("img").value;
  let desc = document.getElementById("desc").value;
  let type = document.getElementById("type").value;

  let newProduct = new Products(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );
  axios({
    url: URLs,
    method: "POST",
    data: newProduct,
  })
    .then(function (res) {
      console.log(res);
    })
    .catch(function (error) {
      console.log(error);
    });
  productList.push(newProduct);
  rendderProduct();
  getProduct();
};

let rendderProduct = (data) => {
  if (!data) data = productList;

  let tableHTML = "";

  for (let i in productList) {
    let productItem = productList[i];
    tableHTML += `<tr>
          <td class="id text-center">${productItem.id}</td>
          <td class="name" style = "text-transform: capitalize"> ${productItem.name}</td>
          <td class="price"">$ ${productItem.price}</td>
  
          <td class="img">
            <img class="" width="150px" src="${productItem.img}" alt="" />
          </td>
  
          <td class="about">
            <p>Màn hình: ${productItem.screen}</p>
            <p>Camera sau: ${productItem.backCamera}</p>
            <p>Camera trước: ${productItem.frontCamera}</p>
            <p>Mô tả: ${productItem.desc}</p>
            <p>Type : ${productItem.type}</p>
          </td>
          

          <td class= "action_btn">
            <button
              onclick="deleteProduct('${productItem.id}')"
              class="btn btn-danger"
            >
              Xóa
            </button>
  
            <button
              data-toggle="modal"
              data-target="#myModal"
              onclick="getProductInfo('${productItem.id}')"
              class="btn btn-info"
            >
              Sửa
            </button>
          </td>
        </tr>`;
  }
  document.getElementById("tbodyProduct").innerHTML = tableHTML;
};

let getProduct = () => {
  var promise = axios({
    url: URLs,
    method: "GET",
  });
  promise
    .then(function (res) {
      productList = [...res.data];
      rendderProduct();
    })
    .catch(function (error) {
      console.log(error);
    });
};

let deleteProduct = (id) => {
  axios({
    url: URLs + id,
    method: "DELETE",
  })
    .then(function (res) {
      console.log(res);
      getProduct();
    })
    .catch(function (err) {
      console.log(err);
    });
};

let getProductInfo = (id) => {
  axios({
    url: URLs + id,
    method: "GET",
  })
    .then((res) => {
      console.log(res);
      let productItem = res.data;

      //show & disable id input
      document.getElementById("form-id").style.display = "block";
      document.getElementById("id").disabled = true;
      document.getElementById("id").value = productItem.id;

      document.getElementById("name").value = productItem.name;
      document.getElementById("price").value = productItem.price;
      document.getElementById("img").value = productItem.img;
      document.getElementById("desc").value = productItem.desc;
      document.getElementById("screen").value = productItem.screen;
      document.getElementById("backCamera").value = productItem.backCamera;
      document.getElementById("frontCamera").value = productItem.frontCamera;
      document.getElementById("type").value = productItem.type;

      document.getElementById("btnUpdate").style.display = "block";
      document.getElementById("btnCreate").style.display = "none";
    })
    .catch((err) => {
      console.log(err);
    });
};

let updateProductInfo = () => {
  let id = document.getElementById("id").value;
  let name = document.getElementById("name").value;
  let price = document.getElementById("price").value * 1;
  let screen = document.getElementById("screen").value;
  let backCamera = document.getElementById("backCamera").value;
  let frontCamera = document.getElementById("frontCamera").value;
  let img = document.getElementById("img").value;
  let desc = document.getElementById("desc").value;
  let type = document.getElementById("type").value;

  let newProduct = new Products(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );

  axios({
    url: URLs + id,
    method: "PUT",
    data: newProduct,
  })
    .then((res) => {
      console.log(res);

      document.getElementById("btnUpdate").style.display = "none";
      document.getElementById("btnCreate").style.display = "block";

      document.getElementById("myForm").reset();
      document.getElementById("form-id").style.display = "none";

      getProduct();
    })
    .catch((err) => {
      console.log(err);
    });
};

window.onload = () => {
  getProduct();
};
