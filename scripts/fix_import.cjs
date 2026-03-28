const fs = require('fs');
const path = 'app/pages/admin/settings.vue';
let content = fs.readFileSync(path, 'utf8');

const regex = /import \{([^\}]+)\} ,([^}]+)\} from '@tabler\/icons-vue'/;
content = content.replace(regex, "import { $1, $2 } from '@tabler/icons-vue'");

fs.writeFileSync(path, content);
