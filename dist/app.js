let app = require('express')();
let http = require('http').Server(app);
let path = require('path');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});
http.listen(3000, () => {
    console.log('Listening on *:3000');
});
//# sourceMappingURL=app.js.map