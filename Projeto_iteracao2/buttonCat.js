// ButtonCAT class (position and width)
class ButtonCat {
  constructor(
    x,
    y,
    w,
    h,
    l,
    ownTargets, //[[id, x, y]
    horizontalGap,
    verticalGap,
    firstPosition,
    targetSize
  ) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.label = l;
    this.ownTargets = ownTargets; //[[id, x, y]]
    this.horizontalGap = horizontalGap;
    this.verticalGap = verticalGap;
    this.firstPosition = firstPosition;
    this.positionList = [];
    this.targetSize = targetSize;
    this.positions();
  }

  // Checks if a mouse click took place
  // within the target
  clicked(mouse_x, mouse_y) {
    return (
      mouse_x > this.x &&
      mouse_x < this.x + this.width &&
      mouse_y > this.y &&
      mouse_y < this.y + this.height
    );
  }

  // Draws the target (i.e., a circle)
  // and its label
  draw() {
    // Draw target
    fill(color(155, 155, 155));
    rect(this.x, this.y, this.width, this.height);

    // Draw label
    textFont("Arial", 40);
    textAlign(CENTER, CENTER);
    fill(color(255, 255, 255));
    text(this.label, this.x + this.width / 2, this.y + this.height / 2);
  }

  positions() {
    let row =
      Math.floor(this.ownTargets.length / 5) +
      Math.ceil(this.ownTargets.length % 5);
    let column = 5;
    let startX = this.firstPosition[this.label][0];
    let startY = this.firstPosition[this.label][1];
    for (var r = 0; r < row; r++) {
      for (var c = 0; c < column; c++) {
        if (c + column * r == this.ownTargets.length) {
          break;
        }
        let target_x = startX + (this.horizontalGap + this.targetSize) * c;
        let target_y = startY + (this.verticalGap + this.targetSize) * r;
        this.positionList.push([target_x, target_y]);
      }
    }
  }

  getTargets() {
    return this.ownTargets;
  }
  getPositionList() {
    return this.positionList;
  }
  getLabel() {
    return this.label;
  }
}
