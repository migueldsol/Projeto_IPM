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
    if (d < this.bigRadius * 2 && d >= this.bigRadius) {
      let angle = atan2(mouse_y - this.y, mouse_x - this.x);
      if (angle < 0) {
        angle += TWO_PI;
      }
      0-5
      3,4
      let outerIndex = this.houvered(mouse_x,mouse_y);
      let sencondAngleStep = this.angleStep/this.labels[this.houvered(mouse_x, mouse_y)].length;
      let innerIndex = floor((angle - outerIndex * this.angleStep) /sencondAngleStep);
      return  [innerIndex, outerIndex];
    } else return [-1,-1];
  }

  houvered(mouse_x, mouse_y){
    let d = dist(mouse_x, mouse_y, this.x, this.y);

    let angle = atan2(mouse_y - this.y, mouse_x - this.x);
    if (angle < 0) {
      angle += TWO_PI;
    }
    return floor(angle / this.angleStep);
  }

  // Draws the target (i.e., a circle)
  // and its label
  draw(mouse_x, mouse_y) {
    for (let i = 0; i < this.colors.length; i++) {
      let start = this.angleStep * i;
      let stop = start + this.angleStep;

      let labelAngle = (start + stop) / 2;
      let labelX = this.x + 2.25*(this.bigRadius) * cos(labelAngle);
      let labelY = this.y + 2.25*(this.bigRadius) * sin(labelAngle);

      fill(this.colors[i]);
      arc(
        this.x,
        this.y,
        this.bigRadius*5,
        this.bigRadius*5,
        start,
        stop,
        PIE
      );
      for (let j = 0; j < this.labels[i].length; j++){
        if (this.houvered(mouse_x, mouse_y) == i){
          let secondStep = this.angleStep/this.labels[i].length;
          let secondStart = start + secondStep * j;  
          let secondStop = secondStart + secondStep;     
          let secondLabelAngle = (secondStop + secondStart) /2; 
          let secondlabelX = this.x + (this.bigRadius)* cos(secondLabelAngle);
          let secondlabelY = this.y + (this.bigRadius) * sin(secondLabelAngle);
          
          fill(155);
          arc(
            this.x,
            this.y,
            this.bigRadius*4,
            this.bigRadius*4,
            secondStart,
            secondStop,
            PIE
          );
          fill((255, 255, 255));
          textFont("Arial", 20);
          textAlign(CENTER, CENTER);
          push();
          translate(secondlabelX, secondlabelY);
          text(this.labels[i][j], 0, 0);
          pop();
        }
      }

      fill((255, 255, 255));
      textFont("Arial", 20);
      textAlign(CENTER, CENTER);
      push();
      translate(labelX, labelY);
      //rotate(labelAngle + HALF_PI);
      text(this.labels[i], 0, 0);
      pop();
    }
  }

  getTargets() {
    return this.targetsId;
  }

  getTargets() {
    return this.targetsId;
  }
  getColors() {
    return this.colors;
  }
}
