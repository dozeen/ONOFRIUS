module.exports = {
  id: 'node',
  name: 'Node.js Runtime',

  async run(context) {
    try {
      const versionStr = process.version;
      const majorVersion = parseInt(versionStr.replace('v', '').split('.')[0], 10);

      if (majorVersion >= 18) {
        return {
          id: this.id,
          name: this.name,
          status: 'OK',
          message: `Node.js ${versionStr} installed (>= v18 required).`,
          fixable: false
        };
      } else {
        return {
          id: this.id,
          name: this.name,
          status: 'ERROR',
          message: `Node.js ${versionStr} is lower than recommended v18+.`,
          details: 'Please upgrade Node.js to v18, v20 or v22.',
          fixable: false
        };
      }
    } catch (err) {
      return {
        id: this.id,
        name: this.name,
        status: 'ERROR',
        message: `Failed to detect Node.js runtime: ${err.message}`,
        fixable: false
      };
    }
  }
};
