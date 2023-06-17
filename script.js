document.addEventListener("DOMContentLoaded", function() {
    fetch('options.json')
        .then(response => response.json())
        .then(data => {
            var options = data.options;

            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            var textMaxWidth = getTextMaxWidth(ctx, options);
            var wheelRadius = textMaxWidth * 1.1; // Adjust the wheel radius based on the text length
            canvas.width = wheelRadius * 2;
            canvas.height = wheelRadius * 2;

            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;

            var angle = (2 * Math.PI) / options.length;
            var rotationOffset = -Math.PI / 2; // Offset to make the text start from the top

            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            options.forEach((option, index) => {
                var optionAngle = index * angle + rotationOffset;
                var x = centerX + (wheelRadius - 20) * Math.cos(optionAngle);
                var y = centerY + (wheelRadius - 20) * Math.sin(optionAngle);

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(optionAngle + Math.PI); // Rotate the text to point inward
                ctx.fillText(option, 0, 0);
                ctx.restore();
            });
        })
        .catch(error => console.error('Error:', error));
});

function spinWheel() {
    fetch('options.json')
        .then(response => response.json())
        .then(data => {
            var options = data.options;
            var selectedOption = options[Math.floor(Math.random() * options.length)];
            document.getElementById("result").textContent = "You spun the wheel and got: " + selectedOption;

            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");

            // Wheel animation
            var duration = 5000; // Duration of the spin animation in milliseconds
            var startAngle = Math.random() * Math.PI * 2; // Starting angle of rotation
            var endAngle = startAngle + Math.PI * 2; // Ending angle of rotation

            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;
            var wheelRadius = canvas.width / 2 - 20; // Calculate wheel radius based on canvas size

            var startTime = null;

            function animateWheel(timestamp) {
                if (!startTime) startTime = timestamp;
                var elapsedTime = timestamp - startTime;
                var angle = easeInOutCubic(elapsedTime, startAngle, endAngle - startAngle, duration);

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                options.forEach((option, index) => {
                    var optionAngle = index * (Math.PI * 2 / options.length) + angle;
                    var x = centerX + wheelRadius * Math.cos(optionAngle);
                    var y = centerY + wheelRadius * Math.sin(optionAngle);

                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(optionAngle + Math.PI / 2);
                    ctx.textBaseline = "middle"; // Set the text baseline to middle for inward pointing text
                    ctx.fillText(option, 0, 0);
                    ctx.restore();
                });

                if (elapsedTime < duration) {
                    requestAnimationFrame(animateWheel);
                }
            }

            requestAnimationFrame(animateWheel);
        })
        .catch(error => console.error('Error:', error));
}

// Easing function for smooth animation
function easeInOutCubic(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
}

// Helper function to calculate the maximum width of the text
function getTextMaxWidth(ctx, texts) {
    var maxWidth = 0;
    ctx.font = "16px Arial";
    texts.forEach(text => {
        var width = ctx.measureText(text).width;
        if (width > maxWidth) {
            maxWidth = width;
        }
    });
    return maxWidth;
}
