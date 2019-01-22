const deploy = require('./deploy');
const path = require('path');

deploy({
    base_dir: __dirname,
    deploy_dir: './build/web-mobile',
    repo: 'git@github.com:2youyou2/TheAviator.git'
});
