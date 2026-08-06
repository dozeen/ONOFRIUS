const { execSync } = require('child_process');

module.exports = {
  id: 'git',
  name: 'Git Version Control',

  async run(context) {
    try {
      const gitVer = execSync('git --version', { encoding: 'utf8' }).trim();
      let branch = 'unknown';
      let isClean = true;

      try {
        branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: context.rootDir, encoding: 'utf8' }).trim();
        const status = execSync('git status --porcelain', { cwd: context.rootDir, encoding: 'utf8' }).trim();
        isClean = (status.length === 0);
      } catch (e) {
        // Not a git repo or git error
      }

      if (isClean) {
        return {
          id: this.id,
          name: this.name,
          status: 'OK',
          message: `${gitVer} detected on branch '${branch}' (clean workspace).`,
          fixable: false
        };
      } else {
        return {
          id: this.id,
          name: this.name,
          status: 'WARN',
          message: `${gitVer} on branch '${branch}' (uncommitted changes present).`,
          details: 'Working directory has uncommitted files.',
          fixable: false
        };
      }
    } catch (err) {
      return {
        id: this.id,
        name: this.name,
        status: 'ERROR',
        message: `Git not found or executable error: ${err.message}`,
        fixable: false
      };
    }
  }
};
