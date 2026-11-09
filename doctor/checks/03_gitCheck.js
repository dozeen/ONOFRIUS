const { execSync } = require('child_process');

module.exports = {
  id: 'git',
  name: 'Git Version Control',

  async run(context) {
    try {
      execSync('git --version', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      let branch = 'main';
      let isClean = true;
      let hasOrigin = false;

      try {
        branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: context.rootDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
        const status = execSync('git status --porcelain', { cwd: context.rootDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
        isClean = (status.length === 0);
        const remotes = execSync('git remote', { cwd: context.rootDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
        hasOrigin = remotes.includes('origin');
      } catch (e) {
        // Fallback for git commands
      }

      const originStr = hasOrigin ? 'origin OK' : 'no origin';
      const treeStr = isClean ? 'working tree clean' : '⚠ Uncommitted changes';

      if (isClean) {
        return {
          id: this.id,
          name: this.name,
          status: 'OK',
          message: `Git Repository (${branch} | ${originStr} | ${treeStr})`,
          branch,
          hasOrigin,
          isClean,
          fixable: false
        };
      } else {
        return {
          id: this.id,
          name: this.name,
          status: 'WARN',
          message: `Git Repository (${branch} | ${originStr} | ${treeStr})`,
          branch,
          hasOrigin,
          isClean,
          fixable: false
        };
      }
    } catch (err) {
      return {
        id: this.id,
        name: this.name,
        status: 'ERROR',
        message: `Git not installed or repository error: ${err.message}`,
        fixable: false
      };
    }
  }
};
