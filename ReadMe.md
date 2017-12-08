*** This is Android Automator ***

Ever needed simple tool to automate some actions on Android phone? In a form "if there is ... on a screen, then click here"? Then "Andromator" is a tool for you!

Just clone repo, make some screenshots, change configuration file (which area and where to click) and plug your phone to USB!

** Prerequisits **

- Installed latest stable NodeJS (8.9 is ok).
- Enable USB Debugging on your phone
- Have `adb` tool installed on your box

** How to use **

1. Close repo: `git clone https://github.com/olostan/andromator.git`

2. Make sure `adb` is working correctly: run `adb devices` - you should see yours connected and listed

3. Make some screenshots: `adb shell screencap -p  >your_filename.png`

4. Copy `config.json.sample` into `config.json`

5. Modify `config.json` to specify screenshot you've made, area to match and point where to tap

6. Run the script: `node index.js`

...watch!


