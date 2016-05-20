// Model Tests
//
require('./models/index');
require('./models/module');
require('./models/sensor');
require('./models/system');
require('./models/user');
require('./models/widget');

// Routes
//
require('./routes/guide');
require('./routes/index');
require('./routes/smartmirror');

// Controller
//
require('./controllers/user');
require('./controllers/weather');

// Clear DB at the end
require('./models/clear');

