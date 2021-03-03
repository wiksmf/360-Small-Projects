// Sky class
class Sky {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.lastUpdate = 0;
    this.lastConstellation = 0;
    this.nextConstellation = Math.random() * 3000;
    this.constellation = {
      stars: [],
      isClosed: false,
      width: null,
    };
  }

  // Initialize the canvas
  initCanvas() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.ctx.fillStyle = '#222831';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  // Create random stars
  generateStars(count) {
    let stars = [];

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 3 + 2;
      stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: radius,
        originalRadius: radius,
        color: '#e2e2cc',
        speed: Math.random() + 0.1,
      });
    }

    this.stars = stars;
  }

  // Draw the stars
  drawStars() {
    this.stars.forEach(star => {
      this.drawStar(star);
    });
  }

  // Draw each star
  drawStar(star) {
    this.ctx.save();
    this.ctx.fillStyle = star.color;
    this.ctx.beginPath();
    this.ctx.translate(star.x, star.y);
    this.ctx.moveTo(0, 0 - star.radius);

    for (let i = 0; i < 5; i++) {
      this.ctx.rotate((Math.PI / 180) * 36);
      this.ctx.lineTo(0, 0 - star.radius * 0.65);
      this.ctx.rotate((Math.PI / 180) * 36);
      this.ctx.lineTo(0, 0 - star.radius);
    }

    this.ctx.fill();
    this.ctx.restore();
  }

  // Update stars position
  updateStars() {
    this.stars.forEach(star => {
      star.x += star.speed * (this.delta / 50);
      star.y -=
        (star.speed * (this.delta / 16) * (this.width / 2 - star.x)) / 3000;
      star.radius = star.originalRadius * (Math.random() / 4 + 0.9);

      if (star.x > this.width + 2 * star.radius) star.x = -2 * star.radius;
    });
  }

  // Create random constellation
  generateRandomConstellation() {
    const x =
      this.width / 2 + Math.random() * 0.8 * this.width - this.width / 2;
    const y =
      this.height / 2 + Math.random() * 0.8 * this.width - this.height / 2;
    const radius = (this.height / 2) * Math.random() * 0.5 + 0.5;

    this.constellation = {
      stars: this.stars
        .filter(star => {
          return (
            star.x > x - radius &&
            star.x < x + radius &&
            star.y > y - radius &&
            star.y < y + radius
          );
        })
        .slice(0, Math.round(Math.random() * 7 + 3)),
      isClosed: Math.random() > 0.5,
      width: 5,
    };
  }

  // Update constellation position
  updateConstellation() {
    if (this.constellation.width > 0)
      this.constellation.width -= 0.04 * (this.delta / 16);
    else this.constellation.width = 0;
  }

  // Draw the constellation
  drawConstellation() {
    const { stars, isClosed, width } = this.constellation;
    const starsCount = stars.length;

    if (starsCount > 2) {
      const firstStar = stars[0];

      this.ctx.beginPath();
      this.ctx.moveTo(firstStar.x, firstStar.y);
      this.ctx.lineTo(stars[1].x, stars[1].y);

      for (let i = 1; i < starsCount - 1; i++) {
        const nextStar = stars[i + 1];
        this.ctx.lineTo(nextStar.x, nextStar.y);
      }

      if (isClosed) this.ctx.lineTo(firstStar.x, firstStar.y);

      this.ctx.strokeStyle = '#f7eada';
      this.ctx.lineWidth = width;
      this.ctx.stroke();
    }
  }

  // Draw gradient background on canvas
  drawOverlay() {
    const gradient = this.ctx.createRadialGradient(
      this.width / 2,
      this.height,
      250,
      this.width / 2,
      this.height / 2,
      this.width / 2,
    );

    gradient.addColorStop(0, '#22283117');
    gradient.addColorStop(1, '#0c0e118c');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  // Clear canvas
  clearCanvas() {
    this.ctx.fillStyle = '#222831';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  // Loop and draw the stars and the constellations
  draw(now) {
    this.delta = now - this.lastUpdate;

    this.clearCanvas();
    this.drawStars();
    this.updateStars();
    this.drawConstellation();
    this.updateConstellation();
    this.drawOverlay();

    if (now - this.lastConstellation > this.nextConstellation) {
      this.lastConstellation = now;
      this.nextConstellation = Math.random() * 1000 + 2000;
      this.generateRandomConstellation();
    }

    this.lastUpdate = now;

    window.requestAnimationFrame(now => this.draw(now));
  }

  // Initialize webpage
  init() {
    this.initCanvas();
    this.generateStars(1000);
    this.draw(0);
  }
}

const sky = new Sky(document.querySelector('canvas'));
sky.init();
