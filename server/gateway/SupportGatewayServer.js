const http = require('http');
const PORT = process.env.PORT || 7000;
const server = http.createServer((req, res) => {
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'online', service: 'Enterprise AI Support Gateway', version: '1.5.0', activeTickets: 182, avgResponseSec: 1.8 }));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Enterprise AI Support Copilot Active</h1>');
});
if (require.main === module) { server.listen(PORT, () => console.log(`Support Gateway listening on port ${PORT}`)); }
module.exports = server;
