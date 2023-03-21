class buttons
{
    constructor(x, y, w, l, label)
    {
      this.x      = x;
      this.y      = y;
      this.width  = w;
      this.length = l;
      this.label  = label;
    }

    clicked(mouse_x, mouse_y)
    {
        //check to see if the click is within the bounds of the retangle
        if (mouse_x > this.x && mouse_x < this.x + this.width && mouse_y > this.y && mouse_y < this.y + this.length)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    draw()
    {
      // Draw target
      fill(color(155,155,155));                 
      rect(this.x, this.y, this.width, this.length);
      
      // Draw label
      textFont("Arial", 12);
      fill(color(255,255,255));
      textAlign(CENTER);
      text(this.label, this.x, this.y);
    }
}