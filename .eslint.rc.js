module.exports = {
    // ... other ESLint configuration options ...
  
    overrides: [
      {
        files: ['*.js'], // Specify the file extensions you want to apply this override to
        env: {
          // Only apply this override when CI environment variable is set to true
          CI: true,
        },
        rules: {
          'no-unused-vars': 'off', // Disable the no-unused-vars rule
        },
      },
    ],
  };