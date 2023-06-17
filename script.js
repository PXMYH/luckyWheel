function spinWheel() {
    fetch('options.json')
        .then(response => response.json())
        .then(data => {
            var options = data.options;
            var selectedOption = options[Math.floor(Math.random() * options.length)];
            document.getElementById("result").textContent = "You spun the wheel and got: " + selectedOption;

            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            var wheelRadius = canvas.width / 2;
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;

            var angle = 2 * Math.PI / options.length;

            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            options.forEach((option, index) => {
                var optionAngle = index * angle;
                var x = centerX + wheelRadius * Math.cos(optionAngle);
                var y = centerY + wheelRadius * Math.sin(optionAngle);

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(optionAngle + Math.PI / 2); // Adjust rotation to make text face outward
                ctx.fillText(option, 0, 0);
                ctx.restore();
            });

            // Wheel animation
            var duration = 5000; // Duration of the spin animation in milliseconds
            var startAngle = Math.random() * Math.PI * 2; // Starting angle of rotation
            var endAngle = startAngle + Math.PI * 2; // Ending angle of rotation

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
