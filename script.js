document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Initialize AOS Library
    AOS.init({ once: true, offset: 50, duration: 800, easing: 'ease-out-cubic' });

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('shadow-md');
            navbar.classList.replace('bg-white/80', 'bg-white/95');
        } else {
            navbar.classList.remove('shadow-md');
            navbar.classList.replace('bg-white/95', 'bg-white/80');
        }
    });

    // 3. Apple-Style Skills Tabs Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active state from all buttons
            tabBtns.forEach(b => {
                b.classList.remove('bg-primary', 'text-white', 'shadow-lg', 'scale-105', 'active');
                b.classList.add('bg-slate-100', 'text-slate-600');
            });
            // Add active state to clicked button
            btn.classList.remove('bg-slate-100', 'text-slate-600');
            btn.classList.add('bg-primary', 'text-white', 'shadow-lg', 'scale-105', 'active');

            // Hide all tabs
            tabPanes.forEach(pane => {
                pane.classList.remove('active-tab');
                pane.classList.add('hidden-tab');
            });

            // Show target tab
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden-tab');
            document.getElementById(targetId).classList.add('active-tab');
        });
    });

    // 4. Advanced Canvas Animation: "The Data Pipeline"
    initDataAnimation();
});

function initDataAnimation() {
    const canvas = document.getElementById('dataCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set canvas to exact dimensions of its container
    function resizeCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // The nodes representing systems (Warehouse -> ETL -> DAX -> Insights)
    const nodes = [
        { x: 10, y: 20, label: "SQL Data Warehouse", radius: 6 },
        { x: 15, y: 80, label: "AWS S3", radius: 5 },
        { x: 40, y: 50, label: "Python ETL", radius: 8 },
        { x: 70, y: 30, label: "Power BI / DAX", radius: 10 },
        { x: 90, y: 60, label: "Insights", radius: 6 },
        { x: 85, y: 90, label: "Dashboards", radius: 5 }
    ];

    // Connections between nodes
    const links = [
        { from: 0, to: 2 }, { from: 1, to: 2 }, // Sources to ETL
        { from: 2, to: 3 }, // ETL to Power BI
        { from: 3, to: 4 }, { from: 3, to: 5 }  // Power BI to Outputs
    ];

    let particles = [];

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw links (the pipeline wires)
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgba(59, 130, 246, 0.15)"; // Light secondary blue
        links.forEach(link => {
            const fromNode = nodes[link.from];
            const toNode = nodes[link.to];
            ctx.beginPath();
            ctx.moveTo(fromNode.x * canvas.width / 100, fromNode.y * canvas.height / 100);
            
            // Draw a slightly curved line for a modern tech feel
            const cp1X = (fromNode.x + toNode.x) / 2 * canvas.width / 100;
            const cp1Y = fromNode.y * canvas.height / 100;
            ctx.quadraticCurveTo(cp1X, cp1Y, toNode.x * canvas.width / 100, toNode.y * canvas.height / 100);
            ctx.stroke();
        });

        // Spawn new data particles randomly
        if (Math.random() < 0.05) {
            const randomLink = links[Math.floor(Math.random() * links.length)];
            particles.push({
                link: randomLink,
                progress: 0,
                speed: 0.005 + (Math.random() * 0.005)
            });
        }

        // Draw and update particles (data flowing)
        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            p.progress += p.speed;

            if (p.progress >= 1) {
                particles.splice(i, 1); // remove if it reached the end
                continue;
            }

            const fromNode = nodes[p.link.from];
            const toNode = nodes[p.link.to];
            
            // Calculate position along quadratic curve
            const startX = fromNode.x * canvas.width / 100;
            const startY = fromNode.y * canvas.height / 100;
            const endX = toNode.x * canvas.width / 100;
            const endY = toNode.y * canvas.height / 100;
            const cpX = (startX + endX) / 2;
            const cpY = startY;

            const t = p.progress;
            const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * cpX + t * t * endX;
            const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * cpY + t * t * endY;

            // Draw glowing data particle
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(59, 130, 246, 0.8)";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(59, 130, 246, 1)";
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        }

        // Draw nodes (databases/tools)
        nodes.forEach(node => {
            const x = node.x * canvas.width / 100;
            const y = node.y * canvas.height / 100;
            
            ctx.beginPath();
            ctx.arc(x, y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(59, 130, 246, 0.5)";
            ctx.stroke();

            // Node Labels (Subtle text)
            ctx.font = "10px Inter";
            ctx.fillStyle = "rgba(100, 116, 139, 0.6)"; // Slate-500
            ctx.fillText(node.label, x + 15, y + 4);
        });

        requestAnimationFrame(animate);
    }

    animate();
}