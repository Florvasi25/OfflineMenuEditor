module.exports = {
  packagerConfig: {
    asar: true,
    icon: '/Users/florv/Documents/FLIPDISH/OME/Electron/OfflineMenuEditor/assets/FlipdishIcon',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: 'https://github.com/FranciscoAndreoli/OfflineMenuEditor/blob/FlorBranch/assets/FlipdishIcon.ico',
        setupIcon: '/Users/florv/Documents/FLIPDISH/OME/Electron/OfflineMenuEditor/assets/FlipdishIcon.ico'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: '/Users/florv/Documents/FLIPDISH/OME/Electron/OfflineMenuEditor/assets/FlipdishIcon',
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
