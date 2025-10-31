document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('spiralCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    const ctx = canvas.getContext('2d');
    const generateBtn = document.getElementById('generateBtn');
    const gridToggleBtn = document.getElementById('gridToggleBtn');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    // ADDED THESE
    const increaseThicknessBtn = document.getElementById('increaseThicknessBtn');
    const decreaseThicknessBtn = document.getElementById('decreaseThicknessBtn');
    
    let showGrid = false;
    let scale = 1.0;
    const ZOOM_FACTOR = 1.2;
    let lineWidth = 3; // ADDED: Initial line width

    // Grid toggle event listener
    gridToggleBtn.addEventListener('click', function() {
        showGrid = !showGrid;
        gridToggleBtn.textContent = showGrid ? 'Grid Not Needed' : 'Grid Needed';
        drawSpiral();
    });
    
    // Set canvas size
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = Math.max(container.clientWidth * 2, 2400);
        canvas.height = Math.max(container.clientHeight * 2, 2000);
        drawSpiral(); // Redraw when resizing
    }
    
    const resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
    });
    resizeObserver.observe(canvas.parentElement);
    
    resizeCanvas();
    
    generateBtn.addEventListener('click', drawSpiral);
    
    // Zoom controls
    zoomInBtn.addEventListener('click', () => {
        scale *= ZOOM_FACTOR;
        drawSpiral();
    });

    zoomOutBtn.addEventListener('click', () => {
        scale /= ZOOM_FACTOR;
        drawSpiral();
    });

    // ADDED: Thickness controls
    increaseThicknessBtn.addEventListener('click', () => {
        lineWidth += 1;
        drawSpiral();
    });

    decreaseThicknessBtn.addEventListener('click', () => {
        if (lineWidth > 1) { // Prevent line from being 0 or negative
            lineWidth -= 1;
            drawSpiral();
        }
    });

    function drawSpiral() {
        // Get user inputs
        const userAngle = parseFloat(document.getElementById('angle').value);
        const angle = 180 - userAngle;
        const initialStep = parseFloat(document.getElementById('initialStep').value);
        const stepIncrement = parseFloat(document.getElementById('stepIncrement').value);
        const innerSegments = parseInt(document.getElementById('innerSegments').value);
        const outerRepeats = parseInt(document.getElementById('outerRepeats').value);

        // 1. Reset transformation matrix and clear canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 2. Draw grid if enabled
        if (showGrid) {
            ctx.beginPath();
            ctx.strokeStyle = '#383838'; // Dark theme grid color
            ctx.lineWidth = 1;
            
            for (let x = 0; x <= canvas.width; x += initialStep) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
            }
            for (let y = 0; y <= canvas.height; y += initialStep) {
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
            }
            ctx.stroke();
        }
        
        // 3. Apply the current scale and center transform
        ctx.setTransform(scale, 0, 0, scale, canvas.width * (1 - scale) / 2, canvas.height * (1 - scale) / 2);

        // 4. Set drawing parameters
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        let x = centerX;
        let y = centerY;
        let currentAngle = 0;
        let stepSize = initialStep;
        
        // Draw start point
        ctx.beginPath();
        ctx.arc(x, y, 5 / scale, 0, Math.PI * 2);
        ctx.fillStyle = 'green';
        ctx.fill();
        
        // Begin spiral path
        ctx.beginPath();
        ctx.moveTo(x, y);
        
        // 5. Draw the spiral
        for (let i = 0; i < outerRepeats; i++) {
            stepSize = initialStep;
            
            for (let j = 0; j < innerSegments; j++) {
                const radianAngle = currentAngle * Math.PI / 180;
                x += stepSize * Math.cos(radianAngle);
                y += stepSize * Math.sin(radianAngle);
                
                ctx.lineTo(x, y);
                
                currentAngle += angle;
                stepSize += stepIncrement;
            }
        }
        
        // Draw the spiral path
        ctx.strokeStyle = '#00c6ff'; // Vibrant primary color
        ctx.lineWidth = lineWidth / scale; // MODIFIED: Use variable line width
        ctx.stroke();
        
        // Draw end point
        ctx.beginPath();
        ctx.arc(x, y, 5 / scale, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        
        // 6. Reset transform to draw screen-space text
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // 7. Add information text (in screen-space)
        ctx.fillStyle = '#e0e0e0'; // Dark theme text color
        ctx.font = '15px "Inter", sans-serif';
        ctx.fillText(`Angle: ${userAngle}°`, 20, 30);
        ctx.fillText(`Step: ${initialStep}`, 20, 55);
        ctx.fillText(`Increment: ${stepIncrement}`, 20, 80);
    }
    
    // Draw initial spiral
    drawSpiral();
});
