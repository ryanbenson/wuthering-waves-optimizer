/**
 * HTML Table Parser for Cypress Test Data Generation
 * 
 * This script parses HTML tables and generates the AttackTests array format
 * for Cypress testing.
 * 
 * Usage:
 * 1. Copy an HTML table from your browser
 * 2. Paste it into the htmlTable variable below
 * 3. Run: node html-table-parser.js
 * 4. Copy the generated array and paste it into your test file
 */

// Paste your HTML table here
const htmlTable = `
<table data-v-6710693d="" class="calculator__damages table table-zebra">
<thead data-v-6710693d="">
<tr data-v-6710693d="">
<th data-v-6710693d="">&nbsp;</th>
<th data-v-6710693d="" class="w-20">Normal</th>
<th data-v-6710693d="" class="w-20">Average</th>
<th data-v-6710693d="" class="w-20">Crit</th>
</tr>
</thead>
<tbody data-v-6710693d="">
<tr data-v-7dbc0eab="" data-v-6710693d="" class="stage-1-dmg">
<td data-v-7dbc0eab="">Stage 1 DMG</td>
<td data-v-7dbc0eab="" class="v-popper--has-tooltip">7285</td>
<td data-v-7dbc0eab="" class="v-popper--has-tooltip">15568</td>
<td data-v-7dbc0eab="" class="v-popper--has-tooltip">16973</td>
</tr>
<tr data-v-7dbc0eab="" data-v-6710693d="" class="stage-2-dmg">
<td data-v-7dbc0eab="">Stage 2 DMG</td>
<td data-v-7dbc0eab="" class="v-popper--has-tooltip">14618</td>
<td data-v-7dbc0eab="" class="v-popper--has-tooltip">31241</td>
<td data-v-7dbc0eab="" class="v-popper--has-tooltip">34060</td>
</tr>
</tbody>
</table>
`;

/**
 * Parses HTML table and generates AttackTests array format
 * @param {string} html - HTML table string
 * @returns {string} Generated JavaScript array
 */
function parseHtmlTable(html) {
    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find all table rows with class attributes
    const rows = doc.querySelectorAll('tbody tr[class]');
    
    const results = [];
    
    rows.forEach(row => {
        const className = row.className;
        const cells = row.querySelectorAll('td');
        
        if (cells.length === 0) return;
        
        // Extract the attack name (first cell)
        const attackName = cells[0].textContent.trim();
        
        // Extract damage values (remaining cells)
        const values = [attackName];
        
        for (let i = 1; i < cells.length; i++) {
            const value = cells[i].textContent.trim();
            if (value) {
                values.push(value);
            }
        }
        
        // Create the test object
        const testObject = {
            selector: `.${className}`,
            values: values
        };
        
        results.push(testObject);
    });
    
    return results;
}

/**
 * Formats the results as a JavaScript array string
 * @param {Array} results - Array of test objects
 * @returns {string} Formatted JavaScript array
 */
function formatAsJavaScriptArray(results) {
    let output = '[\n';
    
    results.forEach((result, index) => {
        output += '    {\n';
        output += `        selector: "${result.selector}",\n`;
        output += `        values: [${result.values.map(v => `"${v}"`).join(', ')}],\n`;
        output += '    }';
        
        if (index < results.length - 1) {
            output += ',';
        }
        output += '\n';
    });
    
    output += '];';
    return output;
}

// For Node.js environment (if running with node)
if (typeof window === 'undefined') {
    // Use jsdom for Node.js
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(htmlTable);
    const document = dom.window.document;
    
    function parseHtmlTableNode(html) {
        const parser = new JSDOM(html);
        const doc = parser.window.document;
        
        const rows = doc.querySelectorAll('tbody tr[class]');
        const results = [];
        
        rows.forEach(row => {
            const className = row.className;
            const cells = row.querySelectorAll('td');
            
            if (cells.length === 0) return;
            
            const attackName = cells[0].textContent.trim();
            const values = [attackName];
            
            for (let i = 1; i < cells.length; i++) {
                const value = cells[i].textContent.trim();
                if (value) {
                    values.push(value);
                }
            }
            
            const testObject = {
                selector: `.${className}`,
                values: values
            };
            
            results.push(testObject);
        });
        
        return results;
    }
    
    const results = parseHtmlTableNode(htmlTable);
    console.log('Generated Test Array:');
    console.log(formatAsJavaScriptArray(results));
    
    console.log('\n' + '='.repeat(50));
    console.log('Copy the array above and paste it into your test file!');
    console.log('='.repeat(50));
}

// For browser environment
if (typeof window !== 'undefined') {
    // Browser version
    const results = parseHtmlTable(htmlTable);
    console.log('Generated Test Array:');
    console.log(formatAsJavaScriptArray(results));
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseHtmlTable, formatAsJavaScriptArray };
}
