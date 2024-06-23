import React, {useRef, useEffect} from "react";

const ConfettiCanvas = ({isActive, images}) => {
  // useRef to hold a reference to the canvas element.
  const canvasRef = useRef(null);
  // Variable to hold the requestAnimationFrame ID for later cancellation.
  let animationFrameId;

  // useEffect hook to manage the lifecycle of the canvas and its animations.
  useEffect(() => {
    // Access the canvas element and its drawing context.
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size to cover the entire viewport.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Arrays to hold the confetti particles and loaded images.
    let confettiParticles = [];
    const loadedImages = [];
    let imagesLoaded = 0;

    // Load images and initialize confetti particles once all images are loaded.
    images.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        imagesLoaded++;
        loadedImages.push(img);
        // Create confetti particles once all images are loaded.
        if (imagesLoaded === images.length) {
          createConfettiParticles();
        }
      };
      img.onerror = () => {
        console.error("Failed to load image", src);
      };
      img.src = src;
    });

    // Function to create confetti particles.
    const createConfettiParticles = () => {
      confettiParticles = []; // Clear existing particles before creating new ones
      for (let i = 0; i < 100; i++) {
        // Creating 100 particles
        confettiParticles.push(createParticle(true)); // Create particles from the left
        confettiParticles.push(createParticle(false)); // Create particles from the right
      }
      animate(); // Start the animation loop
    };

    // Function to create a single particle, positioned to burst from the left or right.
    const createParticle = (fromLeft) => {
      return {
        x: fromLeft ? -30 : canvas.width + 30, // Start off-screen to the left or right
        y: canvas.height / 1.1, // Start from the middle height of the screen
        size: Math.random() * 90, // Random size of the particle
        rotation: Math.random() * 360, // Random initial rotation
        speedX: fromLeft ? Math.random() * 20 : -(Math.random() * 20 + 1), // Random horizontal speed
        speedY: Math.random() * 10 - 25, // Random vertical speed
        gravity: 0.3, // Gravity effect to pull particles down
        img: loadedImages[Math.floor(Math.random() * loadedImages.length)], // Random image from loaded images
      };
    };

    // Animation loop to move and draw particles.
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      confettiParticles.forEach((particle) => {
        particle.speedY += particle.gravity; // Apply gravity to vertical speed
        particle.x += particle.speedX; // Update horizontal position
        particle.y += particle.speedY; // Update vertical position
        particle.rotation += 2; // Rotate the particle
        ctx.save(); // Save the current drawing state
        ctx.translate(particle.x, particle.y); // Move to the particle's location
        ctx.rotate((particle.rotation * Math.PI) / 180); // Apply rotation
        ctx.drawImage(particle.img, -particle.size / 2, -particle.size / 2, particle.size, particle.size); // Draw the image centered
        ctx.restore(); // Restore the drawing state
      });

      // Request the next animation frame if still active.
      if (isActive && confettiParticles.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // Cleanup function to clear particles and cancel animation frame request on component unmount.
    return () => {
      confettiParticles = []; // Clear the particles array
      cancelAnimationFrame(animationFrameId); // Cancel the ongoing animation frame request
    };
  }, [isActive, images]); // Dependencies for the useEffect

  // Render the canvas element with styling to fix it across the entire viewport and ensure it's non-interactive.
  return <canvas ref={canvasRef} style={{position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 1000}}></canvas>;
};

export default ConfettiCanvas;
