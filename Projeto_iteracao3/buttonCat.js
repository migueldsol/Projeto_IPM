// ButtonCAT class (position and width)
class ButtonCat {
  constructor(x, y, bigRadius, smallRadius, labels, colors){
    this.x = x;
    this.y = y;
    this.bigRadius = bigRadius;
    this.smallRadius = smallRadius;
    this.labels = labels;
    this.colors = colors;
    this.angleStep = TWO_PI / labels.length;
  }


  // Checks if a mouse click took place
  // within the target
  clicked(mouse_x, mouse_y) {
    let d = dist(mouse_x, mouse_y, this.x, this.y);
    if (d < this.bigRadius && d > this.smallRadius) {
      let angle = atan2(mouse_y - this.y, mouse_x - this.x);
      if (angle < 0) {
        angle += TWO_PI;
      }
      return floor(angle / angleStep);
    }
    else return 0;
  }

  // Draws the target (i.e., a circle)
  // and its label
  draw() {
    // for (let i = 0; i < this.labels.length; i++) {
    //   push();
    //   translate(width / 2, height / 2);
    //   rotate(i * this.angleStep);
    //   fill(this.colors[i]);
    //   arc(0, 0, this.bigRadius * 2, this.bigRadius * 2, 0, this.angleStep, PIE);
    //   //fill(255);
    //   rotate(0);
    //   textAlign(CENTER, CENTER);
    //   textSize(20);
    //   text(this.labels[i], this.bigRadius * 1.5, 0);
    //   pop();
    // }
    for (let i = 0; i < this.colors.length; i++) {
      let start = this.angleStep * i;
      let stop = start + this.angleStep;
      let labelAngle = (start + stop) / 2;
      let labelX = this.x + (this.bigRadius + 20) * cos(labelAngle);
      let labelY = this.y + (this.bigRadius + 20) * sin(labelAngle);
      fill(this.colors[i]);
      arc(this.x, this.y, this.bigRadius * 2, this.bigRadius * 2, start, stop, PIE);
      textAlign(CENTER, CENTER);
      push();
      translate(labelX, labelY);
      rotate(labelAngle + HALF_PI);
      text("Category " + i, 0, 0);
      pop();
    }
  }
}
