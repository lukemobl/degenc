## File structure

Application file structure and explanations:

```
client/
├── build/ (react application production build)
├── src/ (.jsx source files)
└── public/ (public assets to be served by the application)
server/
├── src/ (all source js files)
│ ├── bootstrap.css
│ ├── bootstrap.min.css
│ ├── bootstrap-theme.css
│ └── bootstrap-theme.min.css
├── favicono.svg
├── package-lock.json
├── package.json
└── README.md
design/
├── cryptosplashlive-v2-ui-mockup.psd (photoshop design mockup file)
└── frontend.rar (premade frontend files)
scripts/
├── build-local.sh (shell script file to build and compile the application)
├── deploy-local.sh (script to run build-local.sh and deploy to a remote server)
└── deploy-remote.sh (unzip and install dependencies on the remote server)
```
