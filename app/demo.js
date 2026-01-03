// create a function that takes in a starting point, an angle and a length and returns and endpoint

// given theta and the length of the hypotenuse, determine the
// length of the other two sides

function endPoint(x, y, angle, length) {
  x = x + Math.sin(angle) * length;
  y = y + Math.cos(angle) * length;
  return [x, y];
}

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function drawRandomStarBurst(event) {
  const svg = document.getElementById('svg');
  svg.innerHTML = '';

  const centerX =
    event?.clientX ?? Math.floor(Math.random() * window.innerWidth);
  const centerY =
    event?.clientY ?? Math.floor(Math.random() * window.innerHeight);

  for (let i = 0; i <= 360; i += 10) {
    let length = Math.round(Math.random() * 250) + 50;
    const ep = endPoint(centerX, centerY, i, length);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', centerX);
    line.setAttribute('y1', centerY);
    line.setAttribute('x2', ep[0]);
    line.setAttribute('y2', ep[1]);
    line.setAttribute('stroke', 'white');
    line.setAttribute('stroke-width', 2);
    svg.appendChild(line);
  }
}

drawRandomStarBurst();

const svg = document.getElementById('svg');
svg.addEventListener('click', drawRandomStarBurst);
