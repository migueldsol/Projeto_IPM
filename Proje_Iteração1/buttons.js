class buttons {
  constructor(x, y, w, h, label) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.label = label;
  }

  clicked(mouse_x, mouse_y) {
    //check to see if the click is within the bounds of the retangle
    return (
      mouse_x > this.x &&
      mouse_x < this.x + this.width &&
      mouse_y > this.y &&
      mouse_y < this.y + this.height
    );
  }

  draw() {
    // Draw target
    fill(color(155, 155, 155));
    rect(this.x, this.y, this.width, this.height);

    // Draw label
    textFont("Arial", 12);
    textAlign(CENTER, CENTER);
    fill(color(255, 255, 255));
    text(this.label, this.x + this.width / 2, this.y + this.height / 2);
  }
}
