// ButtonCAT class (position and width)
class ButtonCat {
  constructor(x, y, bigRadius, smallRadius, labels, colors, targetsId) {
    this.x = x;
    this.y = y;
    this.bigRadius = bigRadius;
    this.smallRadius = smallRadius;
    this.labels = labels;
    this.colors = colors;
    this.targetsId = targetsId;
    this.angleStep = TWO_PI / labels.length;
  }

  // Checks if a mouse click took place
  // within the target
  clicked(mouse_x, mouse_y) {
    let d = dist(mouse_x, mouse_y, this.x, this.y);
    console.log(this.bigRadius, this.smallRadius,d);
    if (d < this.bigRadius && d >= this.smallRadius) {
      let angle = atan2(mouse_y - this.y, mouse_x - this.x);
      if (angle < 0) {
        angle += TWO_PI;
      }
      console.log("angle", angle);
      return floor(angle / this.angleStep);
    } else return -1;
  }

  // Draws the target (i.e., a circle)
  // and its label
  draw() {
    for (let i = 0; i < this.colors.length; i++) {
      let start = this.angleStep * i;
      let stop = start + this.angleStep;
      let labelAngle = (start + stop) / 2;
      let labelX = this.x + 2 * (this.bigRadius)/3 * cos(labelAngle);
      let labelY = this.y + 2 * (this.bigRadius)/3 * sin(labelAngle);
      fill(this.colors[i]);
      arc(
        this.x,
        this.y,
        this.bigRadius * 2,
        this.bigRadius * 2,
        start,
        stop,
        PIE
      );

      fill((255, 255, 255));
      textFont("Arial", 20);
      textAlign(CENTER, CENTER);
      push();
      translate(labelX, labelY);
      //rotate(labelAngle + HALF_PI);
      text(this.labels[i], 0, 0);
      pop();
    }
    fill(0);
    ellipse(this.x, this.y, this.smallRadius * 2);
  }

  getTargets(index) {
    return this.targetsId[index];
  }

  getTargets() {
    return this.targetsId;
  }
  getColors() {
    return this.colors;
  }
}
