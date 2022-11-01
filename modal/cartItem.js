export class CartItem {
  constructor(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    des,
    type,
    quantity
  ) {
    this.product = {
      id: id,
      name: name,
      price: price,
      screen: screen,
      backCamera: backCamera,
      frontCamera: frontCamera,
      img: img,
      des: des,
      type: type,
    };
    this.quantity = quantity;
  }
}
