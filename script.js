// Function to generate a random number within a range
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a mock IP address
function mockIPAddress(originalIP) {
    const parts = originalIP.split('.');
    return parts.map(part => {
        const num = parseInt(part);
        if (num >= 0 && num <= 127) return randomInt(0, 127);
        if (num >= 128 && num <= 191) return randomInt(128, 191);
        if (num >= 192 && num <= 223) return randomInt(192, 223);
        return randomInt(224, 255);
    }).join('.');
}

// Function to generate a mock MAC address
function mockMACAddress() {
    return Array.from({length: 6}, () => 
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join(':');
}

// Function to generate a mock hostname
function mockHostname(original) {
    const prefixes = ['srv', 'host', 'node', 'dev', 'prod', 'test'];
    const suffixes = ['.local', '.net', '.com', '.org', '.int'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * prefixes.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    return `${randomPrefix}${randomNumber}${randomSuffix}`;
}

// Function to generate a mock IPv6 address
function mockIPv6Address(originalIPv6) {
    if (originalIPv6.startsWith('fe80::')) {
        // For Link-local addresses, keep the 'fe80::' prefix
        return 'fe80::' + Array.from({length: 5}, () => 
            Math.floor(Math.random() * 65536).toString(16).padStart(4, '0')
        ).join(':');
    } else {
        // For other IPv6 addresses
        return Array.from({length: 8}, () => 
            Math.floor(Math.random() * 65536).toString(16).padStart(4, '0')
        ).join(':');
    }
}

// Main anonymization function
function anonymize() {
    const input = document.getElementById('input').value;
    let output = input;

    // Create maps to consistently replace values
    const ipMap = new Map();
    const ipv6Map = new Map();
    const macMap = new Map();
    const hostnameMap = new Map();

    // Replace IPv4 addresses
    output = output.replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, function(ip) {
        if (!ipMap.has(ip)) {
            ipMap.set(ip, mockIPAddress(ip));
        }
        return ipMap.get(ip);
    });

    // Replace IPv6 addresses (including Link-local)
    output = output.replace(/\b(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}\b|\bfe80::[a-fA-F0-9:]+\b/gi, function(ipv6) {
        if (!ipv6Map.has(ipv6)) {
            ipv6Map.set(ipv6, mockIPv6Address(ipv6));
        }
        return ipv6Map.get(ipv6);
    });

    // Replace MAC addresses
    output = output.replace(/\b([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})\b/g, function(mac) {
        if (!macMap.has(mac)) {
            macMap.set(mac, mockMACAddress());
        }
        return macMap.get(mac);
    });

    // Replace hostnames
    output = output.replace(/\b(?!(?:\d{1,3}\.){3}\d{1,3}\b)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\b/g, function(hostname) {
        if (!hostnameMap.has(hostname)) {
            hostnameMap.set(hostname, mockHostname(hostname));
        }
        return hostnameMap.get(hostname);
    });

    document.getElementById('output').value = output;
}

// Function to copy text to clipboard
function copyToClipboard() {
    const output = document.getElementById('output');
    output.select();
    output.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand('copy');

    const copyButton = document.querySelector('.copy-button');
    const originalText = copyButton.innerHTML;
    copyButton.innerHTML = '<span>&#10003;</span> Copied to clipboard';

    setTimeout(() => {
        copyButton.innerHTML = originalText;
    }, 2000); // Show message for 2 seconds
}
