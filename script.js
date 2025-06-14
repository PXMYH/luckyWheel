// Global variables for wheel properties
let wheelOptions = [
  "Play for All Abilities Park",
  "Lakeline Park",
  "Brushy Creek Lake Park",
  "Lake wood Park",
  "Robinson Park",
  "Milburn Park",
  "Farm",
  "Splash Pads",
  "Thinkery",
  "Aquarium",
  "Indigo Play",
  "YMCA",
  "Public Library",
  "Public Library",
  "Catch Air",
  "Urban Air Trampoline",
  "Mt. Play",
  "Splash Shack",
  "Little Land",
  "Ikea"
];
let currentRotation = 0;
let isSpinning = false;

document.addEventListener('DOMContentLoaded', function () {
  // Initialize the wheel directly without fetch
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  
  // Set fixed dimensions for the wheel
  canvas.width = 500;
  canvas.height = 500;
  
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var wheelRadius = Math.min(centerX, centerY) - 20;

  // Draw the initial wheel
  drawWheel(ctx, wheelOptions, 0, centerX, centerY, wheelRadius);
  
  // Draw the pointer
  drawPointer(ctx, centerX, centerY);
});

function spinWheel() {
  if (isSpinning) return; // Prevent multiple spins
  isSpinning = true;
  
  document.getElementById('result').textContent = "Spinning...";
  
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var wheelRadius = Math.min(centerX, centerY) - 20;
  
  // Calculate spin properties
  var spinAngle = Math.random() * 360 + 1800; // Spin at least 5 full rotations (1800 degrees)
  var duration = 5000; // Duration in milliseconds
  var startTime = null;
  var startAngle = currentRotation;
  
  function animateWheel(timestamp) {
    if (!startTime) startTime = timestamp;
    var elapsedTime = timestamp - startTime;
    var progress = Math.min(elapsedTime / duration, 1);
    
    // Calculate current angle using easing function
    var angleProgress = easeInOutCubic(progress, 0, 1, 1);
    var currentAngle = startAngle + (spinAngle * angleProgress);
    
    // Convert to radians and update global rotation
    var rotationRadians = (currentAngle * Math.PI) / 180;
    currentRotation = currentAngle % 360;
    
    // Redraw the wheel
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWheel(ctx, wheelOptions, rotationRadians, centerX, centerY, wheelRadius);
    drawPointer(ctx, centerX, centerY);
    
    if (progress < 1) {
      requestAnimationFrame(animateWheel);
    } else {
      // Animation complete - determine the winner
      var winningIndex = getWinningIndex(currentRotation, wheelOptions.length);
      var selectedOption = wheelOptions[winningIndex];
      
      document.getElementById('result').textContent = 'You got: ' + selectedOption;
      isSpinning = false;
    }
  }
  
  requestAnimationFrame(animateWheel);
}

// Calculate the winning segment based on final rotation
function getWinningIndex(rotation, numOptions) {
  // Convert rotation to 0-360 range
  var normRotation = ((rotation % 360) + 360) % 360;
  
  // Each segment size in degrees
  var segmentSize = 360 / numOptions;
  
  // Calculate the winning index
  // Adding 90 to offset from the top position (pointer is at top)
  // We use numOptions - Math.floor() because the wheel rotates clockwise
  return (numOptions - Math.floor(((normRotation + 90) % 360) / segmentSize)) % numOptions;
}

// Draw indicator pointer
function drawPointer(ctx, centerX, centerY) {
  ctx.save();
  
  // Create a shadow effect
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  // Draw triangle pointer at the top
  ctx.beginPath();
  ctx.moveTo(centerX - 20, centerY - (centerY - 15));
  ctx.lineTo(centerX + 20, centerY - (centerY - 15));
  ctx.lineTo(centerX, centerY - (centerY - 45));
  ctx.closePath();
  
  // Create gradient fill for 3D effect
  var gradient = ctx.createLinearGradient(
    centerX - 20, 
    centerY - (centerY - 15), 
    centerX, 
    centerY - (centerY - 45)
  );
  gradient.addColorStop(0, '#ff3333');
  gradient.addColorStop(1, '#cc0000');
  
  ctx.fillStyle = gradient;
  ctx.fill();
  
  ctx.strokeStyle = '#800000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.restore();
}

// Easing function for smooth animation
function easeInOutCubic(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t * t + b;
  t -= 2;
  return (c / 2) * (t * t * t + 2) + b;
}

// Generate a bright color based on index
function generateColor(index, total) {
  var hue = (index * (360 / total)) % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

// Draw the wheel with colored segments
function drawWheel(ctx, options, rotation, centerX, centerY, radius) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  ctx.translate(-centerX, -centerY);
  
  var sliceAngle = (2 * Math.PI) / options.length;
  
  // Draw outer circle (rim)
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#333';
  ctx.stroke();
  ctx.restore();
  
  // Draw colored segments
  for (var i = 0; i < options.length; i++) {
    var startAngle = i * sliceAngle;
    var endAngle = startAngle + sliceAngle;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius - 5, startAngle, endAngle);
    ctx.closePath();
    
    // Fill with a different color for each segment
    ctx.fillStyle = generateColor(i, options.length);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add the text
    ctx.save();
    
    // Calculate position for text
    var textRadius = radius * 0.65;
    var textAngle = startAngle + (sliceAngle / 2);
    var textX = centerX + textRadius * Math.cos(textAngle);
    var textY = centerY + textRadius * Math.sin(textAngle);
    
    ctx.translate(textX, textY);
    
    // Adjust text rotation to always be readable from outside
    var rotationAngle = textAngle;
    if (textAngle > Math.PI / 2 && textAngle < Math.PI * 1.5) {
      rotationAngle += Math.PI;
    }
    ctx.rotate(rotationAngle);
    
    // Draw text
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Truncate text if too long
    var text = options[i];
    if (ctx.measureText(text).width > radius * 0.4) {
      text = text.substring(0, 8) + '...';
    }
    
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }
  
  // Draw wheel center (hub)
  var gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 25);
  gradient.addColorStop(0, '#666');
  gradient.addColorStop(1, '#333');
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.restore();
}
