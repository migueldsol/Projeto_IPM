// Target class (position and width)
class Target {
  constructor(x, y, w, l, id) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.label = l;
    this.id = id;
  }

  // Checks if a mouse click took place
  // within the target
  clicked(mouse_x, mouse_y) {
    return dist(this.x, this.y, mouse_x, mouse_y) < this.width / 2;
  }

  // Draws the target (i.e., a circle)
  // and its label
  draw(grey) {
    // Draw target
    fill(color(155, 155, 155));
    circle(this.x, this.y, this.width);

    // Draw label
    textFont("Arial", 22, 60);
    if (grey) {fill(color(255, 255, 255));}
    else {fill(color(255, 0, 0));}
    textAlign(CENTER, TOP);
    if (!grey) {text(this.label[0], this.x, this.y - this.width / 3);}
    textFont("Arial", 12);
    fill(color(255, 255, 255));
    textAlign(CENTER, CENTER);
    text(this.label, this.x, this.y);
  }

  showLabel() {
    return this.label;
  }
  getMeasures() {
    return { x: this.x, y: this.y, width: this.width };
  }
}
