<script>

const fs = require('fs');
const path = require('path');


function calculate_charges(duration_hours) {
    if (duration_hours <= 0) return { error: true, charge: 0 };

    const hrs = Math.ceil(duration_hours);

    const DAILY_MAX = 10.0;

    const fullDays = Math.floor(hrs / 24);
    const remainingHours = hrs % 24;

    let charge = fullDays * DAILY_MAX;

    if (remainingHours > 0) {
        if (remainingHours <= 3) {
            
            charge += 2.0;
        } else {
            charge += 2.0 + (remainingHours - 3) * 0.5;
        }

        
        if (charge - fullDays * DAILY_MAX > DAILY_MAX) {
            charge = (fullDays + 1) * DAILY_MAX;
        }
    }

    return { error: false, charge };
}

/
function processCSV() {
    const inputPath = path.join(__dirname, 'yesterday.csv');
    const outputPath = path.join(__dirname, 'charges_report.csv');

    const raw = fs.readFileSync(inputPath, 'utf8').trim();
    const rows = raw.split('\n');

    const header = "customer_id,duration_hours,charge,error_flag\n";
    let outputLines = [header];

    let totalReceipts = 0;
    let numDailyMaxCustomers = 0;
    let maxDuration = 0;
    let longestStayers = [];

    for (let line of rows) {
        const [customer_id, entry_ts, exit_ts] = line.split(',');

        const entry = new Date(entry_ts);
        const exit = new Date(exit_ts);

        const durationMs = exit - entry;
        const durationHours = durationMs / 1000 / 3600;

        let result = calculate_charges(durationHours);
        let roundedHours = Math.max(0, Math.ceil(durationHours));

        let error_flag = result.error ? "ERROR" : "";

        if (!result.error) {
            totalReceipts += result.charge;

            if (result.charge % 10 === 0 && result.charge !== 0) {
                numDailyMaxCustomers++;
            }

            if (roundedHours > maxDuration) {
                maxDuration = roundedHours;
                longestStayers = [customer_id];
            } else if (roundedHours === maxDuration) {
                longestStayers.push(customer_id);
            }
        }

        outputLines.push(
            `${customer_id},${roundedHours},${result.charge.toFixed(2)},${error_flag}`
        );
    }

    fs.writeFileSync(outputPath, outputLines.join('\n'), 'utf8');

    console.log("=== SUMMARY REPORT ===");
    console.log("Total receipts: $" + totalReceipts.toFixed(2));
    console.log("Number of customers charged daily max: " + numDailyMaxCustomers);
    console.log("Average charge: $" + (totalReceipts / rows.length).toFixed(2));
    console.log("Longest stay(s) duration: " + maxDuration + " hours");
    console.log("Customer IDs with longest stay: " + longestStayers.join(", "));
}

processCSV();
</script>
