
const spawn = require('child_process').spawn;

let child;

function log (data) {
    let infos = data.toString().split('\n');
    infos.forEach(info => Editor.log(info));
}

module.exports = {
    messages: {
        'deploy-the-aviator' (event) {

            if (child) {
                Editor.warn('Already running deploy-the-aviator');
                return;
            }

            Editor.info('Start to deploy the aviator.');

            child = spawn('npm', ['run', 'deploy'], {
                cwd: Editor.Project.path
            });
            child.stdout.on('data', function (data) {
                log(data);
            });
            child.stderr.on('data', function (data) {
                log(data);
            });
            child.on('close', function () {
                child = null;
                Editor.info('Finished deploying the aviator.');
            });
        }
    }
};
