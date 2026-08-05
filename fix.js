const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The corrupted block starts at:
//                 <!-- Step 5 -->
//                 <div class="timeline-step">
//                     <div class="step-number">05</div>
//                     <div class="step-content glass-

const step5Start = html.indexOf('<!-- Step 5 -->');
const servicesStart = html.indexOf('<!-- Services Grid -->');

if (step5Start > -1 && servicesStart > -1) {
    const fixedBlock = `<!-- Step 5 -->
                <div class="timeline-step">
                    <div class="step-number">05</div>
                    <div class="step-content glass-card">
                        <h3>Sponsorship & Offer Signing</h3>
                        <p>Review final offers, execute counter-proposals with our staff, sign agreements, and align visa transfers (OPT/H-1B/EAD) smoothly.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    `;
    
    html = html.substring(0, step5Start) + fixedBlock + html.substring(servicesStart);
    fs.writeFileSync('index.html', html);
    console.log('Fixed index.html structure');
} else {
    console.log('Could not find markers');
}
