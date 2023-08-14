# OfflineMenuEditor

## Python Dependencies

- python -m venv venv
- . venv/Scripts/activate
- pip install -r requirements.txt


## Node Dependencies

- npm install electron
- npm install electron-reload
- npm install electron-builder --save-dev
- npm install -g concurrently

- npm install --save-dev electron-packager
- npm install --save-dev cross-env

## Packaging
Install Electron Forge's CLI in the project's devDependencies and import the existing project with a handy conversion script.

- npm install --save-dev @electron-forge/cli
- npx electron-forge import

To create a distributable, run the following command:

- npm run make

After the script runs, you should see an out folder containing both the distributable and a folder containing the packaged application code.
