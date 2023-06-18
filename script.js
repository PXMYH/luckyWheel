document.addEventListener('DOMContentLoaded', function () {
  fetch('options.json')
    .then((response) => response.json())
    .then((data) => {
      var options = data.options;

      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var textMaxWidth = getTextMaxWidth(ctx, options);
      var wheelRadius = textMaxWidth * 1.1; // Adjust the wheel radius based on the text length
      canvas.width = wheelRadius * 2;
      canvas.height = wheelRadius * 2;

      var centerX = canvas.width / 2;
      var centerY = canvas.height / 2;

      var angle = (2 * Math.PI) / options.length;
      var rotationOffset = -Math.PI / 2; // Offset to make the text start from the top

      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      displayOptions(
        ctx,
        options,
        angle,
        rotationOffset,
        wheelRadius,
        centerX,
        centerY,
        true
      );
    })
    .catch((error) => console.error('Error:', error));
});

function spinWheel() {
  fetch('options.json')
    .then((response) => response.json())
    .then((data) => {
      var options = data.options;
      var selectedOption = options[Math.floor(Math.random() * options.length)];
      document.getElementById('result').textContent =
        'You spun the wheel and got: ' + selectedOption;

      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');

      // Wheel animation
      var duration = 5000; // Duration of the spin animation in milliseconds
      var startAngle = Math.random() * Math.PI * 2; // Starting angle of rotation
      var endAngle = startAngle + Math.PI * 2; // Ending angle of rotation

      var centerX = canvas.width / 2;
      var centerY = canvas.height / 2;
      var wheelRadius = canvas.width / 2 - 20; // Calculate wheel radius based on canvas size

      var indicatorLength = wheelRadius * 0.4; // Length of the arrow indicator
      var indicatorWidth = 10; // Width of the arrow indicator
      var indicatorColor = 'red'; // Indicator color

      var startTime = null;

      function animateWheel(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsedTime = timestamp - startTime;
        var angle = easeInOutCubic(
          elapsedTime,
          startAngle,
          endAngle - startAngle,
          duration
        );

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw wheel
        options.forEach((option, index) => {
          var optionAngle = index * ((Math.PI * 2) / options.length) + angle;

          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(optionAngle);

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(option, 0, -wheelRadius + 20);

          ctx.restore();
        });

        // Draw indicator
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle - Math.PI / 2); // Rotate the indicator based on the wheel rotation

        ctx.beginPath();
        ctx.moveTo(0, -wheelRadius - indicatorLength);
        ctx.lineTo(
          indicatorWidth / 2,
          -wheelRadius - indicatorLength + indicatorWidth
        );
        ctx.lineTo(
          -indicatorWidth / 2,
          -wheelRadius - indicatorLength + indicatorWidth
        );
        ctx.closePath();

        ctx.fillStyle = indicatorColor;
        ctx.fill();

        ctx.restore();

        if (elapsedTime < duration) {
          requestAnimationFrame(animateWheel);
        }
      }

      requestAnimationFrame(animateWheel);
    })
    .catch((error) => console.error('Error:', error));
}

// Easing function for smooth animation
function easeInOutCubic(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t * t + b;
  t -= 2;
  return (c / 2) * (t * t * t + 2) + b;
}

// Helper function to calculate the maximum width of the text
function getTextMaxWidth(ctx, texts) {
  var maxWidth = 0;
  ctx.font = '16px Arial';
  texts.forEach((text) => {
    var width = ctx.measureText(text).width;
    if (width > maxWidth) {
      maxWidth = width;
    }
  });
  return maxWidth;
}

function displayOptions(
  ctx,
  options,
  angle,
  rotationOffset = 0,
  wheelRadius,
  centerX,
  centerY,
  isStatic = true
) {
  options.forEach((option, index) => {
    if (isStatic) {
      // static page load
      var optionAngle = index * angle + rotationOffset;
    } else {
      // spin wheel page
      var optionAngle = index * ((Math.PI * 2) / options.length) + angle;
    }
    var x = centerX + (wheelRadius - 20) * Math.cos(optionAngle);
    var y = centerY + (wheelRadius - 20) * Math.sin(optionAngle);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(optionAngle + Math.PI); // Rotate the text to point inward
    ctx.fillText(option, 0, 0);
    ctx.restore();
  });
}
