const fs = require('fs');

try {
    let html = fs.readFileSync('index.html', 'utf8');
    const lines = html.split('\n');
    
    // We want to delete lines 938 to 944.
    // However, let's verify what those lines contain first to be absolutely safe.
    
    // The exact lines to remove (ignoring leading whitespace)
    const toRemove = [
        '</div>',
        '<div class="pricing-footer">',
        '<button class="btn btn-primary btn-read-more" data-plan="premium" style="width: 100%;">Read More</button>',
        '</div>',
        '</div>',
        '</div>',
        '' // Empty line 944
    ];
    
    // Using a reliable start and end string replacement to remove this exact chunk
    // between "</ul>" of Programs and "<div class="footer-links">" of Company.
    
    const targetBlock = `                </ul>
                    </div>
                    <div class="pricing-footer">
                        <button class="btn btn-primary btn-read-more" data-plan="premium" style="width: 100%;">Read More</button>
                    </div>
                </div>
            </div>

            <div class="footer-links">
                <h4>Company</h4>`;
                
    const replacement = `                </ul>
            </div>

            <div class="footer-links">
                <h4>Company</h4>`;
                
    if (html.includes(targetBlock)) {
        html = html.replace(targetBlock, replacement);
        fs.writeFileSync('index.html', html);
        console.log('Successfully fixed footer structure!');
    } else {
        // Fallback: regex to remove the extra pricing-footer from the footer-links
        const regex = /<\/ul>\s*<\/div>\s*<div class="pricing-footer">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div class="footer-links">\s*<h4>Company<\/h4>/;
        if (regex.test(html)) {
            html = html.replace(regex, replacement);
            fs.writeFileSync('index.html', html);
            console.log('Successfully fixed footer structure with regex!');
        } else {
            console.log('Could not find the broken block in footer.');
        }
    }
} catch (e) {
    console.error(e);
}
