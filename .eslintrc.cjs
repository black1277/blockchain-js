module.exports = {
    "root": true,
    "extends": "standard",
    "rules": {
        "semi": "off",
        "indent": ["error", 2],
        "new-cap": "off",
        "newIsCap": "off",
        "space-before-function-paren": ["error", "never"],
        "no-trailing-spaces": ["error", { "skipBlankLines": true }],
        "no-multiple-empty-lines": ["error", { "max": 4, "maxEOF": 2 }],
    }
};