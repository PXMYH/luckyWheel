function spinWheel() {
    fetch('options.json')
        .then(response => response.json())
        .then(data => {
            var options = data.options;
            var selectedOption = options[Math.floor(Math.random() * options.length)];
            document.getElementById("result").textContent = "You spun the wheel and got: " + selectedOption;
        })
        .catch(error => console.error('Error:', error));
}
