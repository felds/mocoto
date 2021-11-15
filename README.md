## Pre reqs

### 1. Firestore database

We use Firebase to persist preferences between runs. Witout it you wont be able to use any features that rely on `get/set/unsetPref` functions (like the [announcer](./src/player/queue-plugin/announcer.ts))

#### Creating the credentials

Skip this step if you already have the credential file in hand

- Go to the [Firebase homepage](https://console.firebase.google.com/)
- Select or create a new firebase project
- Create a new Firestore database (if needed)
  - Navigate to _Firestore Database_ from the side menu
  - Click _Create database_, select _production mode_ and then select the region closer to the final host of the bot
- Generate the credentials
  - Under _Project settings > Service Accounts_, click _Generate new private key_
  - Confirm by clicking _Generate key_. A `.json` file will be downloaded to your computer.

#### Loading the credentials

- Move the aforementioned `.json` file to a non-versioned directory on your computer. I suggest using the `var/` folder of the application itself.
- Create a new environment variable with the full path of the file like so:

```sh
# .env
GOOGLE_APPLICATION_CREDENTIALS=/full/path/to/file/abc123.json
```
