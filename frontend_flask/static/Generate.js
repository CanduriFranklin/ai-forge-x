document.addEventListener('DOMContentLoaded', function() {
    const root = document.getElementById('root');
    root.innerHTML = '<h1>Welcome to AI Forge X</h1>';

    // Add your custom JavaScript here

    // Execute Query button event listener
    document.getElementById('execute-query').addEventListener('click', function() {
        const query = document.getElementById('query-input').value;
        console.log('Executing query:', query);
        // Add code to execute the query and update the visualization
    });

    // Export as CSV button event listener
    document.getElementById('export-csv').addEventListener('click', function() {
        console.log('Exporting data as CSV');
        // Add code to export data as CSV
    });

    // Export as JSON button event listener
    document.getElementById('export-json').addEventListener('click', function() {
        console.log('Exporting data as JSON');
        // Add code to export data as JSON
    });

    // Execute Inference button event listener
    document.getElementById('execute-inference').addEventListener('click', function() {
        console.log('Executing inference');
        // Add code to execute inference
    });
});