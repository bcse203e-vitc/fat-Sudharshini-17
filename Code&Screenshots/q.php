<?php
function lineSum(string $filename, int $lineNumber): int {
    
    if (!file_exists($filename)) {
        
        return 0;
    }

    $handle = fopen($filename, "r");
    if (!$handle) {
        return 0;
    }

    $currentLine = 0;
    while (($line = fgets($handle)) !== false) {
        $currentLine++;

        $trimmed = trim($line);
        if ($trimmed === "" || str_starts_with($trimmed, "#")) {
            continue;
        }

        if ($currentLine === $lineNumber) {
            fclose($handle);

            $sum = 0;
            $tokens = preg_split('/\s+/', $trimmed);

            foreach ($tokens as $token) {
                if (filter_var($token, FILTER_VALIDATE_INT) !== false) {
                    $sum += (int)$token;
                }
            }
            return $sum;
        }
    }

    fclose($handle);
    return 0;
}

echo lineSum("sums.txt", 2) . "\n"; 
echo lineSum("sums.txt", 5) . "\n";
?>
