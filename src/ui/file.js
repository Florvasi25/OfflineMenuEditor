function saveToFile(data) {
    const updatedJsonData = JSON.stringify(data, null, 2); // Pretty-print JSON
    const blob = new Blob([updatedJsonData], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'updated_data.json';
    a.textContent = 'Download Updated JSON';

    a.style.display = 'none'; // Hide the link
    document.body.appendChild(a);

    a.click(); // Programmatically trigger the click event

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export { saveToFile }
