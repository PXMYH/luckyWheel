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
        })
        .catch(error => console.error('Error:', error));
}
