// ButtonCAT class (position and width)
class ButtonBack {
    constructor(
      x,
      y,
      w,
      h
    ) {
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
      this.label = "Back";
    }
  
    // Checks if a mouse click took place
    // within the target
    clicked(mouse_x, mouse_y) {
      return (
        mouse_x >= this.x &&
        mouse_x <= this.x + this.width &&
        mouse_y >= this.y &&
        mouse_y <= this.y + this.height
      );
    }
  
    // Draws the target (i.e., a circle)
    // and its label
    draw() {
      // Draw target
      fill(color(155, 155, 155));
      rect(this.x, this.y, this.width, this.height);
  
      // Draw label
      textFont("Arial", 30);
      textAlign(CENTER, CENTER);
      fill(color(255, 255, 255));
      text(this.label, this.x + this.width / 2, this.y + this.height / 2);
    }
  
    getLabel() {
      return this.label;
    }
  }
  